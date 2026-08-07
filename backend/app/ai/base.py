from abc import ABC, abstractmethod
from typing import Any


class BaseLLMProvider(ABC):
    """Abstract interface contract for AI LLM provider adapters."""

    @abstractmethod
    async def generate_response(
        self,
        prompt: str,
        system_instruction: str | None = None,
        model: str | None = None,
        temperature: float | None = None,
        **kwargs: Any
    ) -> str:
        """Generate text completion from LLM."""
        pass

    @abstractmethod
    async def generate_structured_output(
        self,
        prompt: str,
        response_schema: dict[str, Any],
        system_instruction: str | None = None,
        **kwargs: Any
    ) -> dict[str, Any]:
        """Generate structured JSON output validated against JSON schema."""
        pass
