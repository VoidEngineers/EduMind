"""Pydantic models for Alert-to-Issue Webhook Service."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ============ Grafana Models ============
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
                    "service_name": "api-service",
                    "environment": "production",
                },
                "commonLabels": {"severity": "critical"},
            }
        }


# ============ Error Analysis Models ============
class ParsedError(BaseModel):
    """Parsed error information."""

    error_type: str = Field(..., description="Type of error")
    failing_step: Optional[str] = Field(None, description="Step where error occurred")
    keywords: List[str] = Field(default_factory=list, description="Relevant keywords")
    missing_module: Optional[str] = Field(None, description="Missing module name")
    file_path: Optional[str] = Field(None, description="File path if error-specific")
    line_number: Optional[int] = Field(None, description="Line number if available")


class LLMAnalysis(BaseModel):
    """LLM analysis of the error."""

    root_cause: str = Field(..., description="Root cause analysis")
    suggested_fix: str = Field(..., description="Suggested steps to fix")
    severity: str = Field(
        default="medium", description="Severity level (low/medium/high/critical)"
    )
    affected_components: List[str] = Field(
        default_factory=list, description="Components affected"
    )


# ============ GitHub Issue Models ============
class GitHubIssueResult(BaseModel):
    """Result of GitHub issue creation."""

    issue_number: int = Field(..., description="GitHub issue number")
    issue_url: str = Field(..., description="GitHub issue URL")
    assigned_to: Optional[str] = Field(
        None, description="Assigned user (e.g., copilot)"
    )


# ============ Response Models ============
class WebhookResponse(BaseModel):
    """Standard webhook response."""

    status: str = Field(..., description="Response status (success/error)")
    message: str = Field(..., description="Human-readable message")
    issue_url: Optional[str] = Field(
        None, description="Created issue URL if successful"
    )
    issue_number: Optional[int] = Field(None, description="Issue number if successful")
    error: Optional[str] = Field(None, description="Error details if failed")
