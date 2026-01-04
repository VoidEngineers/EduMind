"""
Test ML Service functionality.
"""

import pytest

from app.schemas.prediction import (
    ExplanationResult,
    FeatureContribution,
    PredictionRequest,
    PredictionResponse,
    PredictionResult,
    RiskLevel,
)


class TestPredictionRequest:
    """Tests for PredictionRequest schema."""

    def test_create_prediction_request(self):
        """Test creating a valid prediction request."""
        request = PredictionRequest(
            student_id="test_student",
            total_interactions=100,
            avg_response_time=45.5,
            consistency_score=0.75,
            days_inactive=3,
            completion_rate=0.65,
            assessment_score=72.5,
        )
        assert request.student_id == "test_student"
        assert request.total_interactions == 100

    def test_prediction_request_defaults(self):
        """Test that prediction request has correct defaults."""
        request = PredictionRequest(student_id="test_student")
        assert request.total_interactions == 0.0
        assert request.days_inactive == 0
        assert request.consistency_score == 0.5


class TestPredictionResponse:
    """Tests for PredictionResponse schema."""

    def test_create_prediction_response(self):
        """Test creating a valid prediction response."""
        prediction = PredictionResult(
            predicted_class="safe",
            probability=0.75,
            risk_level="low",
        )
        explanation = ExplanationResult(
            feature_contributions=[
                FeatureContribution(
                    feature="total_interactions",
                    value=100.0,
                    contribution=0.1,
                    impact="positive",
                )
            ],
            top_positive_factors=["total_interactions"],
            top_negative_factors=[],
        )
        response = PredictionResponse(
            prediction=prediction,
            explanation=explanation,
            recommendations=["Keep up the good work!"],
        )
        assert response.prediction.predicted_class == "safe"
        assert response.prediction.risk_level == "low"
        assert response.prediction.probability == 0.75


class TestRiskLevel:
    """Tests for RiskLevel enum."""

    def test_risk_levels_exist(self):
        """Test that all risk levels exist."""
        assert RiskLevel.LOW == "low"
        assert RiskLevel.MEDIUM == "medium"
        assert RiskLevel.HIGH == "high"

    def test_risk_level_values(self):
        """Test risk level string values."""
        assert RiskLevel.LOW.value == "low"
        assert RiskLevel.MEDIUM.value == "medium"
        assert RiskLevel.HIGH.value == "high"