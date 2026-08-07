import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models import User
from app.schemas.common import ResponseEnvelope
from app.schemas.security_agent import SecurityAgentReportResponse
from app.services.security_agent_service import SecurityAgentService

router = APIRouter()

@router.post("/repositories/{repo_id}/security-agent/scan", summary="Trigger Security Agent SAST & Vulnerability Scan", response_model=ResponseEnvelope[SecurityAgentReportResponse])
async def trigger_security_agent_scan(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Triggers automated detection of SQL Injection, Secrets, XSS, JWT flaws, CSRF, Dependency CVEs, OWASP Top 10 mapping, CVSS scoring, and chart generation."""
    report = await SecurityAgentService.perform_security_scan(db, repo_id)
    return ResponseEnvelope(data=SecurityAgentReportResponse.model_validate(report))

@router.get("/repositories/{repo_id}/security-agent/report", summary="Get Latest Security Agent Report & Charts", response_model=ResponseEnvelope[SecurityAgentReportResponse])
async def get_latest_security_agent_report(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves latest Security Agent vulnerability report, composite risk score, CVSS scores, OWASP distribution, and chart datasets."""
    report = await SecurityAgentService.get_latest_report(db, repo_id)
    return ResponseEnvelope(data=SecurityAgentReportResponse.model_validate(report))
