import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models import User
from app.schemas.scanner import RepositoryAnalysisResponse
from app.schemas.common import ResponseEnvelope
from app.services.scanner_service import ScannerService

router = APIRouter()

@router.post("/repositories/{repo_id}/scan-tech", summary="Trigger Tech & Architecture Scan", response_model=ResponseEnvelope[RepositoryAnalysisResponse])
async def trigger_tech_scan(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Triggers automated detection of languages, frameworks, architecture, databases, CI/CD, Docker, and Swagger."""
    analysis = await ScannerService.analyze_repository(db, repo_id)
    return ResponseEnvelope(data=RepositoryAnalysisResponse.model_validate(analysis))

@router.get("/repositories/{repo_id}/analysis", summary="Get Repository Tech Analysis & Summary", response_model=ResponseEnvelope[RepositoryAnalysisResponse])
async def get_tech_analysis(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves repository technology stack analysis and executive summary report."""
    analysis = await ScannerService.get_analysis(db, repo_id)
    return ResponseEnvelope(data=RepositoryAnalysisResponse.model_validate(analysis))
