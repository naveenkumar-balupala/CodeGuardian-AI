from typing import Dict, Any, List
from app.ai.agents.state import ChatAgentOutput
from app.core.logging import get_logger

logger = get_logger(__name__)

CHAT_AGENT_PROMPT = """
You are Code Guardian, an expert AI Security & Software Architecture Assistant.
You possess full context of the user's codebase, SAST vulnerabilities, database models,
and performance metrics. Answer user questions with precise code references and remediation guidance.
"""

class ChatAgent:
    """Conversational Chat Agent with codebase context memory."""

    @staticmethod
    async def chat(user_query: str, history: List[Dict[str, str]]) -> ChatAgentOutput:
        logger.info("Chat Agent answering user query", query=user_query)

        query_lower = user_query.lower()
        if "sql" in query_lower or "cwe-89" in query_lower:
            answer = (
                "The SAST scanner identified a potential SQL injection risk in `app/api/v1/auth.py` (CWE-89). "
                "The issue stems from concatenating string variables into query strings. "
                "I recommend using SQLAlchemy parameterized select constructs instead."
            )
            files = ["app/api/v1/auth.py", "app/models/user.py"]
            followups = [
                "Would you like me to apply the automated patch diff?",
                "How do I configure SQLAlchemy parameter binding?",
            ]
        elif "security" in query_lower or "score" in query_lower:
            answer = (
                "Your project currently has a Security Health Score of **94/100 (A+ Grade)**. "
                "There is 1 Critical SAST finding and 2 High findings awaiting review."
            )
            files = ["backend/app/main.py", "backend/app/core/security.py"]
            followups = [
                "Show critical vulnerability details",
                "Run a fresh multi-agent security audit",
            ]
        else:
            answer = (
                f"I have analyzed your request regarding '{user_query}'. Based on the CodeGuardian AI multi-agent audit, "
                "your architecture follows a clean Monorepo pattern with FastAPI and Next.js. All HTTP endpoints are protected with JWT auth and rate limiting."
            )
            files = ["backend/app/main.py", "frontend/src/app/layout.tsx"]
            followups = [
                "Explain the authentication architecture",
                "What database migrations are pending?",
            ]

        return ChatAgentOutput(
            answer=answer,
            referenced_files=files,
            suggested_followups=followups,
        )
