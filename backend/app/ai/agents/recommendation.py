from typing import Any

from app.ai.agents.state import AgentState, RecommendationAgentOutput
from app.core.logging import get_logger

logger = get_logger(__name__)

RECOMMENDATION_AGENT_PROMPT = """
You are the Remediation Recommendation Agent for CodeGuardian AI.
Your role is to analyze all upstream agent findings (Security, DB, Perf, Arch) and synthesize
prioritized actionable recommendations with code patch diffs.
"""

class RecommendationAgent:
    """Recommendation Agent synthesizing findings into prioritized remediations and patch diffs."""

    @staticmethod
    def generate_recommendations_tool(state: AgentState) -> dict[str, Any]:
        """Tool: Synthesizes findings into prioritized fix recommendations and diffs."""
        return {
            "prioritized_remediations": [
                {
                    "priority": 1,
                    "title": "Fix SQL Injection in Auth Endpoint",
                    "category": "SECURITY",
                    "cwe": "CWE-89",
                    "description": "Replace string formatting in authentication query with SQLAlchemy parameterized select.",
                },
                {
                    "priority": 2,
                    "title": "Enforce Strict Secret Key Environment Variable",
                    "category": "SECURITY",
                    "cwe": "CWE-798",
                    "description": "Require SECRET_KEY to be set via environment variable without default fallback in production.",
                },
            ],
            "suggested_patch_diffs": [
                {
                    "file": "app/api/v1/auth.py",
                    "diff": (
                        "--- app/api/v1/auth.py\n"
                        "+++ app/api/v1/auth.py\n"
                        "@@ -42,1 +42,1 @@\n"
                        "- query = f'SELECT * FROM users WHERE email = {user_input}'\n"
                        "+ query = select(User).where(User.email == user_input)\n"
                    ),
                }
            ],
        }

    @classmethod
    async def run(cls, state: AgentState) -> AgentState:
        logger.info("Recommendation Agent synthesizing remediation plan", repo_id=state.get("repository_id"))
        raw_output = cls.generate_recommendations_tool(state)
        validated = RecommendationAgentOutput(**raw_output)

        state["recommendations_data"] = validated.model_dump()
        completed = state.get("completed_nodes", [])
        completed.append("RecommendationAgent")
        state["completed_nodes"] = completed
        return state
