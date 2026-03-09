"""
Academic Risk Prediction Routes
"""

from app.api.dependencies import get_db, get_temp_students_db
from app.core.logging import get_logger
from app.models import AcademicRiskPredictionRecord, TemporaryStudentRecord
from app.schemas.academic_risk import (
    AcademicRiskRequest,
    AcademicRiskResponse,
    TemporaryStudentListResponse,
    TemporaryStudentRecordResponse,
    TemporaryStudentSummary,
)
from app.schemas.student_lookup import ConnectedStudentSearchResponse, ConnectedStudentSummary
from app.services.academic_risk_service import academic_risk_service
from app.services.sync_service import SyncServiceError, sync_service
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

logger = get_logger(__name__)
router = APIRouter(tags=["academic-risk"])


@router.get(
    "/academic-risk/stats",
    status_code=status.HTTP_200_OK,
)
async def get_academic_risk_stats(
    db: Session = Depends(get_db),
    temp_db: Session = Depends(get_temp_students_db),
):
    """Return XAI academic-risk summary values for dashboard use."""
    records = (
        db.query(AcademicRiskPredictionRecord)
        .order_by(desc(AcademicRiskPredictionRecord.created_at))
        .all()
    )

    latest_by_student: dict[str, AcademicRiskPredictionRecord] = {}
    for record in records:
        if record.student_id not in latest_by_student:
            latest_by_student[record.student_id] = record

    avg_grades: list[float] = []
    avg_risk_scores: list[float] = []
    high_risk_students = 0

    for record in latest_by_student.values():
        payload = record.request_payload if isinstance(record.request_payload, dict) else {}
        avg_grade = payload.get("avg_grade")
        if avg_grade is not None:
            try:
                avg_grades.append(float(avg_grade))
            except (TypeError, ValueError):
                pass

        if record.risk_score is not None:
            avg_risk_scores.append(float(record.risk_score))

        if (record.risk_level or "").lower() in {"high", "at-risk", "at risk"}:
            high_risk_students += 1

    average_performance = (
        round(sum(avg_grades) / len(avg_grades), 2) if avg_grades else None
    )
    average_risk_score = (
        round(sum(avg_risk_scores) / len(avg_risk_scores), 4) if avg_risk_scores else None
    )

    if average_performance is None:
        temporary_records = temp_db.query(TemporaryStudentRecord).all()
        temporary_avg_grades = [
            float(record.avg_grade)
            for record in temporary_records
            if record.avg_grade is not None
        ]
        if temporary_avg_grades:
            average_performance = round(
                sum(temporary_avg_grades) / len(temporary_avg_grades), 2
            )

        if not latest_by_student:
            latest_by_student = {record.student_id: record for record in temporary_records}
            high_risk_students = sum(
                1
                for record in temporary_records
                if (record.latest_risk_level or "").lower() in {"high", "at-risk", "at risk"}
            )

    return {
        "total_students_analyzed": len(latest_by_student),
        "average_performance": average_performance,
        "average_risk_score": average_risk_score,
        "high_risk_students": high_risk_students,
    }


@router.get(
    "/academic-risk/students/search",
    response_model=ConnectedStudentSearchResponse,
    status_code=status.HTTP_200_OK,
)
async def search_connected_students(
    query: str = Query("", description="Student ID search term"),
    limit: int = Query(10, ge=1, le=50),
    institute_id: str = Query("LMS_INST_A"),
    db: Session = Depends(get_db),
):
    """Search students available to the connected XAI flow."""
    try:
        return await sync_service.search_students(
            query=query,
            limit=limit,
            institute_id=institute_id,
        )
    except SyncServiceError as exc:
        fallback = search_local_prediction_history(
            db=db,
            query=query,
            limit=limit,
            institute_id=institute_id,
        )
        fallback_students = (
            fallback.students
            if hasattr(fallback, "students")
            else fallback.get("students", [])
            if isinstance(fallback, dict)
            else []
        )
        if fallback_students:
            logger.warning(
                "Student search fell back to local XAI history because upstream lookup failed: %s",
                exc.detail,
            )
            return fallback
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get(
    "/academic-risk/students/{student_id}/request",
    response_model=AcademicRiskRequest,
    status_code=status.HTTP_200_OK,
)
async def get_connected_student_request(
    student_id: str,
    days: int = Query(14, ge=1, le=90),
    db: Session = Depends(get_db),
):
    """Build the academic-risk request for a connected student."""
    try:
        return await sync_service.build_academic_risk_request(
            student_id=student_id,
            days=days,
        )
    except SyncServiceError as exc:
        fallback_request = get_local_prediction_request(
            db=db,
            student_id=student_id,
        )
        if fallback_request is not None:
            logger.warning(
                "Student request fell back to stored XAI request because upstream sync failed: %s",
                exc.detail,
            )
            return fallback_request
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.post(
    "/academic-risk/predict",
    response_model=AcademicRiskResponse,
    status_code=status.HTTP_200_OK,
)
async def predict_academic_risk(
    request: AcademicRiskRequest, db: Session = Depends(get_db)
):
    """
    Predict student academic dropout risk using OULAD model

    Args:
        request: Student academic performance features

    Returns:
        Risk prediction with personalized recommendations
    """
    logger.info(f"Academic risk prediction request for student: {request.student_id}")

    # Make prediction
    response = await academic_risk_service.predict(request)

    logger.info(
        f"Prediction complete: {response.risk_level} "
        f"(confidence: {response.confidence:.2%}, risk_score: {response.risk_score:.2%})"
    )

    persist_academic_risk_prediction(db=db, request=request, response=response)

    return response


