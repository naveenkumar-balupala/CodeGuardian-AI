from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, dashboard, repositories

api_v1_router = APIRouter()

# Include endpoint routers
api_v1_router.include_router(health.router, tags=["Health Check"])
api_v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Security"])
api_v1_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard Analytics"])
api_v1_router.include_router(repositories.router, prefix="/repositories", tags=["Repository Management"])
