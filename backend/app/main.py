from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.redis import init_redis, close_redis
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

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan event handler for startup and shutdown procedures."""
    logger.info("Starting CodeGuardian AI Backend Server", environment=settings.ENVIRONMENT)
    
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

# Add Request ID correlation tracking & Rate Limiting middleware
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
