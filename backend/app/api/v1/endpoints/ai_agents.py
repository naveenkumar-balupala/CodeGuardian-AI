import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.chat import ChatAgent
from app.ai.agents.graph import MultiAgentGraphEngine
from app.api.deps import get_current_user, get_db
from app.exceptions.base import NotFoundException
from app.models import Repository, User
from app.schemas.ai_agents import ChatRequest, ChatResponse, OrchestrateResponse
from app.schemas.common import ResponseEnvelope

router = APIRouter()

@router.post("/orchestrate/{repo_id}", summary="Trigger LangGraph Multi-Agent Security Audit", response_model=ResponseEnvelope[OrchestrateResponse])
async def orchestrate_multi_agent_audit(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Executes the full LangGraph 11-Agent State Machine workflow."""
    repo = await db.get(Repository, repo_id)
    if not repo or repo.is_deleted:
        raise NotFoundException("Repository not found.")

    final_state = await MultiAgentGraphEngine.run_audit_workflow(
        repo_id=str(repo.id),
        repo_full_name=repo.full_name,
    )

    response_data = OrchestrateResponse(
        repository_id=final_state["repository_id"],
        completed_nodes=final_state["completed_nodes"],
        repository_data=final_state["repository_data"],
        architecture_data=final_state["architecture_data"],
        security_data=final_state["security_data"],
        database_data=final_state["database_data"],
        performance_data=final_state["performance_data"],
        testing_data=final_state["testing_data"],
        documentation_data=final_state["documentation_data"],
        recommendations_data=final_state["recommendations_data"],
        report_data=final_state["report_data"],
    )

    return ResponseEnvelope(data=response_data)

@router.post("/chat", summary="Conversational AI Code Guardian Assistant", response_model=ResponseEnvelope[ChatResponse])
async def chat_with_code_guardian(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """Interactive Chat Agent with codebase memory context."""
    history_dict = [msg.model_dump() for msg in payload.history] if payload.history else []
    chat_output = await ChatAgent.chat(payload.query, history_dict)
    return ResponseEnvelope(data=ChatResponse.model_validate(chat_output))
