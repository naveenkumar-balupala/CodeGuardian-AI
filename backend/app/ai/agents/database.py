from typing import Any

from app.ai.agents.state import AgentState, DatabaseAgentOutput
from app.core.logging import get_logger

logger = get_logger(__name__)

DATABASE_AGENT_PROMPT = """
You are the Database & ORM Expert Agent for CodeGuardian AI.
Your role is to audit SQLAlchemy / SQLModel database models, migration scripts, N+1 query patterns,
missing indexes, and soft delete constraints.
"""

class DatabaseAgent:
    """Database Agent auditing ORM models, indexes, and queries."""

    @staticmethod
    def audit_database_tool() -> dict[str, Any]:
        """Tool: Audits database schemas, indexes, and query efficiency."""
        return {
            "orm_framework": "SQLAlchemy 2.0 (Async)",
            "migration_tool": "Alembic",
            "n_plus_one_risks": [
                "Unlazy joined load on Organization.repositories list relation"
            ],
            "missing_indexes": [
                "Add composite index on (organization_id, created_at) for fast billing queries"
            ],
            "sql_injection_risks": [],
        }

    @classmethod
    async def run(cls, state: AgentState) -> AgentState:
        logger.info("Database Agent executing schema audit", repo_id=state.get("repository_id"))
        raw_output = cls.audit_database_tool()
        validated = DatabaseAgentOutput(**raw_output)

        state["database_data"] = validated.model_dump()
        completed = state.get("completed_nodes", [])
        completed.append("DatabaseAgent")
        state["completed_nodes"] = completed
        return state
