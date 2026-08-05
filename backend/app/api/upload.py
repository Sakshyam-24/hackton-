"""Document upload and management API endpoints."""

import os
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.core.config import get_settings
from app.core.logger import logger
from app.models.response import DocumentUploadResponse, ErrorResponse
from app.rag.ingestion import get_ingestion
from app.legal.validator import validate_file_upload

router = APIRouter(prefix="/documents", tags=["Documents"])

# In-memory document registry
_documents: dict[str, dict] = {}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document",
    description="Upload a legal document for indexing and retrieval.",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid file"},
        413: {"model": ErrorResponse, "description": "File too large"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def upload_document(
    file: UploadFile = File(..., description="Document file to upload"),
    title: Optional[str] = Form(None, description="Document title"),
    legal_category: Optional[str] = Form(None, description="Legal category"),
    tags: Optional[str] = Form(None, description="Comma-separated tags"),
):
    """Upload and ingest a legal document."""
    settings = get_settings()
    tmp_path = None

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided",
        )

    try:
        validate_file_upload(
            filename=file.filename,
            file_size=file.size or 0,
            max_size_mb=settings.MAX_UPLOAD_SIZE_MB,
            allowed_extensions=settings.ALLOWED_EXTENSIONS,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    try:
        content = await file.read()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=Path(file.filename).suffix,
        ) as tmp_file:
            tmp_file.write(content)
            tmp_path = tmp_file.name

        tag_list = [t.strip() for t in tags.split(",")] if tags else []

        ingestion = get_ingestion()
        result = await ingestion.ingest_file(
            file_path=tmp_path,
            title=title,
            legal_category=legal_category,
            tags=tag_list,
        )

        if result["status"] == "error":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["message"],
            )

        doc_id = result["document_id"]
        _documents[doc_id] = {
            "id": doc_id,
            "filename": result["filename"],
            "title": title or Path(file.filename).stem,
            "legal_category": legal_category or "",
            "tags": tag_list,
            "chunks_created": result["chunks_created"],
            "status": result["status"],
            "file_size": len(content),
            "mimeType": file.content_type or "application/octet-stream",
            "createdAt": _now(),
            "updatedAt": _now(),
        }

        return DocumentUploadResponse(
            document_id=doc_id,
            filename=result["filename"],
            chunks_created=result["chunks_created"],
            status=result["status"],
            message=result["message"],
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Document upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while uploading the document",
        )
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List uploaded documents",
    description="List all uploaded documents with pagination.",
)
async def list_documents(page: int = 1, limit: int = 20, category: Optional[str] = None):
    """List uploaded documents."""
    items = list(_documents.values())
    if category:
        items = [d for d in items if d.get("legal_category") == category]
    items.sort(key=lambda d: d.get("createdAt", ""), reverse=True)

    total = len(items)
    start = (page - 1) * limit
    end = start + limit

    return {
        "documents": items[start:end],
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit if limit else 0,
    }


@router.get(
    "/{document_id}",
    status_code=status.HTTP_200_OK,
    summary="Get document details",
)
async def get_document(document_id: str):
    """Get a document by its ID."""
    doc = _documents.get(document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return {"document": doc}


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a document",
)
async def delete_document(document_id: str):
    """Delete a document by its ID."""
    if document_id not in _documents:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    del _documents[document_id]


@router.post(
    "/{document_id}/analyze",
    status_code=status.HTTP_200_OK,
    summary="Analyze a document",
    description="Return AI analysis for an uploaded document.",
)
async def analyze_document(document_id: str):
    """Return analysis for an uploaded document."""
    doc = _documents.get(document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return {
        "summary": f"Analysis summary for {doc.get('title', 'document')}.",
        "keyPoints": [
            "Document ingested and indexed for retrieval.",
            "Content chunked for semantic search.",
        ],
        "legalReferences": [],
        "riskAssessment": "No automated risk assessment available.",
        "recommendations": ["Consult a qualified attorney for document review."],
    }
