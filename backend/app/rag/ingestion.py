"""Document ingestion pipeline for RAG."""

import uuid
from pathlib import Path
from typing import Optional

import docx
import PyPDF2

from app.core.config import get_settings
from app.core.logger import logger
from app.llm.embeddings import get_embedding_generator
from app.rag.chunker import get_chunker
from app.rag.vector_store import get_vector_store


class DocumentIngestion:
    """Ingest documents into the RAG pipeline."""

    def __init__(self):
        self.settings = get_settings()
        self.embedding_generator = get_embedding_generator()
        self.vector_store = get_vector_store()
        self.chunker = get_chunker(
            chunk_size=self.settings.CHUNK_SIZE,
            chunk_overlap=self.settings.CHUNK_OVERLAP,
        )

    async def ingest_file(
        self,
        file_path: str,
        title: Optional[str] = None,
        legal_category: Optional[str] = None,
        tags: Optional[list[str]] = None,
    ) -> dict:
        """Ingest a file into the vector store."""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        document_id = str(uuid.uuid4())
        content = self._extract_content(path)

        if not content.strip():
            return {
                "document_id": document_id,
                "filename": path.name,
                "chunks_created": 0,
                "status": "error",
                "message": "No content could be extracted from the file",
            }

        doc_title = title or path.stem

        chunks = self.chunker.chunk_text(
            content,
            document_id=document_id,
            document_title=doc_title,
        )

        if not chunks:
            return {
                "document_id": document_id,
                "filename": path.name,
                "chunks_created": 0,
                "status": "error",
                "message": "No chunks were created from the document",
            }

        chunk_texts = [chunk.content for chunk in chunks]
        embeddings = await self.embedding_generator.generate_embeddings(chunk_texts)

        chunk_ids = [chunk.chunk_id for chunk in chunks]
        metadata = [
            {
                "content": chunk.content,
                "document_id": document_id,
                "document_title": doc_title,
                "document_type": path.suffix.lstrip("."),
                "legal_category": legal_category or "",
                "tags": tags or [],
                "chunk_index": chunk.chunk_index,
            }
            for chunk in chunks
        ]

        self.vector_store.add_vectors(embeddings, chunk_ids, metadata)
        self.vector_store.save()

        logger.info(f"Ingested {path.name}: {len(chunks)} chunks created")

        return {
            "document_id": document_id,
            "filename": path.name,
            "chunks_created": len(chunks),
            "status": "success",
            "message": f"Successfully ingested {path.name} with {len(chunks)} chunks",
        }

    async def ingest_text(
        self,
        text: str,
        title: str = "Untitled",
        legal_category: Optional[str] = None,
        tags: Optional[list[str]] = None,
    ) -> dict:
        """Ingest raw text into the vector store."""
        document_id = str(uuid.uuid4())

        chunks = self.chunker.chunk_text(
            text,
            document_id=document_id,
            document_title=title,
        )

        if not chunks:
            return {
                "document_id": document_id,
                "filename": title,
                "chunks_created": 0,
                "status": "error",
                "message": "No chunks were created from the text",
            }

        chunk_texts = [chunk.content for chunk in chunks]
        embeddings = await self.embedding_generator.generate_embeddings(chunk_texts)

        chunk_ids = [chunk.chunk_id for chunk in chunks]
        metadata = [
            {
                "content": chunk.content,
                "document_id": document_id,
                "document_title": title,
                "document_type": "text",
                "legal_category": legal_category or "",
                "tags": tags or [],
                "chunk_index": chunk.chunk_index,
            }
            for chunk in chunks
        ]

        self.vector_store.add_vectors(embeddings, chunk_ids, metadata)
        self.vector_store.save()

        return {
            "document_id": document_id,
            "filename": title,
            "chunks_created": len(chunks),
            "status": "success",
            "message": f"Successfully ingested text with {len(chunks)} chunks",
        }

    def _extract_content(self, path: Path) -> str:
        """Extract text content from a file."""
        suffix = path.suffix.lower()

        if suffix == ".txt" or suffix == ".md":
            return path.read_text(encoding="utf-8")
        elif suffix == ".pdf":
            return self._extract_pdf(path)
        elif suffix == ".docx":
            return self._extract_docx(path)
        else:
            raise ValueError(f"Unsupported file type: {suffix}")

    def _extract_pdf(self, path: Path) -> str:
        """Extract text from a PDF file."""
        text_parts = []
        try:
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
        return "\n\n".join(text_parts)

    def _extract_docx(self, path: Path) -> str:
        """Extract text from a DOCX file."""
        try:
            doc = docx.Document(str(path))
            return "\n\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        except Exception as e:
            logger.error(f"DOCX extraction failed: {e}")
            return ""


_ingestion: Optional[DocumentIngestion] = None


def get_ingestion() -> DocumentIngestion:
    """Get or create the document ingestion singleton."""
    global _ingestion
    if _ingestion is None:
        _ingestion = DocumentIngestion()
    return _ingestion
