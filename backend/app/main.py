from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import select

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.redis import init_redis, close_redis
from app.core.database import engine, AsyncSessionLocal
import app.models # Ensures all models are registered in Base.metadata
from app.models import Base, User, UserRole, UserStatus, Organization, OrgTier, OrganizationMember, MemberRole
from app.core.security import get_password_hash
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.exceptions.base import AppException
from app.exceptions.handlers import (
    app_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.api.v1.router import api_v1_router

setup_logging()
logger = get_logger(__name__)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

async def auto_init_db():
    """Auto-creates DB tables and seeds admin user if database is empty."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User).where(User.email == "admin@codeguardian.ai"))
            user = result.scalar_one_or_none()
            if not user:
                admin_user = User(
                    email="admin@codeguardian.ai",
                    hashed_password=get_password_hash("admin123"),
                    full_name="System Administrator",
                    role=UserRole.ADMIN,
                    status=UserStatus.ACTIVE,
                )
                session.add(admin_user)
                await session.flush()

                org = Organization(
                    name="CodeGuardian Enterprise",
                    slug="codeguardian-enterprise",
                    tier=OrgTier.ENTERPRISE,
                )
                session.add(org)
                await session.flush()

                session.add(OrganizationMember(
                    organization_id=org.id,
                    user_id=admin_user.id,
                    role=MemberRole.OWNER,
                ))
                await session.commit()
                logger.info("Auto-seeded default admin user: admin@codeguardian.ai / admin123")
    except Exception as exc:
        logger.warning("DB auto-init notice", error=str(exc))

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan event handler for startup and shutdown procedures."""
    logger.info("Starting CodeGuardian AI Backend Server", environment=settings.ENVIRONMENT)
    
    # Auto-initialize database & seed data
    await auto_init_db()

    # Initialize Redis connection
    await init_redis()

    yield

    # Teardown Redis connection
    await close_redis()
    logger.info("CodeGuardian AI Backend Server Shutdown Complete")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Set CORS middleware
if settings.ALLOWED_HOSTS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add Security, Compression, Request ID correlation tracking & Rate Limiting middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(RateLimitMiddleware)

# Register Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Register Versioned API Routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/", include_in_schema=False)
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "status": "running",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }
