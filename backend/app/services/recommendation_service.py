"""LifeSphere AI-X Preventive Recommendation Generation Service.

Synthesizes actionable, preventive recommendations from risk assessment factors
without diagnosing diseases or replacing licensed medical consultation.
"""

import uuid
from typing import List
from app.schemas import (
    RiskAssessmentResponse,
    RiskCategory,
    PreventiveRecommendation,
    RecommendationResponse,
)


class RecommendationService:
    """Generates cautious preventive and environmental protection suggestions."""

    def generate_recommendations(
        self, assessment: RiskAssessmentResponse, user_id: str
    ) -> RecommendationResponse:
        recommendations: List[PreventiveRecommendation] = []

        # 1. Environmental Air Quality & Respiratory Protection
        if assessment.respiratory_environmental_risk in (RiskCategory.HIGH, RiskCategory.CRITICAL):
            recommendations.append(
                PreventiveRecommendation(
                    id=str(uuid.uuid4()),
                    category="Environmental Protection",
                    priority="Urgent",
                    recommendation_text="Minimize outdoor physical exertion and secure indoor air filtration.",
                    rationale="Ambient particulate levels (PM2.5) combined with respiratory telemetry indicate elevated airway sensitivity.",
                    action_item="Operate HEPA room filter, close windows facing roadways, and use a fitted N95 respirator if outdoor transit is unavoidable.",
                )
            )
        elif assessment.respiratory_environmental_risk == RiskCategory.ELEVATED:
            recommendations.append(
                PreventiveRecommendation(
                    id=str(uuid.uuid4()),
                    category="Environmental Protection",
                    priority="Moderate",
                    recommendation_text="Consider rescheduling intense outdoor aerobic activities to early morning hours.",
                    rationale="Moderate particulate burden detected in the immediate microclimate zone.",
                    action_item="Monitor ambient AQI updates before prolonged outdoor exercise.",
                )
            )

        # 2. Thermal Stress & Hydration
        if assessment.heat_stress_risk in (RiskCategory.HIGH, RiskCategory.CRITICAL):
            recommendations.append(
                PreventiveRecommendation(
                    id=str(uuid.uuid4()),
                    category="Thermoregulation",
                    priority="Urgent",
                    recommendation_text="Seek air-conditioned or shaded shelter immediately and initiate active cooling.",
                    rationale="Elevated heat index and heart rate indicate substantial thermal strain.",
                    action_item="Rest in a cooled environment, apply cool damp cloths to neck/wrists, and hydrate with electrolyte fluids.",
                )
            )

        if assessment.dehydration_risk in (RiskCategory.ELEVATED, RiskCategory.HIGH, RiskCategory.CRITICAL):
            recommendations.append(
                PreventiveRecommendation(
                    id=str(uuid.uuid4()),
                    category="Hydration",
                    priority="Moderate",
                    recommendation_text="Increase fluid intake with balanced oral rehydration solution.",
                    rationale="Low relative humidity and thermal exposure accelerate insensible fluid loss.",
                    action_item="Consume 250-350 ml of water or electrolyte beverage every 45-60 minutes.",
                )
            )

        # 3. Overall Lifestyle & Activity Moderation
        if assessment.life_risk_score >= 50.0:
            recommendations.append(
                PreventiveRecommendation(
                    id=str(uuid.uuid4()),
                    category="Activity Adjustment",
                    priority="Urgent",
                    recommendation_text="Reduce physical workload and maintain seated rest.",
                    rationale="Composite Life Risk Score exceeds baseline safety thresholds.",
                    action_item="Pause strenuous tasks, monitor SpO2 and pulse recovery over the next 30 minutes.",
                )
            )
        else:
            recommendations.append(
                PreventiveRecommendation(
                    id=str(uuid.uuid4()),
                    category="Wellness Maintenance",
                    priority="General",
                    recommendation_text="Maintain standard routine with regular hydration intervals.",
                    rationale="Current environmental exposure and physiological signals remain within normal parameters.",
                    action_item="Continue regular daily schedule and wear sensor for continuous baseline calibration.",
                )
            )

        return RecommendationResponse(
            user_id=user_id,
            recommendations=recommendations,
        )


# Global singleton instance
recommendation_service = RecommendationService()
