"""Alert-to-Issue Webhook Service - Automatic GitHub issue creation from Grafana alerts."""

import logging
import json
import hmac
import hashlib
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app.config import Config
from app.models import GrafanaAlertPayload, WebhookResponse, LLMAnalysis
from app.error_parser import ErrorParser
from app.llm_service import LLMService
from app.github_service import GitHubService

# Configure logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management."""
    logger.info("Starting Alert-to-Issue Webhook Service")
    logger.info(f"Port: {Config.SERVICE_PORT}")
    logger.info(f"OpenAI Model: {Config.OPENAI_MODEL}")
    logger.info(f"GitHub Assignee: {Config.GITHUB_ASSIGNEE}")
    yield
    logger.info("Shutting down Alert-to-Issue Webhook Service")


# Initialize FastAPI app
app = FastAPI(
    title="Alert-to-Issue Webhook Service",
    description="Auto-creates GitHub issues from Grafana alerts using AI analysis",
    version="1.0.0",
    lifespan=lifespan,
)


# ============ Health Check Endpoints ============

@app.get("/")
async def root():
    """Root health check."""
    return {
        "service": "Alert-to-Issue Webhook",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "configuration": {
            "openai_configured": bool(Config.OPENAI_API_KEY),
            "github_configured": bool(Config.GITHUB_TOKEN),
            "github_assignee": Config.GITHUB_ASSIGNEE,
        },
        "timestamp": datetime.utcnow().isoformat()
    }


# ============ Webhook Verification ============

