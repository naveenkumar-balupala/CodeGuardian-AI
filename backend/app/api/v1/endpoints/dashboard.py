from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models import User
from app.schemas.dashboard import DashboardSummaryResponse
from app.schemas.common import ResponseEnvelope
from app.services.dashboard_service import DashboardService

router = APIRouter()

@router.get("/summary", summary="Get Dashboard Summary Metrics", response_model=ResponseEnvelope[DashboardSummaryResponse])
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves composite security scores, severity breakdowns, monitored repositories, and notifications."""
    summary = await DashboardService.get_dashboard_summary(db)
    return ResponseEnvelope(data=summary)
