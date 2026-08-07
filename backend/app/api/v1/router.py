from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, dashboard, repositories, scanner, ai_agents, code_review, security_agent, architecture, reports, chat

api_v1_router = APIRouter()

# Include endpoint routers
api_v1_router.include_router(health.router, tags=["Health Check"])
api_v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Security"])
api_v1_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard Analytics"])
api_v1_router.include_router(repositories.router, prefix="/repositories", tags=["Repository Management"])
api_v1_router.include_router(scanner.router, tags=["Repository Tech Scanner Engine"])
api_v1_router.include_router(ai_agents.router, prefix="/ai/agents", tags=["LangGraph Multi-Agent Orchestrator"])
api_v1_router.include_router(code_review.router, tags=["AI Code Review Engine"])
api_v1_router.include_router(security_agent.router, tags=["Security Agent Engine"])
api_v1_router.include_router(architecture.router, tags=["Architecture Analyzer & Visualizer Engine"])
api_v1_router.include_router(reports.router, tags=["Report Export Engine"])
api_v1_router.include_router(chat.router, tags=["Repository Chat & RAG Engine"])
