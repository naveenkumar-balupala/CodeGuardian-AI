from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class ResponseEnvelope(BaseModel, Generic[T]):
    """Standardized API response wrapper."""
    status: str = "success"
    data: T
    meta: Optional[dict] = None

class PaginatedMeta(BaseModel):
    total: int
    page: int
    size: int
    pages: int

class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized paginated list response wrapper."""
    status: str = "success"
    data: List[T]
    meta: PaginatedMeta
