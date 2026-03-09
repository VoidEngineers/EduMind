"""Schemas for connected student search in the XAI service."""

from typing import List, Optional

from pydantic import BaseModel, Field


class ConnectedStudentSummary(BaseModel):
    """Student summary shown in XAI search results."""

    student_id: str = Field(..., description="Unique student identifier")
    engagement_score: float = Field(..., ge=0, le=100)
    engagement_level: str
    engagement_trend: Optional[str] = None
    risk_level: str
    risk_probability: Optional[float] = Field(default=None, ge=0, le=1)
    learning_style: Optional[str] = None
    avg_completion_rate: Optional[float] = Field(default=None, ge=0, le=100)
    has_learning_profile: bool = False
    last_updated: Optional[str] = None


class ConnectedStudentSearchResponse(BaseModel):
    """Search response for connected students."""

    query: str = ""
    total: int = 0
    limit: int = 0
    institute_id: str
    students: List[ConnectedStudentSummary] = Field(default_factory=list)
