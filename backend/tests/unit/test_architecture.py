import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Repository
from app.services.architecture_service import ArchitectureService

@pytest.mark.asyncio
async def test_architecture_scan_mermaid_generation(db_session: AsyncSession, mock_repository: Repository):
    """Test Architecture Analyzer engine, Mermaid syntax output, and coupling scores."""
    report = await ArchitectureService.perform_architecture_scan(db_session, mock_repository.id)

    assert report is not None
    assert report.repository_id == mock_repository.id
    assert report.pattern == "MONOREPO"
    assert report.coupling_score > 0

    # Verify Mermaid syntax structure
    assert "graph TD" in report.mermaid_diagram
    assert "subgraph Frontend" in report.mermaid_diagram
    assert "subgraph Backend" in report.mermaid_diagram

    # Verify detected patterns & violations
    assert len(report.detected_patterns) > 0
    assert len(report.solid_violations) > 0
    assert len(report.module_coupling) > 0
