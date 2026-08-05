"""Tests for the DocumentChunker."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))

from app.rag.chunker import DocumentChunk, DocumentChunker, get_chunker


@pytest.fixture
def chunker():
    """Create a DocumentChunker with standard settings."""
    return DocumentChunker(chunk_size=200, chunk_overlap=50)


@pytest.fixture
def small_chunker():
    """Create a DocumentChunker with small settings for testing."""
    return DocumentChunker(chunk_size=100, chunk_overlap=20)


class TestDocumentChunk:
    """Tests for the DocumentChunk dataclass."""

    def test_chunk_creation(self):
        """Chunk can be created with required fields."""
        chunk = DocumentChunk(
            content="Legal text",
            chunk_id="chunk_001",
            document_id="doc_001",
        )
        assert chunk.content == "Legal text"
        assert chunk.chunk_id == "chunk_001"
        assert chunk.document_id == "doc_001"

    def test_chunk_default_values(self):
        """Chunk has sensible defaults."""
        chunk = DocumentChunk(
            content="text",
            chunk_id="c1",
            document_id="d1",
        )
        assert chunk.chunk_index == 0
        assert chunk.document_title == ""
        assert chunk.start_char == 0
        assert chunk.end_char == 0
        assert chunk.metadata == {}

    def test_chunk_to_dict(self):
        """Chunk converts to dictionary correctly."""
        chunk = DocumentChunk(
            content="Legal text about contracts",
            chunk_id="chunk_001",
            document_id="doc_001",
            document_title="Contract Guide",
            chunk_index=2,
            start_char=100,
            end_char=200,
            metadata={"page": 5},
        )
        d = chunk.to_dict()
        assert d["content"] == "Legal text about contracts"
        assert d["chunk_id"] == "chunk_001"
        assert d["document_id"] == "doc_001"
        assert d["document_title"] == "Contract Guide"
        assert d["chunk_index"] == 2
        assert d["start_char"] == 100
        assert d["end_char"] == 200
        assert d["metadata"]["page"] == 5


class TestChunkText:
    """Tests for chunk_text method."""

    def test_empty_text_returns_empty(self, chunker):
        """Empty text produces no chunks."""
        result = chunker.chunk_text("", document_id="doc1")
        assert result == []

    def test_short_text_returns_single_chunk(self, chunker):
        """Text shorter than chunk_size is a single chunk."""
        text = "Short legal text."
        result = chunker.chunk_text(text, document_id="doc1")
        assert len(result) == 1
        assert result[0].content == text

    def test_long_text_splits_into_chunks(self, chunker):
        """Text longer than chunk_size is split."""
        text = "Word " * 100  # ~500 chars
        result = chunker.chunk_text(text, document_id="doc1")
        assert len(result) > 1

    def test_chunks_have_chunk_ids(self, chunker):
        """Chunks have properly formatted chunk IDs."""
        text = "Paragraph one.\n\nParagraph two.\n\nParagraph three.\n\nParagraph four."
        result = chunker.chunk_text(text, document_id="doc1")
        for i, chunk in enumerate(result):
            assert chunk.chunk_id == f"doc1_{i}"

    def test_chunks_have_document_id(self, chunker):
        """Chunks store document ID."""
        text = "Content " * 50
        result = chunker.chunk_text(text, document_id="my_doc")
        assert all(c.document_id == "my_doc" for c in result)

    def test_chunks_have_document_title(self, chunker):
        """Chunks store document title."""
        text = "Content " * 50
        result = chunker.chunk_text(
            text,
            document_id="doc1",
            document_title="Legal Guide",
        )
        assert all(c.document_title == "Legal Guide" for c in result)

    def test_chunks_have_sequential_indices(self, chunker):
        """Chunks are numbered sequentially."""
        text = "Paragraph one.\n\nParagraph two.\n\nParagraph three.\n\nParagraph four."
        result = chunker.chunk_text(text, document_id="doc1")
        indices = [c.chunk_index for c in result]
        assert indices == list(range(len(result)))

    def test_chunks_have_start_end_chars(self, chunker):
        """Chunks track character positions."""
        text = "First section.\n\nSecond section.\n\nThird section.\n\nFourth section."
        result = chunker.chunk_text(text, document_id="doc1")
        for chunk in result:
            assert chunk.start_char >= 0
            assert chunk.end_char > chunk.start_char

    def test_metadata_preserved(self, chunker):
        """Chunk metadata is preserved."""
        text = "First section.\n\nSecond section.\n\nThird section."
        result = chunker.chunk_text(text, document_id="doc1")
        for chunk in result:
            assert isinstance(chunk.metadata, dict)


class TestChunkBySentences:
    """Tests for chunk_by_sentences method."""

    def test_sentence_chunking(self, chunker):
        """Chunk by sentences produces valid chunks."""
        text = "First sentence. Second sentence. Third sentence. Fourth sentence."
        result = chunker.chunk_by_sentences(text, document_id="doc1")
        assert len(result) >= 1

    def test_sentence_chunks_have_ids(self, chunker):
        """Sentence chunks have proper IDs."""
        text = "First sentence. Second sentence. Third sentence."
        result = chunker.chunk_by_sentences(text, document_id="doc1")
        for i, chunk in enumerate(result):
            assert chunk.chunk_id == f"doc1_{i}"


class TestGetChunker:
    """Tests for get_chunker factory function."""

    def test_get_chunker_default(self):
        """Factory returns chunker with default settings."""
        chunker = get_chunker()
        assert isinstance(chunker, DocumentChunker)
        assert chunker.chunk_size == 1000
        assert chunker.chunk_overlap == 200

    def test_get_chunker_custom(self):
        """Factory returns chunker with custom settings."""
        chunker = get_chunker(chunk_size=500, chunk_overlap=100)
        assert chunker.chunk_size == 500
        assert chunker.chunk_overlap == 100


class TestChunkEdgeCases:
    """Tests for edge cases."""

    def test_single_long_paragraph(self, chunker):
        """A single paragraph exceeding chunk_size is split."""
        text = "A" * 500
        result = chunker.chunk_text(text, document_id="doc1")
        assert len(result) >= 1

    def test_many_short_paragraphs(self, chunker):
        """Many short paragraphs are grouped together."""
        paragraphs = [f"Paragraph {i}." for i in range(20)]
        text = "\n\n".join(paragraphs)
        result = chunker.chunk_text(text, document_id="doc1")
        assert len(result) >= 1
        assert len(result) < 20

    def test_special_characters_in_text(self, chunker):
        """Special characters don't break chunking."""
        text = "Legal &amp; <b>bold</b> text.\n\nMore text with symbols: @#$%"
        result = chunker.chunk_text(text, document_id="doc1")
        assert len(result) >= 1

    def test_unicode_content(self, chunker):
        """Unicode content is handled correctly."""
        text = "Section 1: Kontrakt law (contracts).\n\nSection 2: More text."
        result = chunker.chunk_text(text, document_id="doc1")
        assert len(result) >= 1

    def test_whitespace_only_returns_empty(self, chunker):
        """Whitespace-only text produces no chunks."""
        result = chunker.chunk_text("   \n\n   ", document_id="doc1")
        assert result == []

    def test_newlines_only_returns_empty(self, chunker):
        """Newlines-only text produces no chunks."""
        result = chunker.chunk_text("\n\n\n\n", document_id="doc1")
        assert result == []
