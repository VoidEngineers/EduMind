"""Self-Healing Webhook Service - AI-powered CI/CD failure fixer."""

import logging
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.responses import JSONResponse
import hmac
import hashlib

from app.config import Config
from app.models import (
    GrafanaAlertPayload, 
    WebhookRequest, 
    WebhookResponse,
    PullRequestResult
)
from app.error_parser import ErrorParser
from app.repo_service import RepoService
from app.llm_service import LLMService
from app.patch_service import PatchService
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
    logger.info("Starting Self-Healing Webhook Service")
    logger.info(f"Port: {Config.SERVICE_PORT}")
    logger.info(f"Clone Dir: {Config.CLONE_DIRECTORY}")
    logger.info(f"OpenAI Model: {Config.OPENAI_MODEL}")
    yield
    logger.info("Shutting down Self-Healing Webhook Service")


# Initialize FastAPI app
app = FastAPI(
    title="Self-Healing Webhook Service",
    description="Auto-fixes CI/CD failures using AI",
    version="2.0.0",
    lifespan=lifespan,
)


# ============ Health Check Endpoints ============

@app.get("/")
async def root():
    """Root health check."""
    return {
        "service": "Self-Healing Webhook",
        "status": "healthy",
        "version": "2.0.0",
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
            "clone_directory": Config.CLONE_DIRECTORY,
        },
        "timestamp": datetime.utcnow().isoformat()
    }


# ============ Webhook Verification ============

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


# ============ Main Webhook Endpoints ============

@app.post("/webhook/grafana", response_model=WebhookResponse)
async def handle_grafana_webhook(
    payload: GrafanaAlertPayload,
    x_grafana_signature: str = Header(None),
    request: Request = None
):
    """
    Handle Grafana alert webhook for self-healing automation.
    
    Workflow:
    1. Parse Grafana alert payload
    2. Extract error information from annotations
    3. Generate fix using LLM
    4. Create PR with automated fix
    
    Args:
        payload: Grafana alert JSON payload
        x_grafana_signature: Optional webhook signature
        request: FastAPI request object
        
    Returns:
        WebhookResponse with PR details or error
    """
    logger.info(f"Received Grafana alert: {payload.ruleName}")
    
    repo_service = None
    repo = None
    
    try:
        # Step 0: Verify webhook (optional)
        if Config.WEBHOOK_SECRET and request:
            body = await request.body()
            if not verify_webhook_signature(body, x_grafana_signature or ""):
                logger.warning("Webhook signature verification failed")
                raise HTTPException(status_code=401, detail="Invalid signature")
        
        # Step 1: Extract error information from Grafana annotations
        logger.info("Step 1: Extracting error from Grafana alert")
        
        error_log = payload.commonAnnotations.get(
            "error_log",
            payload.commonAnnotations.get("description", payload.message or "Unknown error")
        )
        
        repo = payload.commonAnnotations.get("repo")
        branch = payload.commonAnnotations.get("branch", "main")
        
        if not repo:
            raise ValueError(
                "Missing 'repo' in Grafana alert annotations. "
                "Format: org/repo-name"
            )
        
        if not error_log:
            raise ValueError("No error message found in Grafana alert")
        
        logger.info(f"Repository: {repo}")
        logger.info(f"Branch: {branch}")
        logger.info(f"Error: {error_log[:100]}...")
        
        # Step 2: Parse error log
        logger.info("Step 2: Parsing error information")
        parsed_error = ErrorParser.parse(error_log)
        logger.info(f"Error Type: {parsed_error.error_type}")
        
        # Step 3: Clone repository
        logger.info("Step 3: Cloning repository")
        repo_service = RepoService()
        repo_obj = repo_service.clone_repository(repo, branch)
        logger.info("Repository cloned")
        
        # Step 4: Get relevant files
        logger.info("Step 4: Analyzing relevant files")
        relevant_files = repo_service.get_relevant_files(repo_obj)
        logger.info(f"Found {len(relevant_files)} relevant files")
        
        # Step 5: Generate fix using LLM
        logger.info("Step 5: Generating fix with AI")
        llm_service = LLMService()
        llm_response = llm_service.generate_fix(
            error_log=error_log,
            parsed_error=parsed_error,
            relevant_files=relevant_files,
            repo_name=repo,
            branch=branch,
        )
        logger.info(f"Root Cause: {llm_response.root_cause[:80]}...")
        logger.info(f"Files to modify: {llm_response.files_to_modify}")
        
        # Step 6: Create fix branch
        logger.info("Step 6: Creating feature branch")
        branch_name = repo_service.create_fix_branch(repo_obj)
        logger.info(f"Branch: {branch_name}")
        
        # Step 7: Apply patch
        logger.info("Step 7: Applying patch")
        patch_success = PatchService.apply_patch(
            repo_obj,
            llm_response.patch,
            llm_response.files_to_modify
        )
        
        if not patch_success:
            raise Exception("Failed to apply patch to files")
        logger.info("Patch applied successfully")
        
        # Step 8: Commit changes
        logger.info("Step 8: Committing changes")
        PatchService.commit_changes(
            repo_obj,
            branch_name,
            llm_response.summary
        )
        logger.info("Changes committed")
        
        # Step 9: Push and create PR
        logger.info("Step 9: Pushing branch and creating PR")
        github_service = GitHubService()
        github_service.push_branch(repo_obj, branch_name)
        
        pr_result = github_service.create_pull_request(
            repo_name=repo,
            branch_name=branch_name,
            base_branch=branch,
            root_cause=llm_response.root_cause,
            summary=llm_response.summary,
            error_log=error_log,
        )
        
        logger.info(f"Successfully created PR: {pr_result.pr_url}")
        
        # Cleanup
        if repo_service:
            repo_service.cleanup_repository(repo)
        
        return WebhookResponse(
            status="success",
            message=f"Auto-fixed! PR created: #{pr_result.pr_number}",
            pr_url=pr_result.pr_url,
        )
    
    except ValueError as e:
        error_msg = str(e)
        logger.error(f"Validation Error: {error_msg}")
        
        if repo_service and repo:
            repo_service.cleanup_repository(repo)
        
        return WebhookResponse(
            status="error",
            message="Validation failed",
            error=error_msg,
        )
    
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        
        if repo_service and repo:
            try:
                repo_service.cleanup_repository(repo)
            except:
                pass
        
        return WebhookResponse(
            status="error",
            message="Failed to auto-fix pipeline failure",
            error=str(e),
        )


