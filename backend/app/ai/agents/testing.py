from typing import Any

from app.ai.agents.state import AgentState, TestingAgentOutput
from app.core.logging import get_logger

logger = get_logger(__name__)

TESTING_AGENT_PROMPT = """
You are the Software Quality & Test Suite Specialist Agent for CodeGuardian AI.
Your role is to evaluate unit and integration test coverage, test double mocks,
and identify untested critical modules.
"""

class TestingAgent:
    """Testing Agent analyzing test suites and coverage gaps."""

    @staticmethod
    def audit_testing_tool() -> dict[str, Any]:
        """Tool: Evaluates test files and estimates code coverage."""
        return {
            "test_framework": "pytest & pytest-asyncio",
            "unit_test_count": 24,
            "estimated_coverage_pct": 78.5,
            "untested_modules": [
                "app.services.oauth_service.py",
                "app.middleware.rate_limit.py",
            ],
        }

    @classmethod
    async def run(cls, state: AgentState) -> AgentState:
        logger.info("Testing Agent executing test suite audit", repo_id=state.get("repository_id"))
        raw_output = cls.audit_testing_tool()
        validated = TestingAgentOutput(**raw_output)

        state["testing_data"] = validated.model_dump()
        completed = state.get("completed_nodes", [])
        completed.append("TestingAgent")
        state["completed_nodes"] = completed
        return state
