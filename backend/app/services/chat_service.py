"""Chat service for managing conversations and AI responses."""

import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from app.core.config import get_settings
from app.core.logger import logger
from app.llm.provider import get_llm_provider
from app.llm.prompts import LEGAL_SYSTEM_PROMPT, RAG_SYSTEM_PROMPT
from app.legal.citation import extract_citations_from_text
from app.legal.categories import classify_legal_query
from app.legal.disclaimer import format_disclaimer_for_response
from app.models.request import ChatRequest
from app.models.response import ChatResponse


class ChatService:
    """Service for handling chat interactions."""

    def __init__(self):
        self.settings = get_settings()
        self.llm_provider = get_llm_provider()
        self.conversations: dict[str, list[dict[str, str]]] = {}

    async def process_message(self, request: ChatRequest) -> ChatResponse:
        """Process a chat message and return a response."""
        conversation_id = request.conversation_id or str(uuid.uuid4())

        category = classify_legal_query(request.message)

        messages = self._get_conversation_history(conversation_id)
        messages.append({"role": "user", "content": request.message})

        # Try RAG first, fallback to direct
        sources = []
        context = ""
        if request.use_rag:
            try:
                from app.services.retrieval_service import get_retrieval_service
                retrieval_service = get_retrieval_service()
                retrieval_result = await retrieval_service.retrieve_with_context(request.message)
                context = retrieval_result.get("context", "")
                sources = retrieval_result.get("sources", [])
            except Exception as e:
                logger.warning(f"RAG retrieval failed, falling back to direct: {e}")

        if context:
            system_prompt = f"{RAG_SYSTEM_PROMPT}\n\nRelevant Context:\n{context}"
        else:
            system_prompt = LEGAL_SYSTEM_PROMPT

        from app.llm.prompts import build_language_instruction
        system_prompt += build_language_instruction(request.language)

        response_text = await self.llm_provider.generate(
            messages=messages,
            system_prompt=system_prompt,
        )

        citations = extract_citations_from_text(response_text)

        self.conversations[conversation_id] = messages
        self.conversations[conversation_id].append({"role": "assistant", "content": response_text})

        disclaimer = format_disclaimer_for_response(category.value)

        return ChatResponse(
            response=response_text,
            conversation_id=conversation_id,
            citations=[c.to_dict() for c in citations],
            disclaimer=disclaimer,
            legal_category=category.value,
            sources=sources,
            timestamp=datetime.now(timezone.utc),
        )

    def _get_conversation_history(self, conversation_id: str) -> list[dict[str, str]]:
        """Get conversation history."""
        return self.conversations.get(conversation_id, []).copy()

    def clear_conversation(self, conversation_id: str) -> bool:
        """Clear conversation history."""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            return True
        return False

    def get_conversation_list(self) -> list[dict[str, Any]]:
        """Get list of all conversations."""
        result = []
        for conv_id, messages in self.conversations.items():
            if not messages:
                continue
            user_msgs = [m for m in messages if m["role"] == "user"]
            title = user_msgs[0]["content"][:80] if user_msgs else "New Conversation"
            result.append({
                "id": conv_id,
                "title": title,
                "messageCount": len(messages),
                "createdAt": messages[0].get("timestamp", ""),
                "updatedAt": messages[-1].get("timestamp", ""),
            })
        return result


_chat_service: Optional[ChatService] = None


def get_chat_service() -> ChatService:
    """Get or create the chat service singleton."""
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
    return _chat_service
