import pytest
from httpx import AsyncClient
from app.models import User

@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient, mock_user: User):
    """Test successful user login via /api/v1/auth/login endpoint."""
    response = await async_client.post(
        "/api/v1/auth/login",
        json={"email": mock_user.email, "password": "TestPassword123!"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data["data"]
    assert data["data"]["token_type"] == "bearer"
    assert data["data"]["user"]["email"] == mock_user.email

@pytest.mark.asyncio
async def test_login_invalid_password(async_client: AsyncClient, mock_user: User):
    """Test login failure with invalid password."""
    response = await async_client.post(
        "/api/v1/auth/login",
        json={"email": mock_user.email, "password": "WrongPassword123!"},
    )

    assert response.status_code == 401
    data = response.json()
    assert data["status"] == "error"
