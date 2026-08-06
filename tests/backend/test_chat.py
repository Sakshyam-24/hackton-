"""Tests for the chat API endpoint."""

import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))


@pytest.fixture
def mock_chat_service():
    """Mock ChatService for testing."""
    with patch("app.api.chat.get_chat_service") as mock:
        service = MagicMock()
        service.process_message = AsyncMock()
        service.get_conversation_list.return_value = []
        service.clear_conversation.return_value = True
        mock.return_value = service
        yield service


@pytest.fixture
def client(mock_chat_service):
    """Create a test client with mocked dependencies."""
    from fastapi import FastAPI
    from app.api.chat import router

    app = FastAPI()
    app.include_router(router, prefix="/api")
    return TestClient(app)


class TestChatEndpoint:
    """Tests for POST /api/chat."""

    def test_chat_returns_response(self, client, mock_chat_service):
        """Chat endpoint returns a response string."""
        from app.models.response import ChatResponse
        from datetime import datetime

        mock_chat_service.process_message.return_value = ChatResponse(
            response="Based on contract law principles...",
            conversation_id="conv-123",
            citations=[],
            disclaimer="This is not legal advice.",
            sources=[],
        )

        response = client.post(
            "/api/chat",
            json={"message": "What is contract law?"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert isinstance(data["response"], str)
        assert len(data["response"]) > 0

    def test_chat_returns_conversation_id(self, client, mock_chat_service):
        """Chat endpoint returns a conversation ID."""
        from app.models.response import ChatResponse

        mock_chat_service.process_message.return_value = ChatResponse(
            response="Response",
            conversation_id="conv-abc-123",
            citations=[],
            disclaimer="Disclaimer",
            sources=[],
        )

        response = client.post(
            "/api/chat",
            json={"message": "Hello"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "conversation_id" in data
        assert data["conversation_id"] == "conv-abc-123"

    def test_chat_returns_disclaimer(self, client, mock_chat_service):
        """Chat endpoint includes legal disclaimer."""
        from app.models.response import ChatResponse

        mock_chat_service.process_message.return_value = ChatResponse(
            response="Response",
            conversation_id="conv-123",
            citations=[],
            disclaimer="This is not legal advice. Consult an attorney.",
            sources=[],
        )

        response = client.post(
            "/api/chat",
            json={"message": "Can I break my lease?"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "disclaimer" in data
        assert "consult" in data["disclaimer"].lower()

    def test_chat_returns_sources_list(self, client, mock_chat_service):
        """Chat endpoint returns a sources list."""
        from app.models.response import ChatResponse

        mock_chat_service.process_message.return_value = ChatResponse(
            response="Response",
            conversation_id="conv-123",
            citations=[],
            disclaimer="Disclaimer",
            sources=[{"document_id": "doc-1", "title": "Contract Guide"}],
        )

        response = client.post(
            "/api/chat",
            json={"message": "What are my rights?"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "sources" in data
        assert isinstance(data["sources"], list)

    def test_chat_with_conversation_id(self, client, mock_chat_service):
        """Chat endpoint accepts an existing conversation ID."""
        from app.models.response import ChatResponse

        mock_chat_service.process_message.return_value = ChatResponse(
            response="Response",
            conversation_id="existing-conv-123",
            citations=[],
            disclaimer="Disclaimer",
            sources=[],
        )

        response = client.post(
            "/api/chat",
            json={
                "message": "Follow up question",
                "conversation_id": "existing-conv-123",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["conversation_id"] == "existing-conv-123"

    def test_chat_with_rag_disabled(self, client, mock_chat_service):
        """Chat endpoint works with RAG disabled."""
        from app.models.response import ChatResponse

        mock_chat_service.process_message.return_value = ChatResponse(
            response="Direct response",
            conversation_id="conv-123",
            citations=[],
            disclaimer="Disclaimer",
            sources=[],
        )

        response = client.post(
            "/api/chat",
            json={
                "message": "Simple question",
                "use_rag": False,
            },
        )
        assert response.status_code == 200

    def test_chat_with_legal_category(self, client, mock_chat_service):
        """Chat endpoint accepts a legal category hint."""
        from app.models.response import ChatResponse

        mock_chat_service.process_message.return_value = ChatResponse(
            response="IP response",
            conversation_id="conv-123",
            citations=[],
            disclaimer="Disclaimer",
            sources=[],
            legal_category="intellectual_property",
        )

        response = client.post(
            "/api/chat",
            json={
                "message": "What about IP infringement?",
                "legal_category": "intellectual_property",
            },
        )
        assert response.status_code == 200

    def test_chat_empty_message_returns_error(self, client, mock_chat_service):
        """Chat endpoint rejects empty messages."""
        response = client.post(
            "/api/chat",
            json={"message": ""},
        )
        assert response.status_code == 422

    def test_chat_missing_message_returns_error(self, client, mock_chat_service):
        """Chat endpoint rejects requests without message."""
        response = client.post(
            "/api/chat",
            json={},
        )
        assert response.status_code == 422

    def test_chat_long_message_accepted(self, client, mock_chat_service):
        """Chat endpoint accepts messages up to 10000 chars."""
        from app.models.response import ChatResponse

        mock_chat_service.process_message.return_value = ChatResponse(
            response="Response",
            conversation_id="conv-123",
            citations=[],
            disclaimer="Disclaimer",
            sources=[],
        )

        long_message = "a" * 10000
        response = client.post(
            "/api/chat",
            json={"message": long_message},
        )
        assert response.status_code == 200


class TestChatHistory:
    """Tests for GET /api/chat (list conversations)."""

    def test_get_history_returns_list(self, client):
        """History endpoint returns a conversations list."""
        response = client.get("/api/chat")
        assert response.status_code == 200
        data = response.json()
        assert "conversations" in data
        assert isinstance(data["conversations"], list)


class TestDeleteSession:
    """Tests for DELETE /api/chat/{session_id}."""

    def test_delete_session_returns_status(self, client):
        """Delete endpoint returns 204 No Content."""
        response = client.delete("/api/chat/test-session-123")
        assert response.status_code == 204
