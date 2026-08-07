from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")

class ResponseEnvelope(BaseModel, Generic[T]):
    """Standardized API response wrapper."""
    status: str = "success"
    data: T
    meta: dict | None = None

class PaginatedMeta(BaseModel):
    total: int
    page: int
    size: int
    pages: int

class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized paginated list response wrapper."""
    status: str = "success"
    data: list[T]
    meta: PaginatedMeta
