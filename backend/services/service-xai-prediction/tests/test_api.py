"""
Test API endpoints for the XAI Prediction Service.
"""

from datetime import datetime
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.api import academic_risk_routes
from app.api.dependencies import get_db, get_temp_students_db
from app.schemas.academic_risk import AcademicRiskRequest, AcademicRiskResponse
from app.schemas.prediction import PredictionRequest
from app.services.sync_service import sync_service
from app.services.sync_service import SyncServiceError


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

    def test_temporary_student_prediction_endpoint(self, client, monkeypatch):
        """Manual temporary-student submissions should use the separate endpoint."""

        async def fake_predict(request: AcademicRiskRequest):
            return AcademicRiskResponse(
                student_id=request.student_id,
                risk_level="Medium Risk",
                risk_score=0.52,
                confidence=0.81,
                probabilities={
                    "Safe": 0.18,
                    "Medium Risk": 0.52,
                    "At-Risk": 0.30,
                },
                recommendations=["Follow up with a tutor"],
                top_risk_factors=[
                    {"feature": "avg_grade", "value": request.avg_grade, "impact": "high"}
                ],
                prediction_id="123e4567-e89b-12d3-a456-426614174000",
                timestamp="2026-03-08T10:30:00",
            )

        def fake_persist_temporary_student_record(db, request, response):
            return None

        monkeypatch.setattr(academic_risk_routes.academic_risk_service, "predict", fake_predict)
        monkeypatch.setattr(
            academic_risk_routes,
            "persist_temporary_student_record",
            fake_persist_temporary_student_record,
        )

        response = client.post(
            "/api/v1/academic-risk/temporary-students/predict",
            json={
                "student_id": "temp_student_001",
                "avg_grade": 70,
                "grade_consistency": 85,
                "grade_range": 30,
                "num_assessments": 8,
                "assessment_completion_rate": 0.8,
                "studied_credits": 60,
                "num_of_prev_attempts": 0,
                "low_performance": 0,
                "low_engagement": 0,
                "has_previous_attempts": 0,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["student_id"] == "temp_student_001"
        assert data["risk_level"] == "Medium Risk"

    def test_academic_risk_stats_endpoint(self, client):
        """Stats endpoint should surface average performance from XAI records."""

        class FakeQuery:
            def __init__(self, items):
                self.items = items

            def order_by(self, *_args, **_kwargs):
                return self

            def all(self):
                return self.items

        class FakeSession:
            def __init__(self, items):
                self.items = items

            def query(self, *_args, **_kwargs):
                return FakeQuery(self.items)

        connected_records = [
            SimpleNamespace(
                student_id="STU0001",
                created_at=datetime(2026, 3, 8, 12, 0, 0),
                request_payload={"avg_grade": 80},
                risk_score=0.2,
                risk_level="Safe",
            ),
            SimpleNamespace(
                student_id="STU0001",
                created_at=datetime(2026, 3, 7, 12, 0, 0),
                request_payload={"avg_grade": 60},
                risk_score=0.5,
                risk_level="At-Risk",
            ),
            SimpleNamespace(
                student_id="STU0002",
                created_at=datetime(2026, 3, 8, 12, 0, 0),
                request_payload={"avg_grade": 70},
                risk_score=0.7,
                risk_level="At-Risk",
            ),
        ]

        temp_records = [
            SimpleNamespace(
                student_id="TEMP001",
                avg_grade=55,
                latest_risk_level="At-Risk",
            )
        ]

        app.dependency_overrides[get_db] = lambda: FakeSession(connected_records)
        app.dependency_overrides[get_temp_students_db] = lambda: FakeSession(temp_records)

        try:
            response = client.get("/api/v1/academic-risk/stats")
        finally:
            app.dependency_overrides.pop(get_db, None)
            app.dependency_overrides.pop(get_temp_students_db, None)

        assert response.status_code == 200
        data = response.json()
        assert data["total_students_analyzed"] == 2
        assert data["average_performance"] == 75.0
        assert data["high_risk_students"] == 1

    def test_list_temporary_students_endpoint(self, client):
        """Saved temporary students should be listable for the manual XAI flow."""

        class FakeQuery:
            def __init__(self, items):
                self.items = items

            def order_by(self, *_args, **_kwargs):
                return self

            def filter(self, *_args, **_kwargs):
                return self

            def limit(self, value):
                self.items = self.items[:value]
                return self

            def all(self):
                return self.items

        class FakeSession:
            def __init__(self, items):
                self.items = items

            def query(self, *_args, **_kwargs):
                return FakeQuery(self.items)

        temp_records = [
            SimpleNamespace(
                student_id="TEMP001",
                avg_grade=72.0,
                latest_risk_level="Medium Risk",
                latest_risk_score=0.55,
                latest_confidence=0.81,
                updated_at=datetime(2026, 3, 9, 12, 0, 0),
                created_at=datetime(2026, 3, 9, 10, 0, 0),
            ),
            SimpleNamespace(
                student_id="TEMP002",
                avg_grade=48.0,
                latest_risk_level="At-Risk",
                latest_risk_score=0.82,
                latest_confidence=0.88,
                updated_at=datetime(2026, 3, 9, 11, 0, 0),
                created_at=datetime(2026, 3, 9, 9, 0, 0),
            ),
        ]

        app.dependency_overrides[get_temp_students_db] = lambda: FakeSession(temp_records)

        try:
            response = client.get("/api/v1/academic-risk/temporary-students?limit=5")
        finally:
            app.dependency_overrides.pop(get_temp_students_db, None)

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        assert data["students"][0]["student_id"] == "TEMP001"
        assert data["students"][0]["latest_risk_level"] == "Medium Risk"

    def test_get_temporary_student_record_endpoint(self, client):
        """A saved temporary student should return its form payload and prediction."""

        class FakeQuery:
            def __init__(self, items):
                self.items = items

            def filter(self, *_args, **_kwargs):
                return self

            def order_by(self, *_args, **_kwargs):
                return self

            def first(self):
                return self.items[0] if self.items else None

        class FakeSession:
            def __init__(self, items):
                self.items = items

            def query(self, *_args, **_kwargs):
                return FakeQuery(self.items)

        temp_record = SimpleNamespace(
            student_id="TEMP001",
            request_payload={
                "student_id": "TEMP001",
                "avg_grade": 72,
                "grade_consistency": 85,
                "grade_range": 20,
                "num_assessments": 8,
                "assessment_completion_rate": 0.75,
                "studied_credits": 60,
                "num_of_prev_attempts": 0,
                "low_performance": 0,
                "low_engagement": 0,
                "has_previous_attempts": 0,
            },
            response_payload={
                "student_id": "TEMP001",
                "risk_level": "Medium Risk",
                "risk_score": 0.61,
                "confidence": 0.84,
                "probabilities": {
                    "Safe": 0.16,
                    "Medium Risk": 0.61,
                    "At-Risk": 0.23,
                },
                "recommendations": ["Follow up with the student"],
                "top_risk_factors": [
                    {"feature": "avg_grade", "value": 72, "impact": "medium"}
                ],
                "prediction_id": "123e4567-e89b-12d3-a456-426614174000",
                "timestamp": "2026-03-09T12:00:00",
            },
            created_at=datetime(2026, 3, 9, 10, 0, 0),
            updated_at=datetime(2026, 3, 9, 12, 0, 0),
        )

        app.dependency_overrides[get_temp_students_db] = lambda: FakeSession([temp_record])

        try:
            response = client.get("/api/v1/academic-risk/temporary-students/TEMP001")
        finally:
            app.dependency_overrides.pop(get_temp_students_db, None)

        assert response.status_code == 200
        data = response.json()
        assert data["student_id"] == "TEMP001"
        assert data["request_payload"]["avg_grade"] == 72
        assert data["prediction"]["risk_level"] == "Medium Risk"


class TestConnectedAcademicRiskEndpoints:
    """Tests for connected student search and request-building endpoints."""

    def test_search_students_endpoint(self, client, monkeypatch):
        async def fake_search_students(
            query: str = "",
            limit: int = 10,
            institute_id: str = "LMS_INST_A",
        ):
            return {
                "query": query,
                "total": 1,
                "limit": limit,
                "institute_id": institute_id,
                "students": [
                    {
                        "student_id": "STU0001",
                        "engagement_score": 72.5,
                        "engagement_level": "High",
                        "engagement_trend": "Improving",
                        "risk_level": "Low",
                        "risk_probability": 0.12,
                        "learning_style": "Visual",
                        "avg_completion_rate": 81.0,
                        "has_learning_profile": True,
                        "last_updated": "2026-03-08",
                    }
                ],
            }

        monkeypatch.setattr(sync_service, "search_students", fake_search_students)

        response = client.get(
            "/api/v1/academic-risk/students/search",
            params={"query": "STU", "limit": 5},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["students"][0]["student_id"] == "STU0001"
        assert data["students"][0]["has_learning_profile"] is True

    def test_connected_student_request_endpoint(self, client, monkeypatch):
        async def fake_build_academic_risk_request(
            student_id: str,
            days: int = 14,
        ):
            return AcademicRiskRequest(
                student_id=student_id,
                avg_grade=68.0,
                grade_consistency=84.0,
                grade_range=16.0,
                num_assessments=6,
                assessment_completion_rate=0.75,
                studied_credits=60,
                num_of_prev_attempts=0,
                low_performance=0,
                low_engagement=0,
                has_previous_attempts=0,
            )

        monkeypatch.setattr(
            sync_service,
            "build_academic_risk_request",
            fake_build_academic_risk_request,
        )

        response = client.get("/api/v1/academic-risk/students/STU0001/request")

        assert response.status_code == 200
        data = response.json()
        assert data["student_id"] == "STU0001"
        assert data["avg_grade"] == 68.0

    def test_search_students_falls_back_to_local_history(self, client, monkeypatch):
        async def fake_search_students(
            query: str = "",
            limit: int = 10,
            institute_id: str = "LMS_INST_A",
        ):
            raise SyncServiceError(status_code=502, detail="engagement unavailable")

        def fake_local_search(db, query: str, limit: int, institute_id: str):
            return {
                "query": query,
                "total": 1,
                "limit": limit,
                "institute_id": institute_id,
                "students": [
                    {
                        "student_id": "Stu01",
                        "engagement_score": 0.0,
                        "engagement_level": "Unavailable",
                        "engagement_trend": None,
                        "risk_level": "At-Risk",
                        "risk_probability": 0.91,
                        "learning_style": None,
                        "avg_completion_rate": 80.0,
                        "has_learning_profile": False,
                        "last_updated": "2026-03-08T10:00:00",
                    }
                ],
            }

        monkeypatch.setattr(sync_service, "search_students", fake_search_students)
        monkeypatch.setattr(
            academic_risk_routes,
            "search_local_prediction_history",
            fake_local_search,
        )

        response = client.get(
            "/api/v1/academic-risk/students/search",
            params={"query": "Stu", "limit": 5},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["students"][0]["student_id"] == "Stu01"
        assert data["students"][0]["engagement_level"] == "Unavailable"

    def test_connected_student_request_falls_back_to_local_request(self, client, monkeypatch):
        async def fake_build_academic_risk_request(
            student_id: str,
            days: int = 14,
        ):
            raise SyncServiceError(status_code=502, detail="engagement unavailable")

        def fake_local_request(db, student_id: str):
            return AcademicRiskRequest(
                student_id=student_id,
                avg_grade=55.0,
                grade_consistency=70.0,
                grade_range=20.0,
                num_assessments=5,
                assessment_completion_rate=0.6,
                studied_credits=60,
                num_of_prev_attempts=1,
                low_performance=0,
                low_engagement=1,
                has_previous_attempts=1,
            )

        monkeypatch.setattr(
            sync_service,
            "build_academic_risk_request",
            fake_build_academic_risk_request,
        )
        monkeypatch.setattr(
            academic_risk_routes,
            "get_local_prediction_request",
            fake_local_request,
        )

        response = client.get("/api/v1/academic-risk/students/Stu01/request")

        assert response.status_code == 200
        data = response.json()
        assert data["student_id"] == "Stu01"
        assert data["low_engagement"] == 1


class TestSyncPredictionEndpoint:
    """Tests for synced prediction endpoint."""

    def test_sync_predict_endpoint(self, client, monkeypatch):
        """Sync endpoint should return prediction payload when upstream mapping succeeds."""

        async def fake_build_prediction_request(student_id: str, days: int = 14):
            return PredictionRequest(
                student_id=student_id,
                total_interactions=120.0,
                avg_response_time=25.0,
                consistency_score=0.8,
                days_inactive=1,
                completion_rate=0.75,
                assessment_score=82.0,
                learning_style="Visual",
            )

        monkeypatch.setattr(
            sync_service, "build_prediction_request", fake_build_prediction_request
        )

        response = client.post("/api/v1/sync/predict/STU0001")
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert "explanation" in data
