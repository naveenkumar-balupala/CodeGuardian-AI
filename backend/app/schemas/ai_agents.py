from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class OrchestrateRequest(BaseModel):
    repository_id: str

class ChatMessagePayload(BaseModel):
    role: str # 'user' | 'assistant'
    content: str

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[ChatMessagePayload]] = None

class ChatResponse(BaseModel):
    answer: str
    referenced_files: List[str]
    suggested_followups: List[str]

class OrchestrateResponse(BaseModel):
    repository_id: str
    completed_nodes: List[str]
    repository_data: Optional[Dict[str, Any]]
    architecture_data: Optional[Dict[str, Any]]
    security_data: Optional[Dict[str, Any]]
    database_data: Optional[Dict[str, Any]]
    performance_data: Optional[Dict[str, Any]]
    testing_data: Optional[Dict[str, Any]]
    documentation_data: Optional[Dict[str, Any]]
    recommendations_data: Optional[Dict[str, Any]]
    report_data: Optional[Dict[str, Any]]
