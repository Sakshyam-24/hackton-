"""LLM provider abstraction."""

from abc import ABC, abstractmethod
from typing import Optional

from app.core.config import get_settings
from app.core.logger import logger


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def generate(self, messages: list[dict], system_prompt: str = "") -> str:
        """Generate a response given messages and optional system prompt."""
        ...


class OpenAIProvider(LLMProvider):
    """OpenAI LLM provider (also works with OpenRouter)."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None, base_url: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model = model or settings.OPENAI_MODEL
        self.base_url = base_url or settings.OPENAI_BASE_URL

    async def generate(self, messages: list[dict], system_prompt: str = "") -> str:
        if not self.api_key:
            return self._fallback_response(messages)

        try:
            import openai
            kwargs = {"api_key": self.api_key}
            if self.base_url:
                kwargs["base_url"] = self.base_url
            client = openai.AsyncOpenAI(**kwargs)

            full_messages = []
            if system_prompt:
                full_messages.append({"role": "system", "content": system_prompt})
            full_messages.extend(messages)

            response = await client.chat.completions.create(
                model=self.model,
                messages=full_messages,
                temperature=0.7,
                max_tokens=2000,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return self._fallback_response(messages)

    def _fallback_response(self, messages: list[dict]) -> str:
        last_msg = messages[-1]["content"] if messages else ""
        return (
            f"I understand your question about: \"{last_msg[:100]}\"\n\n"
            "I'm currently running in demo mode without an AI language model connected. "
            "To get full AI-powered legal responses, please configure an OPENAI_API_KEY "
            "in your .env file.\n\n"
            "*This is a demo response. For actual legal advice, please consult a qualified attorney.*"
        )


class AnthropicProvider(LLMProvider):
    """Anthropic LLM provider."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        self.model = model or settings.ANTHROPIC_MODEL

    async def generate(self, messages: list[dict], system_prompt: str = "") -> str:
        if not self.api_key:
            return self._fallback_response(messages)

        try:
            import anthropic
            client = anthropic.AsyncAnthropic(api_key=self.api_key)

            full_prompt = system_prompt + "\n\n" if system_prompt else ""
            full_prompt += "\n".join(
                f"{m['role']}: {m['content']}" for m in messages
            )

            response = await client.messages.create(
                model=self.model,
                max_tokens=2000,
                messages=[{"role": "user", "content": full_prompt}],
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            return self._fallback_response(messages)

    def _fallback_response(self, messages: list[dict]) -> str:
        last_msg = messages[-1]["content"] if messages else ""
        return (
            f"I understand your question about: \"{last_msg[:100]}\"\n\n"
            "I'm currently running in demo mode without an AI language model connected. "
            "To get full AI-powered legal responses, please configure an ANTHROPIC_API_KEY "
            "in your .env file.\n\n"
            "*This is a demo response. For actual legal advice, please consult a qualified attorney.*"
        )


class GeminiProvider(LLMProvider):
    """Google Gemini LLM provider using google.genai package."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self._client = None

    def _get_client(self):
        if self._client is None and self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to init Gemini client: {e}")
        return self._client

    async def generate(self, messages: list[dict], system_prompt: str = "") -> str:
        if not self.api_key:
            return self._fallback_response(messages)

        client = self._get_client()
        if not client:
            return self._fallback_response(messages)

        try:
            from google.genai import types

            contents = []
            for msg in messages:
                role = "user" if msg["role"] in ("user", "system") else "model"
                contents.append({"role": role, "parts": [msg["content"]]})

            config = types.GenerateContentConfig(
                system_instruction=system_prompt if system_prompt else None,
                temperature=0.7,
                max_output_tokens=2000,
            )

            response = client.models.generate_content(
                model=self.model,
                contents=contents,
                config=config,
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return self._fallback_response(messages)

    def _fallback_response(self, messages: list[dict]) -> str:
        last_msg = messages[-1]["content"] if messages else ""
        return (
            f"I understand your question about: \"{last_msg[:100]}\"\n\n"
            "I'm currently running in demo mode without an AI language model connected. "
            "To get full AI-powered legal responses, please configure a GEMINI_API_KEY "
            "in your .env file.\n\n"
            "*This is a demo response. For actual legal advice, please consult a qualified attorney.*"
        )


def get_llm_provider() -> LLMProvider:
    """Factory function to get the configured LLM provider."""
    settings = get_settings()
    if settings.LLM_PROVIDER == "anthropic":
        return AnthropicProvider()
    if settings.LLM_PROVIDER == "gemini":
        return GeminiProvider()
    # "openai" or "openrouter" both use OpenAI-compatible provider
    return OpenAIProvider()
