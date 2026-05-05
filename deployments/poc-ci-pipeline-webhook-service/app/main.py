"""Alert-to-Issue Webhook Service - Automatic GitHub issue creation from Grafana alerts."""

import logging
import json
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
    logger.info(f"GitHub Assignee: {Config.ASSIGNEE_GITHUB_ISSUE}")
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
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "configuration": {
            "openai_configured": bool(Config.OPENAI_API_KEY),
            "github_configured": bool(Config.GITHUB_TOKEN),
            "github_assignee": Config.ASSIGNEE_GITHUB_ISSUE,
        },
        "timestamp": datetime.utcnow().isoformat(),
    }


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

        # Parse JSON body
        payload_dict = json.loads(body.decode())
        payload = GrafanaAlertPayload(**payload_dict)

        logger.info(f"Received Grafana alert: {payload.ruleName}")

        # Step 1: Extract error information from Grafana annotations
        logger.info("Step 1: Extracting error from Grafana alert")

        error_log = payload.commonAnnotations.get(
            "error_log",
            payload.commonAnnotations.get(
                "description", payload.message or "Unknown error"
            ),
        )

        repo = payload.commonAnnotations.get("repo")
        service_name = payload.commonAnnotations.get("service_name", "unknown-service")
        environment = payload.commonAnnotations.get("environment", "production")

        if not repo:
            raise ValueError(
                "Missing 'repo' in Grafana alert annotations. " "Format: org/repo-name"
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

        logger.info(
            f"Successfully created issue #{issue_result.issue_number}: {issue_result.issue_url}"
        )

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


@app.post("/create-issue", response_model=WebhookResponse)
async def create_issue_from_webhook(request: Request):
    """
    Create a GitHub issue from a generic webhook payload.

    Expected fields (flexible):
    - summary: issue title (required)
    - error_details/error_log/description/message: issue body (required)
    - repo: GitHub repo in org/repo format (required)
    """
    logger.info("Received create-issue webhook")

    try:
        body = await request.body()
        payload_dict = json.loads(body.decode())

        common_annotations = payload_dict.get("commonAnnotations", {}) or {}
        common_labels = payload_dict.get("commonLabels", {}) or {}

        summary = (
            payload_dict.get("summary")
            or common_annotations.get("summary")
            or common_labels.get("summary")
            or payload_dict.get("title")
            or payload_dict.get("message")
        )

        error_details = (
            payload_dict.get("error_details")
            or payload_dict.get("error_log")
            or common_annotations.get("error_details")
            or common_annotations.get("error_log")
            or common_annotations.get("description")
            or payload_dict.get("description")
            or payload_dict.get("message")
        )

        repo = (
            payload_dict.get("repo")
            or common_annotations.get("repo")
            or common_labels.get("repo")
        )

        service_name = (
            payload_dict.get("service_name")
            or common_annotations.get("service_name")
            or "unknown-service"
        )

        environment = (
            payload_dict.get("environment")
            or common_annotations.get("environment")
            or "production"
        )

        severity = (
            payload_dict.get("severity")
            or common_labels.get("severity")
            or "medium"
        )

        if not repo:
            raise ValueError("Missing 'repo' in webhook payload. Format: org/repo-name")
        if not summary:
            raise ValueError("Missing 'summary' in webhook payload")

        if not error_details:
            error_details = body.decode(errors="replace")

        issue_body = (
            "## Webhook Error Details\n\n"
            f"**Service:** {service_name}  \n"
            f"**Environment:** {environment}  \n"
            "**Timestamp:** *Auto-generated at webhook time*\n\n"
            "### Error Details\n\n"
            f"```\n{error_details}\n```\n"
        )

        github_service = GitHubService()
        issue_result = github_service.create_issue_with_body(
            repo_name=repo,
            title=summary,
            body=issue_body,
            severity=severity,
        )

        return WebhookResponse(
            status="success",
            message=f"Issue created: #{issue_result.issue_number}",
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

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Error creating issue: {str(e)}", exc_info=True)

        return WebhookResponse(
            status="error",
            message="Failed to create issue",
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
