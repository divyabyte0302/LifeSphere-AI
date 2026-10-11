"""Machine Learning Risk Prediction Endpoints.

Provides:
- POST /api/predictions/assess: Evaluate multi-factor health-environment risk.
- GET /api/predictions/history: Retrieve historical assessments for authenticated user.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, Query, status
from app.dependencies.auth import get_current_user
from app.schemas import (
    RiskAssessmentRequest,
    RiskAssessmentResponse,
    RiskHistoryResponse,
)
from app.services.risk_service import risk_service
from app.services.firestore_service import firestore_service

router = APIRouter(prefix="/api/predictions", tags=["Risk Predictions"])


@router.post(
    "/assess",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Compute Multi-Factor Life Risk Assessment",
)
async def assess_risk(
    payload: RiskAssessmentRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Evaluate physiological and environmental signals using the transparent fusion engine.

    Persists resulting assessment document in users/{uid}/predictions/{id}.
    Provides 1-hour, 6-hour, 12-hour, and 24-hour forecast projections.
    """
    uid = current_user["uid"]

    # Calculate assessment
    assessment = risk_service.assess_risk(
        health=payload.health_measurement,
        env=payload.environment_observation,
        user_id=uid,
        pre_existing_conditions=payload.pre_existing_conditions,
    )

    # Persist in Cloud Firestore subcollection users/{uid}/predictions
    await firestore_service.save_prediction(uid, assessment.model_dump())

    return assessment


@router.get(
    "/history",
    response_model=RiskHistoryResponse,
    summary="Get User Risk Prediction History",
)
async def get_prediction_history(
    limit: int = Query(default=20, ge=1, le=100, description="Maximum historical assessments to retrieve"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve historical risk assessments strictly bounded to the authenticated caller's UID."""
    uid = current_user["uid"]
    records = await firestore_service.get_predictions(uid, limit=limit)

    return RiskHistoryResponse(
        user_id=uid,
        total_assessments=len(records),
        history=[RiskAssessmentResponse(**r) for r in records],
    )
