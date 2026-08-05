"""Chat API endpoint."""

from typing import Optional

from fastapi import APIRouter, HTTPException, Header, status

from app.core.logger import logger
from app.models.request import ChatRequest
from app.models.response import ChatResponse, ErrorResponse
from app.services.chat_service import get_chat_service
from app.api.metrics import record_request, record_category, record_language, record_error

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Send a chat message",
    description="Send a legal question and receive an AI-generated response with citations.",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def chat(request: ChatRequest):
    """Process a chat message and return AI response."""
    record_request("/api/v1/chat")
    record_category(request.legal_category)
    record_language(request.language)
    try:
        chat_service = get_chat_service()
        response = await chat_service.process_message(request)
        return response
    except ValueError as e:
        record_error()
        logger.warning(f"Chat validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        record_error()
        logger.error(f"Chat processing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your message",
        )


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List all conversations",
)
async def list_conversations():
    """List all conversations."""
    chat_service = get_chat_service()
    conversations = chat_service.get_conversation_list()
    return {"conversations": conversations, "total": len(conversations)}


@router.get(
    "/{conversation_id}",
    status_code=status.HTTP_200_OK,
    summary="Get conversation by ID",
)
async def get_conversation(conversation_id: str):
    """Get a conversation by its ID."""
    chat_service = get_chat_service()
    history = chat_service._get_conversation_history(conversation_id)
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    return {
        "id": conversation_id,
        "messages": history,
    }


@router.delete(
    "/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Clear conversation history",
)
async def clear_conversation(conversation_id: str):
    """Clear conversation history by ID."""
    chat_service = get_chat_service()
    success = chat_service.clear_conversation(conversation_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
