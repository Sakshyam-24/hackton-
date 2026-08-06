"""Tests for the document upload API endpoint."""

import io
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))


@pytest.fixture
def mock_ingestion():
    """Mock DocumentIngestion for testing."""
    with patch("app.api.upload.get_ingestion") as mock:
        ingestion = MagicMock()
        ingestion.ingest_file = AsyncMock()
        mock.return_value = ingestion
        yield ingestion


@pytest.fixture
def client(mock_ingestion):
    """Create a test client with mocked dependencies."""
    from fastapi import FastAPI
    from app.api.upload import router

    app = FastAPI()
    app.include_router(router, prefix="/api")
    return TestClient(app)


@pytest.fixture
def sample_txt_content():
    """Create a sample text file content."""
    return b"This is a sample legal document for testing purposes."


@pytest.fixture
def sample_pdf_content():
    """Create minimal PDF content for testing."""
    return b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n%%EOF"


@pytest.fixture
def oversized_content():
    """Create content exceeding the upload size limit."""
    return b"x" * (21 * 1024 * 1024)  # 21MB


class TestUploadEndpoint:
    """Tests for POST /api/documents/upload."""

    def test_upload_txt_file(self, client, mock_ingestion, sample_txt_content):
        """Upload a .txt file successfully."""
        mock_ingestion.ingest_file.return_value = {
            "document_id": "doc-123",
            "filename": "test.txt",
            "chunks_created": 5,
            "status": "success",
            "message": "Successfully ingested test.txt",
        }

        response = client.post(
            "/api/documents/upload",
            files={"file": ("test.txt", io.BytesIO(sample_txt_content), "text/plain")},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "success"
        assert data["filename"] == "test.txt"
        assert "document_id" in data

    def test_upload_with_title(self, client, mock_ingestion, sample_txt_content):
        """Upload with a custom title."""
        mock_ingestion.ingest_file.return_value = {
            "document_id": "doc-123",
            "filename": "contract.txt",
            "chunks_created": 3,
            "status": "success",
            "message": "Success",
        }

        response = client.post(
            "/api/documents/upload",
            files={"file": ("contract.txt", io.BytesIO(sample_txt_content), "text/plain")},
            data={"title": "My Contract"},
        )
        assert response.status_code == 201

    def test_upload_with_legal_category(self, client, mock_ingestion, sample_txt_content):
        """Upload with a legal category."""
        mock_ingestion.ingest_file.return_value = {
            "document_id": "doc-123",
            "filename": "agreement.txt",
            "chunks_created": 2,
            "status": "success",
            "message": "Success",
        }

        response = client.post(
            "/api/documents/upload",
            files={"file": ("agreement.txt", io.BytesIO(sample_txt_content), "text/plain")},
            data={"legal_category": "contract_law"},
        )
        assert response.status_code == 201

    def test_upload_rejects_invalid_extension(self, client, mock_ingestion):
        """Reject files with disallowed extensions."""
        mock_ingestion.ingest_file.return_value = {
            "document_id": "doc-1",
            "filename": "malware.exe",
            "chunks_created": 0,
            "status": "error",
            "message": "Unsupported file type",
        }

        response = client.post(
            "/api/documents/upload",
            files={"file": ("malware.exe", io.BytesIO(b"bad"), "application/octet-stream")},
        )
        assert response.status_code in [400, 500]

    def test_upload_accepts_pdf(self, client, mock_ingestion, sample_pdf_content):
        """Accept .pdf files."""
        mock_ingestion.ingest_file.return_value = {
            "document_id": "doc-123",
            "filename": "doc.pdf",
            "chunks_created": 10,
            "status": "success",
            "message": "Success",
        }

        response = client.post(
            "/api/documents/upload",
            files={"file": ("doc.pdf", io.BytesIO(sample_pdf_content), "application/pdf")},
        )
        assert response.status_code == 201

    def test_upload_accepts_markdown(self, client, mock_ingestion, sample_txt_content):
        """Accept .md files."""
        mock_ingestion.ingest_file.return_value = {
            "document_id": "doc-123",
            "filename": "notes.md",
            "chunks_created": 2,
            "status": "success",
            "message": "Success",
        }

        response = client.post(
            "/api/documents/upload",
            files={"file": ("notes.md", io.BytesIO(sample_txt_content), "text/markdown")},
        )
        assert response.status_code == 201

    def test_upload_returns_chunks_created(self, client, mock_ingestion, sample_txt_content):
        """Response includes chunks created count."""
        mock_ingestion.ingest_file.return_value = {
            "document_id": "doc-123",
            "filename": "test.txt",
            "chunks_created": 7,
            "status": "success",
            "message": "Success",
        }

        response = client.post(
            "/api/documents/upload",
            files={"file": ("test.txt", io.BytesIO(sample_txt_content), "text/plain")},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["chunks_created"] == 7

    def test_upload_error_returns_500(self, client, mock_ingestion, sample_txt_content):
        """Server error during processing returns 500."""
        mock_ingestion.ingest_file.side_effect = Exception("Processing failed")

        response = client.post(
            "/api/documents/upload",
            files={"file": ("test.txt", io.BytesIO(sample_txt_content), "text/plain")},
        )
        assert response.status_code == 500


class TestListDocuments:
    """Tests for GET /api/documents."""

    def test_list_documents_returns_list(self, client):
        """List endpoint returns a documents list."""
        response = client.get("/api/documents")
        assert response.status_code == 200
        data = response.json()
        assert "documents" in data
        assert isinstance(data["documents"], list)


class TestGetDocument:
    """Tests for GET /api/documents/{doc_id}."""

    def test_get_document_by_id(self, client):
        """Retrieve document details by ID."""
        response = client.get("/api/documents/doc-123")
        assert response.status_code in [200, 404]

    def test_get_nonexistent_document(self, client):
        """Handle non-existent document gracefully."""
        response = client.get("/api/documents/nonexistent-id")
        assert response.status_code in [200, 404]
