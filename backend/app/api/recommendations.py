"""Preventive Recommendation Endpoints.

Provides:
- POST /api/recommendations/generate: Synthesize personalized preventive guidance.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, status
from app.dependencies.auth import get_current_user
from app.schemas import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/api/recommendations", tags=["Preventive Recommendations"])


@router.post(
    "/generate",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Personalized Preventive Guidance",
)
async def generate_recommendations(
    payload: RecommendationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Synthesizes structured preventive guidance based on risk factors and environmental telemetry.

    Guidance is strictly non-diagnostic and emphasizes non-pharmaceutical precautions.
    """
    uid = current_user["uid"]
    return recommendation_service.generate_recommendations(
        assessment=payload.risk_assessment, user_id=uid
    )
