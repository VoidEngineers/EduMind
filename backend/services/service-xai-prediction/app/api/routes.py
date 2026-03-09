from app.api.dependencies import get_db
from app.core.config import settings
from app.core.logging import get_logger
from app.models import XAIPredictionRecord
from app.schemas import (
    HealthResponse,
    ModelInfoResponse,
    PredictionRequest,
    PredictionResponse,
)
from app.services.ml_service import ml_service
from app.services.sync_service import SyncServiceError, sync_service
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

logger = get_logger(__name__)
router = APIRouter(tags=["predictions"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service=settings.SERVICE_NAME,
        version=settings.VERSION,
        model_loaded=ml_service.model is not None,
    )


@router.post(
    "/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK
)
async def predict_student_outcome(
    request: PredictionRequest, db: Session = Depends(get_db)
):
    """
    Predict student academic outcome with explainable AI

    Args:
        request: Student features for prediction

    Returns:
        Prediction result with XAI explanation
    """
    logger.info(f"Prediction request for student: {request.student_id}")

    # Make prediction
    prediction, explanation = await ml_service.predict(request)

    # Generate recommendations
    recommendations = ml_service._generate_recommendations(
        request, prediction.risk_level
    )

    # Return response
    response = PredictionResponse(
        prediction=prediction,
        explanation=explanation,
        recommendations=recommendations,
    )

    logger.info(
        f"Prediction complete: {prediction.predicted_class} "
        f"(probability: {prediction.probability:.2%}, risk: {prediction.risk_level})"
    )

    persist_prediction(db=db, request=request, response=response)

    return response


@router.post(
    "/sync/predict/{student_id}",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
)
async def sync_and_predict_student_outcome(
    student_id: str,
    db: Session = Depends(get_db),
    days: int = Query(
        14,
        ge=1,
        le=90,
        description="How many recent engagement-metric days to use",
    ),
):
    """
    Pull engagement + learning-style data for student_id and run XAI prediction.
    """
    try:
        request = await sync_service.build_prediction_request(student_id=student_id, days=days)
    except SyncServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    logger.info(
        "Synced features for %s: interactions=%s, inactive=%s, completion=%.3f",
        request.student_id,
        request.total_interactions,
        request.days_inactive,
        request.completion_rate,
    )

    prediction, explanation = await ml_service.predict(request)
    recommendations = ml_service._generate_recommendations(request, prediction.risk_level)

    response = PredictionResponse(
        prediction=prediction,
        explanation=explanation,
        recommendations=recommendations,
    )

    persist_prediction(db=db, request=request, response=response)

    return response


@router.get("/model/info", response_model=ModelInfoResponse)
async def get_model_info():
    """Get information about the loaded ML model"""
    return ModelInfoResponse(
        model_type="XGBoost Classifier with SHAP Explanations",
        features_count=len(ml_service.feature_names),
        feature_names=ml_service.feature_names,
        classes=ml_service.label_encoder.classes_.tolist(),
        metadata=ml_service.metadata,
    )


def persist_prediction(
    db: Session, request: PredictionRequest, response: PredictionResponse
) -> None:
    """Persist prediction output; failures are logged but do not block the API."""
    try:
        metrics = ml_service.metadata.get("metrics")
        if not metrics:
            metrics = {"accuracy": ml_service.metadata.get("accuracy")}

        record = XAIPredictionRecord(
            student_id=request.student_id,
            request_payload=request.model_dump(mode="json"),
            prediction_payload=response.prediction.model_dump(mode="json"),
            explanation_payload=response.explanation.model_dump(mode="json"),
            recommendations=response.recommendations,
            model_metrics=metrics,
            predicted_class=response.prediction.predicted_class,
            probability=response.prediction.probability,
            risk_level=response.prediction.risk_level,
            model_version=str(ml_service.metadata.get("version", "")) or None,
        )
        db.add(record)
        db.commit()
    except Exception as exc:
        db.rollback()
        logger.warning(f"Could not persist XAI prediction record: {exc}")
