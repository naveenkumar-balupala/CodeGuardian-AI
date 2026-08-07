from typing import Optional
import redis.asyncio as aioredis

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

redis_client: Optional[aioredis.Redis] = None

async def init_redis() -> None:
    """Initializes the global async Redis connection pool."""
    global redis_client
    try:
        redis_client = aioredis.from_url(
            settings.REDIS_URI,
            encoding="utf-8",
            decode_responses=True,
        )
        await redis_client.ping()
        logger.info("Redis Connection Pool Initialized Successfully")
    except Exception as exc:
        logger.error("Failed to connect to Redis", error=str(exc))
        redis_client = None

async def close_redis() -> None:
    """Closes the Redis connection pool."""
    global redis_client
    if redis_client:
        await redis_client.close()
        logger.info("Redis Connection Pool Closed")

async def check_redis_health() -> bool:
    """Checks Redis server health."""
    if not redis_client:
        return False
    try:
        return await redis_client.ping()
    except Exception as exc:
        logger.error("Redis Health Check Failed", error=str(exc))
        return False
