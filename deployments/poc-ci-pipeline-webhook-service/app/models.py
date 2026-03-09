"""Pydantic models for AI Failure Analyzer Service."""

from typing import List, Optional
from pydantic import BaseModel, Field


class WebhookPayload(BaseModel):
    """Incoming webhook payload from Grafana."""

    repo: str = Field(..., description="Repository in format 'org/repository-name'")
    branch: str = Field(..., description="Branch name where failure occurred")
    commit: str = Field(..., description="Commit hash where failure occurred")
    error_log: str = Field(..., description="Error log from the failed pipeline")

    class Config:
        json_schema_extra = {
            "example": {
                "repo": "myorg/myrepo",
                "branch": "main",
                "commit": "abc123def456",
                "error_log": "ModuleNotFoundError: No module named 'pandas'",
            }
        }


class ParsedError(BaseModel):
    """Parsed error information."""

    error_type: str = Field(
        ..., description="Type of error (e.g., ModuleNotFoundError)"
    )
    failing_step: Optional[str] = Field(None, description="Step where error occurred")
    keywords: List[str] = Field(default_factory=list, description="Relevant keywords")
    missing_module: Optional[str] = Field(
        None, description="Missing module name if applicable"
    )
    file_path: Optional[str] = Field(
        None, description="File path if error is file-specific"
    )
    line_number: Optional[int] = Field(None, description="Line number if available")


class LLMResponse(BaseModel):
    """Response from LLM service."""

    root_cause: str = Field(..., description="Root cause of the failure")
    files_to_modify: List[str] = Field(..., description="List of files to modify")
    patch: str = Field(..., description="Unified diff patch")
    summary: str = Field(..., description="Summary of the fix")


class PullRequestResult(BaseModel):
    """Result of pull request creation."""

    pr_number: int = Field(..., description="Pull request number")
    pr_url: str = Field(..., description="Pull request URL")
    branch_name: str = Field(..., description="Branch name created")


class WebhookResponse(BaseModel):
    """Response sent back to webhook caller."""

    status: str = Field(..., description="Status of the operation")
    message: str = Field(..., description="Human-readable message")
    pr_url: Optional[str] = Field(None, description="Pull request URL if created")
    error: Optional[str] = Field(None, description="Error message if failed")
