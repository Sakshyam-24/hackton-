"""Response models for API endpoints."""

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class ChatResponse(BaseModel):
    """Chat message response."""
    response: str = Field(..., description="AI response text")
    conversation_id: str = Field(..., description="Conversation ID")
    citations: list[dict[str, Any]] = Field(default_factory=list, description="Legal citations")
    disclaimer: str = Field(..., description="Legal disclaimer")
    legal_category: Optional[str] = Field(None, description="Detected legal category")
    sources: list[dict[str, Any]] = Field(default_factory=list, description="Source documents")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SearchResponse(BaseModel):
    """Document search response."""
    results: list[dict[str, Any]] = Field(..., description="Search results")
    total: int = Field(..., description="Total number of results")
    query: str = Field(..., description="Original query")


class DocumentUploadResponse(BaseModel):
    """Document upload response."""
    document_id: str = Field(..., description="Document ID")
    filename: str = Field(..., description="Original filename")
    chunks_created: int = Field(..., description="Number of chunks created")
    status: str = Field(..., description="Upload status")
    message: str = Field(..., description="Status message")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: dict[str, str] = Field(default_factory=dict, description="Service statuses")


class ErrorResponse(BaseModel):
    """Error response."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Error detail")
    code: str = Field(..., description="Error code")
