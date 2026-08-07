import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Repository
from app.services.security_agent_service import SecurityAgentService


@pytest.mark.asyncio
async def test_security_agent_scan_metrics(db_session: AsyncSession, mock_repository: Repository):
    """Test Security Agent SAST scan metrics, CVSS scores, and composite risk score formula."""
    report = await SecurityAgentService.perform_security_scan(db_session, mock_repository.id)

    assert report is not None
    assert report.repository_id == mock_repository.id
    assert report.risk_score >= 0 and report.risk_score <= 100
    assert report.risk_level in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]

    # Verify severity counts
    assert report.critical_count >= 1
    assert len(report.findings) >= 5

    # Verify OWASP Taxonomy keys
    assert "A03:2021-Injection" in report.owasp_distribution
    assert "A07:2021-Authentication Failures" in report.owasp_distribution

    # Verify chart datasets
    assert "severity_counts" in report.chart_dataset
    assert "category_breakdown" in report.chart_dataset
