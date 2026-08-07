from typing import Any, Dict, Optional

class AppException(Exception):
    """Base exception class for all custom application errors."""
    status_code: int = 500
    error_code: str = "INTERNAL_SERVER_ERROR"
    message: str = "An unexpected error occurred."

    def __init__(
        self,
        message: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        status_code: Optional[int] = None,
        error_code: Optional[str] = None,
    ):
        if message:
            self.message = message
        if status_code:
            self.status_code = status_code
        if error_code:
            self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)

class NotFoundException(AppException):
    status_code = 404
    error_code = "RESOURCE_NOT_FOUND"
    message = "The requested resource was not found."

class ValidationException(AppException):
    status_code = 400
    error_code = "VALIDATION_ERROR"
    message = "Invalid parameters or payload provided."

class UnauthorizedException(AppException):
    status_code = 401
    error_code = "UNAUTHORIZED"
    message = "Authentication is required to access this resource."

class ForbiddenException(AppException):
    status_code = 403
    error_code = "FORBIDDEN"
    message = "You do not have permission to perform this action."

class DatabaseException(AppException):
    status_code = 500
    error_code = "DATABASE_ERROR"
    message = "A database error occurred while processing your request."

class ExternalServiceException(AppException):
    status_code = 502
    error_code = "EXTERNAL_SERVICE_ERROR"
    message = "Failed to communicate with an external downstream service."
