from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.exceptions.base import AppException
from app.core.logging import get_logger

logger = get_logger(__name__)

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    logger.warning(
        "Application exception caught",
        error_code=exc.error_code,
        message=exc.message,
        status_code=exc.status_code,
        request_id=request_id,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id,
            },
        },
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    logger.warning(
        "Request validation error",
        errors=exc.errors(),
        request_id=request_id,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed for the request parameters or body.",
                "details": exc.errors(),
                "request_id": request_id,
            },
        },
    )

async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    logger.error(
        "Unhandled internal server error",
        error=str(exc),
        request_id=request_id,
        path=request.url.path,
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected internal server error occurred.",
                "request_id": request_id,
            },
        },
    )
