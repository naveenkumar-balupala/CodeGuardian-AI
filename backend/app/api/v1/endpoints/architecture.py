import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models import User
from app.schemas.architecture import ArchitectureReportResponse
from app.schemas.common import ResponseEnvelope
from app.services.architecture_service import ArchitectureService

router = APIRouter()

@router.post("/repositories/{repo_id}/architecture/scan", summary="Trigger Architecture Analysis & Mermaid Graph Scan", response_model=ResponseEnvelope[ArchitectureReportResponse])
async def trigger_architecture_scan(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Triggers automated detection of architectural pattern, Mermaid dependency diagram generation, coupling metrics, and SOLID/DRY/KISS principle inspection."""
    report = await ArchitectureService.perform_architecture_scan(db, repo_id)
    return ResponseEnvelope(data=ArchitectureReportResponse.model_validate(report))

@router.get("/repositories/{repo_id}/architecture/report", summary="Get Latest Architecture Report & Mermaid Diagram", response_model=ResponseEnvelope[ArchitectureReportResponse])
async def get_latest_architecture_report(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves latest Architecture report, Mermaid diagram syntax, coupling scores, SOLID/DRY/KISS violations, design patterns, and AI recommendations."""
    report = await ArchitectureService.get_latest_report(db, repo_id)
    return ResponseEnvelope(data=ArchitectureReportResponse.model_validate(report))
