import os

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PROJECT_NAME: str = "CodeGuardian AI API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "change_this_to_a_super_secret_production_key_32_chars_min"

    @field_validator("SECRET_KEY", mode="after")
    def validate_secret_key(cls, v: str, info) -> str:
        if os.getenv("ENVIRONMENT") == "production" and "change_this" in v:
            raise ValueError("SECRET_KEY must be overridden with a secure secret in production!")
        return v

    # JWT & Auth Security
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    MAX_FAILED_LOGIN_ATTEMPTS: int = 5
    ACCOUNT_LOCKOUT_MINUTES: int = 15

    # CORS Allowed Origins
    ALLOWED_HOSTS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    @field_validator("ALLOWED_HOSTS", mode="before")
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v

    # Database Configuration
    USE_SQLITE_DEV: bool = True
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "codeguardian"
    POSTGRES_PASSWORD: str = "codeguardian_pass"
    POSTGRES_DB: str = "codeguardian_db"

    @property
    def ASYNC_DATABASE_URI(self) -> str:
        # Use lightweight zero-dependency SQLite for local standalone development
        if self.USE_SQLITE_DEV or os.getenv("USE_SQLITE_DEV", "true").lower() == "true":
            return "sqlite+aiosqlite:///./codeguardian.db"
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # Redis Cache & Rate Limiting
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    RATE_LIMIT_PER_MINUTE: int = 60

    @property
    def REDIS_URI(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/0"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"

    # OAuth Providers
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    OAUTH_REDIRECT_URI: str = "http://localhost:3000/auth/callback"

    # AI Module Settings
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    DEFAULT_LLM_PROVIDER: str = "openai"
    DEFAULT_LLM_MODEL: str = "gpt-4o"

settings = Settings()
