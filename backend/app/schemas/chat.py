import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class SourceReference(BaseModel):
    file_path: str
    line_start: Optional[int] = None
    line_end: Optional[int] = None
    snippet: Optional[str] = None

class CreateChatSessionRequest(BaseModel):
    title: Optional[str] = "New Code Analysis Session"

class SendChatMessageRequest(BaseModel):
    message: str = Field(min_length=1, description="User prompt or question regarding codebase")

class ChatMessageResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    role: str # 'user' | 'assistant' | 'system'
    content: str
    referenced_files: List[SourceReference]
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionResponse(BaseModel):
    id: uuid.UUID
    repository_id: uuid.UUID
    user_id: uuid.UUID
    title: str
    created_at: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True