@router.post(
    "/academic-risk/temporary-students/predict",
    response_model=AcademicRiskResponse,
    status_code=status.HTTP_200_OK,
)
async def predict_temporary_student_academic_risk(
    request: AcademicRiskRequest,
    temp_db: Session = Depends(get_temp_students_db),
):
    """
    Predict academic risk for a temporary/manual student submission.

    Manual form entries are stored in a dedicated temporary-student database
    and are intentionally kept separate from connected student history.
    """
    logger.info(
        "Temporary academic risk prediction request for student: %s",
        request.student_id,
    )

    response = await academic_risk_service.predict(request)

    logger.info(
        "Temporary prediction complete: %s (confidence: %.2f%%, risk_score: %.2f%%)",
        response.risk_level,
        response.confidence * 100,
        response.risk_score * 100,
    )

    persist_temporary_student_record(
        db=temp_db,
        request=request,
        response=response,
    )

    return response


@router.get(
    "/academic-risk/temporary-students",
    response_model=TemporaryStudentListResponse,
    status_code=status.HTTP_200_OK,
)
async def list_temporary_students(
    query: str = Query("", description="Temporary student ID search term"),
    limit: int = Query(10, ge=1, le=50),
    temp_db: Session = Depends(get_temp_students_db),
):
    """List saved temporary-student records for the manual XAI flow."""
    search_term = query.strip()
    records_query = temp_db.query(TemporaryStudentRecord).order_by(
        desc(TemporaryStudentRecord.updated_at),
        desc(TemporaryStudentRecord.created_at),
    )

    if search_term:
        records_query = records_query.filter(
            TemporaryStudentRecord.student_id.ilike(f"%{search_term}%")
        )

    records = records_query.limit(limit).all()

    students = [
        TemporaryStudentSummary(
            student_id=record.student_id,
            avg_grade=float(record.avg_grade),
            latest_risk_level=record.latest_risk_level,
            latest_risk_score=(
                float(record.latest_risk_score)
                if record.latest_risk_score is not None
                else None
            ),
            latest_confidence=(
                float(record.latest_confidence)
                if record.latest_confidence is not None
                else None
            ),
            updated_at=record.updated_at,
        )
        for record in records
    ]

    return TemporaryStudentListResponse(
        query=query,
        total=len(students),
        limit=limit,
        students=students,
    )


