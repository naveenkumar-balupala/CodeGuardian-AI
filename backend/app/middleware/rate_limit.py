import time

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response

from app.core.config import settings
from app.core.logging import get_logger
from app.core.redis import redis_client

logger = get_logger(__name__)

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Redis-backed sliding window rate limiter middleware for Auth routes."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Apply rate limiting primarily on Auth API endpoints
        if not request.url.path.startswith(f"{settings.API_V1_STR}/auth"):
            return await call_next(request)

        if not redis_client:
            # Fallback if Redis unavailable
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        current_time = int(time.time())
        window_key = f"rate_limit:{client_ip}:{current_time // 60}"

        try:
            current_requests = await redis_client.incr(window_key)
            if current_requests == 1:
                await redis_client.expire(window_key, 60)

            if current_requests > settings.RATE_LIMIT_PER_MINUTE:
                logger.warning("Rate limit exceeded", client_ip=client_ip, path=request.url.path)
                return JSONResponse(
                    status_code=429,
                    content={
                        "status": "error",
                        "error": {
                            "code": "TOO_MANY_REQUESTS",
                            "message": f"Rate limit exceeded. Maximum {settings.RATE_LIMIT_PER_MINUTE} requests allowed per minute.",
                        },
                    },
                )
        except Exception as exc:
            logger.error("Rate limiter Redis check failed", error=str(exc))

        return await call_next(request)
