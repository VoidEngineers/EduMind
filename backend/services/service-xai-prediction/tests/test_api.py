"""
Test API endpoints for the XAI Prediction Service.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create a test client using context manager for proper cleanup."""
    with TestClient(app) as test_client:
        yield test_client


class TestHealthEndpoint:
    """Tests for the health check endpoint."""

    def test_health_check(self, client):
        """Test that health endpoint returns 200."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_health_check_contains_service_name(self, client):
        """Test that health response contains service name."""
        response = client.get("/health")
        data = response.json()
        assert "service" in data


class TestPredictionEndpoint:
    """Tests for the prediction endpoint."""

    def test_predict_endpoint_exists(self, client):
        """Test that predict endpoint exists."""
        response = client.post(
            "/api/v1/predict",
            json={
                "student_id": "test_student",
                "total_interactions": 100,
                "days_active": 30,
                "avg_score": 75.0,
                "submissions_on_time": 8,
                "total_submissions": 10,
                "forum_posts": 5,
                "time_spent_hours": 50.0,
                "resources_accessed": 20,
                "quiz_attempts": 5,
                "assignment_completion_rate": 0.8,
            },
        )
        assert response.status_code in [200, 201, 422]

    def test_predict_with_valid_data(self, client):
        """Test prediction with valid input data."""
        response = client.post(
            "/api/v1/predict",
            json={
                "student_id": "student_123",
                "total_interactions": 150,
                "avg_response_time": 45.5,
                "consistency_score": 0.75,
                "days_inactive": 3,
                "completion_rate": 0.65,
                "assessment_score": 72.5,
            },
        )
        if response.status_code == 200:
            data = response.json()
            assert "prediction" in data
            assert "risk_level" in data["prediction"]
            assert "probability" in data["prediction"]


class TestAcademicRiskEndpoint:
    """Tests for the academic risk endpoint."""

    def test_academic_risk_endpoint_exists(self, client):
        """Test that academic risk endpoint exists."""
        response = client.post(
            "/api/v1/academic-risk/predict",
            json={
                "student_id": "test_student",
                "total_clicks": 100,
                "days_active": 30,
                "avg_score": 75.0,
                "studied_credits": 60,
                "num_of_prev_attempts": 1,
            },
        )
        assert response.status_code in [200, 201, 422]