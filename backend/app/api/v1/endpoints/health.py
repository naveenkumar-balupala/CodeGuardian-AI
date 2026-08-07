from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.database import check_db_health
from app.core.redis import check_redis_health

router = APIRouter()

@router.get("/health", summary="System Health Status")
async def health_check():
    """Returns the operational status of the API engine, PostgreSQL database, and Redis cache."""
    db_ok = await check_db_health()
    redis_ok = await check_redis_health()

    status = "healthy" if (db_ok and redis_ok) else "degraded"

    return {
        "status": "success",
        "data": {
            "status": status,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "services": {
                "postgres": "healthy" if db_ok else "unhealthy",
                "redis": "healthy" if redis_ok else "unhealthy",
            },
        },
    }
