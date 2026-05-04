"""Pydantic models for Self-Healing Webhook Service."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ============ Grafana Models ============
class GrafanaAnnotation(BaseModel):
    """Grafana annotation field."""
    text: Optional[str] = None
    value: Optional[str] = None


class GrafanaEvalMatch(BaseModel):
    """Grafana evaluation match."""
    metric: str
    value: float


class GrafanaAlertPayload(BaseModel):
    """Grafana alert webhook payload."""
    status: str = Field(..., description="Alert status (alerting/resolved)")
    title: Optional[str] = Field(None, description="Alert title")
    message: Optional[str] = Field(None, description="Alert message")
    ruleId: Optional[int] = Field(None, description="Alert rule ID")
    ruleName: str = Field(..., description="Alert rule name")
    evalMatches: List[GrafanaEvalMatch] = Field(default_factory=list)
    commonAnnotations: Dict[str, str] = Field(default_factory=dict)
    commonLabels: Dict[str, str] = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "alerting",
                "title": "Pipeline Failure Alert",
                "message": "Build failed with ModuleNotFoundError",
                "ruleName": "CI Pipeline Failure",
                "commonAnnotations": {
                    "description": "Pipeline failed",
                    "error_log": "ModuleNotFoundError: No module named 'pandas'",
                    "repo": "org/repo",
                    "branch": "main"
                },
                "commonLabels": {
                    "severity": "critical"
                }
            }
        }


class WebhookRequest(BaseModel):
    """Self-healing webhook request."""
    repo: str = Field(..., description="Repository in format 'org/repository-name'")
    branch: str = Field(..., description="Target branch")
    error_log: str = Field(..., description="Error message or log")
    commit: Optional[str] = Field(None, description="Optional commit SHA")
    
    class Config:
        json_schema_extra = {
            "example": {
                "repo": "myorg/myrepo",
                "branch": "main",
                "error_log": "ModuleNotFoundError: No module named 'pandas'",
                "commit": "abc123"
            }
        }


# ============ Existing Models ============
class ParsedError(BaseModel):
    """Parsed error information."""
    error_type: str = Field(..., description="Type of error")
    failing_step: Optional[str] = Field(None, description="Step where error occurred")
    keywords: List[str] = Field(default_factory=list, description="Relevant keywords")
    missing_module: Optional[str] = Field(None, description="Missing module name")
    file_path: Optional[str] = Field(None, description="File path if error-specific")
    line_number: Optional[int] = Field(None, description="Line number if available")


class LLMResponse(BaseModel):
    """Response from LLM service."""
    root_cause: str = Field(..., description="Root cause of the failure")
    files_to_modify: List[str] = Field(..., description="List of files to modify")
    patch: str = Field(..., description="Unified diff patch")
    summary: str = Field(..., description="Summary of the fix")


class PullRequestResult(BaseModel):
    """Result of PR creation."""
    pr_number: int = Field(..., description="Pull request number")
    pr_url: str = Field(..., description="Pull request URL")
    branch_name: str = Field(..., description="Created branch name")


class WebhookResponse(BaseModel):
    """Standard webhook response."""
    status: str = Field(..., description="Response status (success/error)")
    message: str = Field(..., description="Human-readable message")
    pr_url: Optional[str] = Field(None, description="Created PR URL if successful")
    error: Optional[str] = Field(None, description="Error details if failed")
