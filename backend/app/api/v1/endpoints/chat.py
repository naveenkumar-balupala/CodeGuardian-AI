import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models import User
from app.schemas.chat import (
    ChatMessageResponse,
    ChatSessionResponse,
    CreateChatSessionRequest,
    SendChatMessageRequest,
)
from app.schemas.common import ResponseEnvelope
from app.services.chat_rag_service import ChatRAGService

router = APIRouter()

@router.post("/repositories/{repo_id}/chat/sessions", summary="Create Repository Chat Session", response_model=ResponseEnvelope[ChatSessionResponse])
async def create_chat_session(
    repo_id: uuid.UUID,
    payload: CreateChatSessionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Creates a new repository chat session for RAG-driven code exploration."""
    session = await ChatRAGService.create_session(db, repo_id, current_user.id, payload)
    return ResponseEnvelope(data=ChatSessionResponse.model_validate(session))

@router.get("/repositories/{repo_id}/chat/sessions", summary="List Repository Chat Sessions", response_model=ResponseEnvelope[list[ChatSessionResponse]])
async def list_chat_sessions(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves list of chat sessions for a repository."""
    sessions = await ChatRAGService.list_sessions(db, repo_id, current_user.id)
    return ResponseEnvelope(data=[ChatSessionResponse.model_validate(s) for s in sessions])

@router.get("/chat/sessions/{session_id}", summary="Get Chat Session & Message History", response_model=ResponseEnvelope[ChatSessionResponse])
async def get_chat_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves chat session history and message timeline."""
    session = await ChatRAGService.get_session(db, session_id)
    return ResponseEnvelope(data=ChatSessionResponse.model_validate(session))

@router.post("/chat/sessions/{session_id}/messages", summary="Send User Message & Receive RAG Response", response_model=ResponseEnvelope[ChatMessageResponse])
async def send_chat_message(
    session_id: uuid.UUID,
    payload: SendChatMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sends user query and gets RAG-generated response citing exact repository source files."""
    message = await ChatRAGService.send_message(db, session_id, payload)
    return ResponseEnvelope(data=ChatMessageResponse.model_validate(message))
