from typing import Any

from pydantic import BaseModel


class OrchestrateRequest(BaseModel):
    repository_id: str

class ChatMessagePayload(BaseModel):
    role: str # 'user' | 'assistant'
    content: str

class ChatRequest(BaseModel):
    query: str
    history: list[ChatMessagePayload] | None = None

class ChatResponse(BaseModel):
    answer: str
    referenced_files: list[str]
    suggested_followups: list[str]

class OrchestrateResponse(BaseModel):
    repository_id: str
    completed_nodes: list[str]
    repository_data: dict[str, Any] | None
    architecture_data: dict[str, Any] | None
    security_data: dict[str, Any] | None
    database_data: dict[str, Any] | None
    performance_data: dict[str, Any] | None
    testing_data: dict[str, Any] | None
    documentation_data: dict[str, Any] | None
    recommendations_data: dict[str, Any] | None
    report_data: dict[str, Any] | None