def _api_key_from_request(request: Request) -> str | None:
    """Extract bearer/API key from common webhook header patterns."""
    if key := request.headers.get("X-Api-Key"):
        return key.strip() or None
    if key := request.headers.get("X-Webhook-Token"):
        return key.strip() or None
    auth = request.headers.get("Authorization") or ""
    if auth.lower().startswith("bearer "):
        token = auth[7:].strip()
        return token or None
    return None


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """
    Verify webhook signature if WEBHOOK_SECRET is configured.
    
    Args:
        payload: Raw request body
        signature: Signature header value
        
    Returns:
        True if signature is valid or no secret configured
    """
    if not Config.WEBHOOK_SECRET:
        return True
    
    try:
        expected = hmac.new(
            Config.WEBHOOK_SECRET.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception as e:
        logger.error(f"Signature verification error: {e}")
        return False


# ============ Main Webhook Endpoint ============

@app.post("/webhook/grafana", response_model=WebhookResponse)
async def handle_grafana_alert(request: Request):
    """
    Handle Grafana alert and create GitHub issue.
    
    Workflow:
    1. Verify webhook signature (optional)
    2. Extract error from Grafana alert
    3. Parse error using error parser
    4. Analyze error with LLM
    5. Create GitHub issue with analysis
    6. Assign to configured user
    
    Args:
        request: FastAPI request object
        
    Returns:
        WebhookResponse with issue details or error
    """
    logger.info("Received Grafana alert webhook")
    
    try:
        # Get raw body for signature verification
        body = await request.body()
        
        # Step 0: Webhook auth (optional)
        # - WEBHOOK_SECRET: requires X-Webhook-Signature = HMAC-SHA256(secret, raw body).hexdigest()
        # - WEBHOOK_API_KEY: requires X-Api-Key, X-Webhook-Token, or Authorization: Bearer <key>
        # If both are set, either method may be used (e.g. HMAC from scripts, static key from Grafana).
        has_hmac = bool(Config.WEBHOOK_SECRET)
        has_api_key = bool(Config.WEBHOOK_API_KEY)

        if has_hmac or has_api_key:
            x_webhook_signature = request.headers.get("X-Webhook-Signature")
            hmac_ok = (
                has_hmac
                and bool(x_webhook_signature)
                and verify_webhook_signature(body, x_webhook_signature)
            )
            received_key = _api_key_from_request(request)
            api_ok = False
            if has_api_key and received_key:
                try:
                    api_ok = hmac.compare_digest(
                        Config.WEBHOOK_API_KEY.encode("utf-8"),
                        received_key.encode("utf-8"),
                    )
                except Exception:
                    api_ok = False

            if has_hmac and not has_api_key:
                if not x_webhook_signature:
                    logger.error("Webhook signature required but not provided")
                    raise HTTPException(
                        status_code=401,
                        detail="Missing X-Webhook-Signature header (HMAC-SHA256 of raw body using WEBHOOK_SECRET)",
                    )
                if not hmac_ok:
                    logger.error(
                        f"Expected: {hmac.new(Config.WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()[:20]}..."
                    )
                    logger.error(f"Got: {x_webhook_signature[:20]}...")
                    logger.warning("Webhook signature verification failed")
                    raise HTTPException(status_code=401, detail="Invalid signature")
            elif has_api_key and not has_hmac:
                if not received_key:
                    logger.error("Webhook API key required but not provided")
                    raise HTTPException(
                        status_code=401,
                        detail="Missing API key: set header X-Api-Key, X-Webhook-Token, or Authorization: Bearer <WEBHOOK_API_KEY>",
                    )
                if not api_ok:
                    logger.warning("Webhook API key verification failed")
                    raise HTTPException(status_code=401, detail="Invalid API key")
            else:
                if not (hmac_ok or api_ok):
                    if not x_webhook_signature and not received_key:
                        logger.error(
                            "Webhook auth required: no X-Webhook-Signature and no API key header"
                        )
                        raise HTTPException(
                            status_code=401,
                            detail="Missing authentication: X-Webhook-Signature (HMAC) or X-Api-Key / Bearer token",
                        )
                    logger.warning("Webhook authentication failed (HMAC and API key both invalid)")
                    raise HTTPException(status_code=401, detail="Invalid webhook authentication")
        
        # Parse JSON body
        payload_dict = json.loads(body.decode())
        payload = GrafanaAlertPayload(**payload_dict)
        
        logger.info(f"Received Grafana alert: {payload.ruleName}")
        
        # Step 1: Extract error information from Grafana annotations
        logger.info("Step 1: Extracting error from Grafana alert")
        
        error_log = payload.commonAnnotations.get(
            "error_log",
            payload.commonAnnotations.get("description", payload.message or "Unknown error")
        )
        
        repo = payload.commonAnnotations.get("repo")
        service_name = payload.commonAnnotations.get("service_name", "unknown-service")
        environment = payload.commonAnnotations.get("environment", "production")
        
        if not repo:
            raise ValueError(
                "Missing 'repo' in Grafana alert annotations. "
                "Format: org/repo-name"
            )
        
        if not error_log:
            raise ValueError("No error message found in Grafana alert")
        
        logger.info(f"Repository: {repo}")
        logger.info(f"Service: {service_name}")
        logger.info(f"Environment: {environment}")
        logger.info(f"Error: {error_log[:100]}...")
        
        # Step 2: Parse error log
        logger.info("Step 2: Parsing error information")
        parsed_error = ErrorParser.parse(error_log)
        logger.info(f"Error Type: {parsed_error.error_type}")
        
        # Step 3: Generate LLM analysis
        logger.info("Step 3: Analyzing error with LLM")
        llm_service = LLMService()

        llm_response = llm_service.generate_fix(
            error_log=error_log,
            parsed_error=parsed_error,
            relevant_files={},  # Issue flow has no repo file context
            repo_name=repo,
            branch="",
        )

        root_cause = llm_response.root_cause
        suggested_fix = llm_response.suggested_fix
        
        logger.info(f"Root Cause: {root_cause[:80]}...")
        logger.info(f"Suggested Fix: {suggested_fix[:80]}...")
        
        # Step 4: Create GitHub issue
        logger.info("Step 4: Creating GitHub issue")
        github_service = GitHubService()
        
        issue_result = github_service.create_issue(
            repo_name=repo,
            service_name=service_name,
            error_log=error_log,
            root_cause=root_cause,
            suggested_fix=suggested_fix,
            severity="high",  # Can be enhanced to parse from payload
            environment=environment,
        )
        
        logger.info(f"Successfully created issue #{issue_result.issue_number}: {issue_result.issue_url}")
        
        return WebhookResponse(
            status="success",
            message=f"Alert processed! Issue created: #{issue_result.issue_number}",
            issue_url=issue_result.issue_url,
            issue_number=issue_result.issue_number,
        )
    
    except ValueError as e:
        error_msg = str(e)
        logger.error(f"Validation Error: {error_msg}")
        
        return WebhookResponse(
            status="error",
            message="Validation failed",
            error=error_msg,
        )
    
    except HTTPException as e:
        raise
    
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        
        return WebhookResponse(
            status="error",
            message="Failed to process alert",
            error=str(e),
        )


# ============ Exception Handlers ============

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail,
            "error": str(exc),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error",
            "error": str(exc),
        },
    )


# ============ Application Entry Point ============

if __name__ == "__main__":
    import uvicorn

    # Validate configuration
    Config.validate()
    logger.info("Configuration validated")

    # Run server
    uvicorn.run(
        "app.main:app",
        host=Config.SERVICE_HOST,
        port=Config.SERVICE_PORT,
        reload=False,
        log_level=Config.LOG_LEVEL.lower(),
    )
