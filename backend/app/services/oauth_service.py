from typing import Any

import httpx

from app.core.config import settings
from app.exceptions.base import ExternalServiceException


class OAuthService:
    """Service handling GitHub and Google OAuth2 integration."""

    @staticmethod
    def get_github_auth_url() -> str:
        client_id = settings.GITHUB_CLIENT_ID or "mock_github_client_id"
        return f"https://github.com/login/oauth/authorize?client_id={client_id}&scope=user:email"

    @staticmethod
    def get_google_auth_url() -> str:
        client_id = settings.GOOGLE_CLIENT_ID or "mock_google_client_id"
        redirect_uri = settings.OAUTH_REDIRECT_URI
        return f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=openid%20email%20profile"

    @staticmethod
    async def process_github_callback(code: str) -> dict[str, Any]:
        """Exchanges GitHub OAuth code for access token and fetches user profile."""
        if settings.ENVIRONMENT == "development" and code.startswith("mock_"):
            return {
                "oauth_id": "github_mock_12345",
                "email": "dev.github@codeguardian.ai",
                "full_name": "GitHub Developer",
                "oauth_provider": "GITHUB",
            }

        async with httpx.AsyncClient() as client:
            # 1. Exchange code for access token
            token_resp = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                },
            )
            if token_resp.status_code != 200:
                raise ExternalServiceException("Failed to exchange GitHub authorization code.")

            token_data = token_resp.json()
            access_token = token_data.get("access_token")
            if not access_token:
                raise ExternalServiceException("GitHub OAuth did not return an access token.")

            # 2. Fetch user profile
            user_resp = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_resp.status_code != 200:
                raise ExternalServiceException("Failed to fetch GitHub user profile.")

            profile = user_resp.json()
            email = profile.get("email") or f"{profile.get('login')}@github.user"

            return {
                "oauth_id": str(profile.get("id")),
                "email": email,
                "full_name": profile.get("name") or profile.get("login"),
                "oauth_provider": "GITHUB",
            }

    @staticmethod
    async def process_google_callback(code: str) -> dict[str, Any]:
        """Exchanges Google OAuth code for access token and fetches user profile."""
        if settings.ENVIRONMENT == "development" and code.startswith("mock_"):
            return {
                "oauth_id": "google_mock_67890",
                "email": "dev.google@codeguardian.ai",
                "full_name": "Google Developer",
                "oauth_provider": "GOOGLE",
            }

        async with httpx.AsyncClient() as client:
            token_resp = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.OAUTH_REDIRECT_URI,
                },
            )
            if token_resp.status_code != 200:
                raise ExternalServiceException("Failed to exchange Google authorization code.")

            token_data = token_resp.json()
            access_token = token_data.get("access_token")

            user_resp = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_resp.status_code != 200:
                raise ExternalServiceException("Failed to fetch Google user profile.")

            profile = user_resp.json()
            return {
                "oauth_id": str(profile.get("id")),
                "email": profile.get("email"),
                "full_name": profile.get("name"),
                "oauth_provider": "GOOGLE",
            }
