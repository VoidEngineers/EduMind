"""Main FastAPI application for AI Failure Analyzer Service."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app.config import Config
from app.models import WebhookPayload, WebhookResponse
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
    """Application lifespan handler."""
    logger.info("Starting AI Failure Analyzer Service")
    logger.info(f"Service port: {Config.SERVICE_PORT}")
    logger.info(f"Clone directory: {Config.CLONE_DIRECTORY}")
    yield
    logger.info("Shutting down AI Failure Analyzer Service")


# Initialize FastAPI app
app = FastAPI(
    title="AI Failure Analyzer Service",
    description="Analyzes CI/CD pipeline failures and creates automated fixes",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"service": "AI Failure Analyzer", "status": "healthy", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "config": {
            "openai_configured": bool(Config.OPENAI_API_KEY),
            "github_configured": bool(Config.GITHUB_TOKEN),
            "clone_directory": Config.CLONE_DIRECTORY,
        },
    }


@app.post("/pipeline-failure", response_model=WebhookResponse)
async def handle_pipeline_failure(payload: WebhookPayload, request: Request):
    """
    Handle pipeline failure webhook.

    This endpoint receives failure alerts from Grafana and:
    1. Parses the error log
    2. Clones the repository
    3. Generates a fix using LLM
    4. Applies the patch
    5. Creates a pull request

    Args:
        payload: Webhook payload with failure details

    Returns:
        WebhookResponse with PR details or error
    """
    logger.info(f"Received webhook for {payload.repo}")
    logger.info(f"Branch: {payload.branch}, Commit: {payload.commit}")

    repo_service = None

    try:
        # Step 1: Parse error log
        logger.info("Step 1: Parsing error log")
        parsed_error = ErrorParser.parse(payload.error_log)
        logger.info(f"Parsed error type: {parsed_error.error_type}")

        # Step 2: Clone repository
        logger.info("Step 2: Cloning repository")
        repo_service = RepoService()
        repo = repo_service.clone_repository(
            payload.repo, payload.branch, payload.commit
        )

        # Step 3: Get relevant files
        logger.info("Step 3: Fetching relevant files")
        relevant_files = repo_service.get_relevant_files(repo)
        logger.info(f"Found {len(relevant_files)} relevant files")

        # Step 4: Generate fix using LLM
        logger.info("Step 4: Generating fix using LLM")
        llm_service = LLMService()
        llm_response = llm_service.generate_fix(
            error_log=payload.error_log,
            parsed_error=parsed_error,
            relevant_files=relevant_files,
            repo_name=payload.repo,
            branch=payload.branch,
        )
        logger.info(f"LLM Root Cause: {llm_response.root_cause}")
        logger.info(f"Files to modify: {llm_response.files_to_modify}")

        # Step 5: Create fix branch
        logger.info("Step 5: Creating fix branch")
        branch_name = repo_service.create_fix_branch(repo)

        # Step 6: Apply patch
        logger.info("Step 6: Applying patch")
        patch_success = PatchService.apply_patch(
            repo, llm_response.patch, llm_response.files_to_modify
        )

        if not patch_success:
            raise Exception("Failed to apply patch")

        # Step 7: Commit changes
        logger.info("Step 7: Committing changes")
        PatchService.commit_changes(repo, branch_name, llm_response.summary)

        # Step 8: Push branch and create PR
        logger.info("Step 8: Pushing branch and creating PR")
        github_service = GitHubService()
        github_service.push_branch(repo, branch_name)

        pr_result = github_service.create_pull_request(
            repo_name=payload.repo,
            branch_name=branch_name,
            base_branch=payload.branch,
            root_cause=llm_response.root_cause,
            summary=llm_response.summary,
            error_log=payload.error_log,
        )

        logger.info(f"Successfully created PR: {pr_result.pr_url}")

        # Cleanup
        repo_service.cleanup_repository(payload.repo)

        return WebhookResponse(
            status="success",
            message=f"Successfully created PR #{pr_result.pr_number}",
            pr_url=pr_result.pr_url,
        )

    except ValueError as e:
        # Validation failure (token permissions, safety checks, etc.)
        error_message = str(e)
        logger.error(f"Validation error: {error_message}")
        if repo_service:
            repo_service.cleanup_repository(payload.repo)

        # Determine if it's a GitHub token issue
        if (
            "token" in error_message.lower()
            or "permission" in error_message.lower()
            or "403" in error_message
        ):
            return WebhookResponse(
                status="error",
                message="GitHub authentication/permission error",
                error=error_message,
            )
        else:
            return WebhookResponse(
                status="error", message="Validation failed", error=error_message
            )

    except Exception as e:
        # General error
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        if repo_service:
            repo_service.cleanup_repository(payload.repo)

        return WebhookResponse(
            status="error", message="Failed to process pipeline failure", error=str(e)
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "message": exc.detail, "error": str(exc)},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error",
            "error": str(exc),
        },
    )


if __name__ == "__main__":
    import uvicorn

    # Validate configuration before starting the server
    Config.validate()
    logger.info("Configuration validated successfully")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=Config.SERVICE_PORT,
        reload=False,
        log_level=Config.LOG_LEVEL.lower(),
    )
