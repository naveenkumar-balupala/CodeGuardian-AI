import pytest
from httpx import AsyncClient

from app.models import Repository


@pytest.mark.asyncio
async def test_trigger_security_agent_scan(async_client: AsyncClient, mock_repository: Repository, auth_headers: dict):
    """Test triggering Security Agent scan via REST API."""
    response = await async_client.post(
        f"/api/v1/repositories/{mock_repository.id}/security-agent/scan",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["repository_id"] == str(mock_repository.id)
    assert "risk_score" in data["data"]
    assert len(data["data"]["findings"]) > 0

@pytest.mark.asyncio
async def test_trigger_architecture_scan(async_client: AsyncClient, mock_repository: Repository, auth_headers: dict):
    """Test triggering Architecture scan via REST API."""
    response = await async_client.post(
        f"/api/v1/repositories/{mock_repository.id}/architecture/scan",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["pattern"] == "MONOREPO"
    assert "mermaid_diagram" in data["data"]