@app.post("/webhook/generic", response_model=WebhookResponse)
async def handle_generic_webhook(payload: WebhookRequest):
    """
    Generic webhook endpoint for manual error fixing.
    
    Accepts structured webhook payloads with repo, branch, and error.
    
    Args:
        payload: WebhookRequest with fix details
        
    Returns:
        WebhookResponse with PR details or error
    """
    logger.info(f"Received generic webhook for {payload.repo}")
    
    repo_service = None
    
    try:
        # Parse error
        logger.info("Parsing error...")
        parsed_error = ErrorParser.parse(payload.error_log)
        
        # Clone repo
        logger.info("Cloning repository...")
        repo_service = RepoService()
        repo_obj = repo_service.clone_repository(
            payload.repo,
            payload.branch,
            payload.commit
        )
        
        # Get files
        relevant_files = repo_service.get_relevant_files(repo_obj)
        logger.info(f"Found {len(relevant_files)} relevant files")
        
        # Generate fix
        logger.info("Generating fix...")
        llm_service = LLMService()
        llm_response = llm_service.generate_fix(
            error_log=payload.error_log,
            parsed_error=parsed_error,
            relevant_files=relevant_files,
            repo_name=payload.repo,
            branch=payload.branch,
        )
        
        # Create branch
        branch_name = repo_service.create_fix_branch(repo_obj)
        
        # Apply patch
        patch_success = PatchService.apply_patch(
            repo_obj,
            llm_response.patch,
            llm_response.files_to_modify
        )
        
        if not patch_success:
            raise Exception("Failed to apply patch")
        
        # Commit
        PatchService.commit_changes(repo_obj, branch_name, llm_response.summary)
        
        # Push and create PR
        github_service = GitHubService()
        github_service.push_branch(repo_obj, branch_name)
        
        pr_result = github_service.create_pull_request(
            repo_name=payload.repo,
            branch_name=branch_name,
            base_branch=payload.branch,
            root_cause=llm_response.root_cause,
            summary=llm_response.summary,
            error_log=payload.error_log,
        )
        
        logger.info(f"PR created: {pr_result.pr_url}")
        
        if repo_service:
            repo_service.cleanup_repository(payload.repo)
        
        return WebhookResponse(
            status="success",
            message=f"Auto-fixed! PR created: #{pr_result.pr_number}",
            pr_url=pr_result.pr_url,
        )
    
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        
        if repo_service:
            try:
                repo_service.cleanup_repository(payload.repo)
            except:
                pass
        
        return WebhookResponse(
            status="error",
            message="Failed to auto-fix",
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
