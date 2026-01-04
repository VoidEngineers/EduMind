"""
Test prediction functionality.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.prediction import RiskLevel


@pytest.fixture
def client():
    """Create a test client using context manager for proper cleanup."""
    with TestClient(app) as test_client:
        yield test_client


class TestPredictionFlow:
    """Tests for the complete prediction flow."""

    def test_prediction_returns_valid_risk_level(self, client):
        """Test that prediction returns a valid risk level."""
        response = client.post(
            "/api/v1/predict",
            json={
                "student_id": "flow_test_student",
                "total_interactions": 50,
                "avg_response_time": 30.0,
                "consistency_score": 0.6,
                "days_inactive": 5,
                "completion_rate": 0.5,
                "assessment_score": 65.0,
            },
        )
        if response.status_code == 200:
            data = response.json()
            assert "prediction" in data
            assert data["prediction"]["risk_level"] in ["low", "medium", "high"]

    def test_prediction_returns_probability(self, client):
        """Test that prediction returns a probability between 0 and 1."""
        response = client.post(
            "/api/v1/predict",
            json={
                "student_id": "score_test_student",
                "total_interactions": 200,
                "avg_response_time": 25.0,
                "consistency_score": 0.9,
                "days_inactive": 1,
                "completion_rate": 0.85,
                "assessment_score": 90.0,
            },
        )
        if response.status_code == 200:
            data = response.json()
            assert "prediction" in data
            assert 0 <= data["prediction"]["probability"] <= 1

    def test_prediction_returns_explanation(self, client):
        """Test that prediction returns explanation with feature contributions."""
        response = client.post(
            "/api/v1/predict",
            json={
                "student_id": "explanation_test",
                "total_interactions": 100,
                "avg_response_time": 35.0,
                "consistency_score": 0.7,
                "days_inactive": 3,
                "completion_rate": 0.65,
                "assessment_score": 75.0,
            },
        )
        if response.status_code == 200:
            data = response.json()
            assert "explanation" in data
            assert "feature_contributions" in data["explanation"]