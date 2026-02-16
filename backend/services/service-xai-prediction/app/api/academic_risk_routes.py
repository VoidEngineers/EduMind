"""
Academic Risk Prediction Routes
"""

from app.core.logging import get_logger
from app.schemas.academic_risk import AcademicRiskRequest, AcademicRiskResponse
from app.services.academic_risk_service import academic_risk_service
from fastapi import APIRouter, HTTPException, status

logger = get_logger(__name__)
router = APIRouter(tags=["academic-risk"])


@router.post(
    "/academic-risk/predict",
    response_model=AcademicRiskResponse,
    status_code=status.HTTP_200_OK,
)
async def predict_academic_risk(request: AcademicRiskRequest):
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

    return response


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
