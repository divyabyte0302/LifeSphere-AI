"""Health Analytics & Longitudinal Biomarker Trends Router for LifeSphere AI-X.

Provides:
- GET /api/analytics/trends: Longitudinal biomarker curves across Daily, Weekly, and Monthly horizons.
- GET /api/analytics/summary: Clinical biomarker summary cards, thresholds, and anomaly alerts.
- GET /api/analytics/export: Export patient time-series data as formatted CSV for physician review.
"""

import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, Response, status

from app.dependencies.auth import get_current_user
from app.schemas import (
    HealthAnalyticsResponse,
    AnalyticsTimeHorizon,
)
from app.services.firestore_service import firestore_service

logger = logging.getLogger("lifesphere.analytics")

router = APIRouter(prefix="/api/analytics", tags=["Health Analytics"])


@router.get(
    "/trends",
    response_model=HealthAnalyticsResponse,
    summary="Get Longitudinal Health Trends",
)
async def get_health_trends(
    horizon: AnalyticsTimeHorizon = Query(
        AnalyticsTimeHorizon.WEEKLY,
        description="Time horizon: daily (hourly resolution), weekly (7 days), or monthly (30 days)",
    ),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve multi-biomarker longitudinal trends with environmental correlation."""
    uid = current_user["uid"]
    analytics_data = await firestore_service.get_health_analytics_trends(uid, horizon=horizon.value)
    return HealthAnalyticsResponse(**analytics_data)


@router.get(
    "/summary",
    summary="Biomarker Clinical Summary Cards",
)
async def get_analytics_summary(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve statistical summary cards for vitals, including average, range, and clinical bands."""
    uid = current_user["uid"]
    analytics_data = await firestore_service.get_health_analytics_trends(uid, horizon="monthly")
    return {
        "user_id": uid,
        "summaries": analytics_data.get("summaries", []),
        "environmental_correlation": analytics_data.get("environmental_correlation", {}),
        "disclaimer": analytics_data.get("disclaimer"),
    }


@router.get(
    "/export",
    summary="Export Health Analytics as CSV",
)
async def export_health_analytics_csv(
    horizon: AnalyticsTimeHorizon = Query(AnalyticsTimeHorizon.MONTHLY),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Generate and download a CSV formatted dataset strictly scoped to authenticated user."""
    uid = current_user["uid"]
    analytics_data = await firestore_service.get_health_analytics_trends(uid, horizon=horizon.value)
    trends = analytics_data.get("trends", [])

    date_start = trends[0].get("timestamp") if trends else "N/A"
    date_end = trends[-1].get("timestamp") if trends else "N/A"

    csv_lines = [
        "PatientID,DateRangeStart,DateRangeEnd,TimestampUTC,Horizon,Biomarker,Value,Unit,SecondaryValue,SiteOrStage,DataSource,IsMissing,QualityScore"
    ]
    for pt in trends:
        sec_val = pt.get("secondary_value") if pt.get("secondary_value") is not None else ""
        is_missing = pt.get("is_missing", False)
        quality = pt.get("quality_score", 100.0)
        csv_lines.append(
            f'"{uid}","{date_start}","{date_end}","{pt.get("timestamp")}","{horizon.value}","{pt.get("metric_type")}",{pt.get("value")},"{pt.get("unit")}","{sec_val}","{pt.get("site_or_stage")}","{pt.get("source")}",{is_missing},{quality}'
        )

    csv_content = "\n".join(csv_lines)
    filename = f"lifesphere_health_analytics_{uid}_{horizon.value}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
