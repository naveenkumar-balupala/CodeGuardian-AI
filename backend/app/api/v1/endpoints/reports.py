import os
import uuid

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.exceptions.base import NotFoundException
from app.models import User
from app.schemas.common import ResponseEnvelope
from app.schemas.reports import ReportExportRequest, ReportExportResponse
from app.services.report_export_service import REPORTS_DIR, ReportExportService

router = APIRouter()

@router.post("/repositories/{repo_id}/reports/generate", summary="Generate Executive PDF/DOCX/PPTX Report", response_model=ResponseEnvelope[ReportExportResponse])
async def generate_repository_report(
    repo_id: uuid.UUID,
    payload: ReportExportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generates an executive report in PDF, DOCX, or PPTX format featuring Executive Summary, Security CVSS Scores, Architecture Metrics, AI Explanations, and Custom Branding."""
    report = await ReportExportService.generate_report(db, repo_id, payload)
    return ResponseEnvelope(data=ReportExportResponse.model_validate(report))

@router.get("/repositories/{repo_id}/reports", summary="List Repository Generated Reports", response_model=ResponseEnvelope[list[ReportExportResponse]])
async def list_repository_reports(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves list of generated report files for repository."""
    reports = await ReportExportService.list_reports(db, repo_id)
    return ResponseEnvelope(data=[ReportExportResponse.model_validate(r) for r in reports])

@router.get("/reports/download/{file_name}", summary="Download Report File Document")
async def download_report_file(
    file_name: str,
):
    """Serves generated report document file for browser download."""
    file_path = os.path.join(REPORTS_DIR, file_name)
    if not os.path.exists(file_path):
        raise NotFoundException("Report file not found.")

    return FileResponse(
        path=file_path,
        filename=file_name,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{file_name}"'
        },
    )