@router.get(
    "/academic-risk/temporary-students/{student_id}",
    response_model=TemporaryStudentRecordResponse,
    status_code=status.HTTP_200_OK,
)
async def get_temporary_student_record(
    student_id: str,
    temp_db: Session = Depends(get_temp_students_db),
):
    """Return the saved form payload and prediction for a temporary student."""
    record = (
        temp_db.query(TemporaryStudentRecord)
        .filter(TemporaryStudentRecord.student_id == student_id)
        .order_by(desc(TemporaryStudentRecord.updated_at))
        .first()
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Temporary student '{student_id}' was not found",
        )

    if not isinstance(record.request_payload, dict):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Temporary student '{student_id}' has an invalid saved request payload",
        )

    try:
        request_payload = AcademicRiskRequest.model_validate(record.request_payload)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Temporary student '{student_id}' has an unreadable saved request payload",
        ) from exc

    prediction = None
    if isinstance(record.response_payload, dict):
        try:
            prediction = AcademicRiskResponse.model_validate(record.response_payload)
        except Exception:
            logger.warning(
                "Temporary student '%s' has an unreadable saved response payload",
                student_id,
            )

    return TemporaryStudentRecordResponse(
        student_id=record.student_id,
        request_payload=request_payload,
        prediction=prediction,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


@router.get("/academic-risk/model-info")
async def get_academic_risk_model_info():
    """Get information about the OULAD academic risk model"""
    metadata = academic_risk_service.metadata
    accuracy = metadata.get("metrics", {}).get("accuracy")
    if accuracy is None:
        accuracy = metadata.get("accuracy", "N/A")
    else:
        accuracy = f"{accuracy*100:.1f}%"

    return {
        "model_type": metadata.get("model_type", "Unknown"),
        "features": academic_risk_service.feature_names,
        "classes": metadata.get("classes", []),
        "accuracy": accuracy,
        "description": "Binary classification model for predicting student dropout risk based on academic performance",
    }


def persist_academic_risk_prediction(
    db: Session, request: AcademicRiskRequest, response: AcademicRiskResponse
) -> None:
    """Persist academic risk output; failures are logged but do not block the API."""
    try:
        metrics = academic_risk_service.metadata.get("metrics")
        if not metrics:
            metrics = {"accuracy": academic_risk_service.metadata.get("accuracy")}

        record = AcademicRiskPredictionRecord(
            student_id=request.student_id,
            request_payload=request.model_dump(mode="json"),
            response_payload=response.model_dump(mode="json"),
            model_metrics=metrics,
            risk_level=response.risk_level,
            risk_score=response.risk_score,
            confidence=response.confidence,
            model_version=str(academic_risk_service.metadata.get("version", "")) or None,
        )
        db.add(record)
        db.commit()
    except Exception as exc:
        db.rollback()
        logger.warning(f"Could not persist academic risk prediction record: {exc}")


def persist_temporary_student_record(
    db: Session,
    request: AcademicRiskRequest,
    response: AcademicRiskResponse,
) -> None:
    """Upsert manual temporary-student submissions into the dedicated temp DB."""
    try:
        record = (
            db.query(TemporaryStudentRecord)
            .filter(TemporaryStudentRecord.student_id == request.student_id)
            .first()
        )

        if record is None:
            record = TemporaryStudentRecord(
                student_id=request.student_id,
                avg_grade=request.avg_grade,
                grade_consistency=request.grade_consistency,
                grade_range=request.grade_range,
                num_assessments=request.num_assessments,
                assessment_completion_rate=request.assessment_completion_rate,
                studied_credits=request.studied_credits,
                num_of_prev_attempts=request.num_of_prev_attempts,
                low_performance=request.low_performance,
                low_engagement=request.low_engagement,
                has_previous_attempts=request.has_previous_attempts,
                request_payload=request.model_dump(mode="json"),
                response_payload=response.model_dump(mode="json"),
                latest_risk_level=response.risk_level,
                latest_risk_score=response.risk_score,
                latest_confidence=response.confidence,
            )
            db.add(record)
        else:
            record.avg_grade = request.avg_grade
            record.grade_consistency = request.grade_consistency
            record.grade_range = request.grade_range
            record.num_assessments = request.num_assessments
            record.assessment_completion_rate = request.assessment_completion_rate
            record.studied_credits = request.studied_credits
            record.num_of_prev_attempts = request.num_of_prev_attempts
            record.low_performance = request.low_performance
            record.low_engagement = request.low_engagement
            record.has_previous_attempts = request.has_previous_attempts
            record.request_payload = request.model_dump(mode="json")
            record.response_payload = response.model_dump(mode="json")
            record.latest_risk_level = response.risk_level
            record.latest_risk_score = response.risk_score
            record.latest_confidence = response.confidence

        db.commit()
    except Exception as exc:
        db.rollback()
        logger.warning("Could not persist temporary student record: %s", exc)


def search_local_prediction_history(
    db: Session,
    query: str,
    limit: int,
    institute_id: str,
) -> ConnectedStudentSearchResponse:
    """Fallback search using existing academic-risk prediction history."""
    search_term = query.strip()
    records_query = db.query(AcademicRiskPredictionRecord).order_by(
        desc(AcademicRiskPredictionRecord.created_at)
    )

    if search_term:
        records_query = records_query.filter(
            AcademicRiskPredictionRecord.student_id.ilike(f"%{search_term}%")
        )

    records = records_query.limit(max(limit * 10, 100)).all()

    seen: set[str] = set()
    students: list[ConnectedStudentSummary] = []
    for record in records:
        if record.student_id in seen:
            continue
        seen.add(record.student_id)

        payload = record.request_payload if isinstance(record.request_payload, dict) else {}
        completion_rate = payload.get("assessment_completion_rate")
        if completion_rate is not None:
            try:
                completion_rate = float(completion_rate) * 100.0
            except (TypeError, ValueError):
                completion_rate = None

        students.append(
            ConnectedStudentSummary(
                student_id=record.student_id,
                engagement_score=0.0,
                engagement_level="Unavailable",
                engagement_trend=None,
                risk_level=record.risk_level or "Unknown",
                risk_probability=record.risk_score,
                learning_style=None,
                avg_completion_rate=completion_rate,
                has_learning_profile=False,
                last_updated=record.created_at.isoformat() if record.created_at else None,
            )
        )

        if len(students) >= limit:
            break

    return ConnectedStudentSearchResponse(
        query=query,
        total=len(students),
        limit=limit,
        institute_id=institute_id,
        students=students,
    )


def get_local_prediction_request(
    db: Session,
    student_id: str,
) -> AcademicRiskRequest | None:
    """Fallback request builder from the latest stored academic-risk request payload."""
    record = (
        db.query(AcademicRiskPredictionRecord)
        .filter(AcademicRiskPredictionRecord.student_id == student_id)
        .order_by(desc(AcademicRiskPredictionRecord.created_at))
        .first()
    )

    if record is None or not isinstance(record.request_payload, dict):
        return None

    try:
        return AcademicRiskRequest.model_validate(record.request_payload)
    except Exception:
        return None
