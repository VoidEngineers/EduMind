"""Schemas for XAI Prediction Service"""
from .health import HealthResponse, ModelInfoResponse

# Academic risk schemas
from .academic_risk import AcademicRiskRequest, AcademicRiskResponse

# Prediction schemas
from .prediction import (
    PredictionRequest,
    PredictionResponse,
    PredictionResult,
    ExplanationResult,
    FeatureContribution
)

__all__ = [
    "HealthResponse",
    "ModelInfoResponse",
    "AcademicRiskRequest",
    "AcademicRiskResponse",
    "PredictionRequest",
    "PredictionResponse",
    "PredictionResult",
    "ExplanationResult",
    "FeatureContribution"
]
