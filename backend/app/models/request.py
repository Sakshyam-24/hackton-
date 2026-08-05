"""Request models for API endpoints."""

from typing import Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Chat message request."""
    message: str = Field(..., min_length=1, max_length=10000, description="User message")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for context")
    legal_category: Optional[str] = Field(None, description="Legal category hint")
    use_rag: bool = Field(True, description="Whether to use RAG for retrieval")
    language: Optional[str] = Field("en", description="Response language ('en' or 'ne')")


class SearchRequest(BaseModel):
    """Document search request."""
    query: str = Field(..., min_length=1, max_length=1000, description="Search query")
    top_k: int = Field(5, ge=1, le=20, description="Number of results")
    legal_category: Optional[str] = Field(None, description="Filter by legal category")


class DocumentUploadRequest(BaseModel):
    """Metadata for document upload."""
    title: Optional[str] = Field(None, description="Document title")
    legal_category: Optional[str] = Field(None, description="Legal category")
    tags: list[str] = Field(default_factory=list, description="Document tags")
