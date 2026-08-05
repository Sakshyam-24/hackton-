"""Document chunking for RAG pipeline."""

import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class DocumentChunk:
    """Represents a chunk of a document."""
    content: str
    chunk_id: str
    document_id: str
    document_title: str = ""
    chunk_index: int = 0
    start_char: int = 0
    end_char: int = 0
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        """Convert chunk to dictionary."""
        return {
            "content": self.content,
            "chunk_id": self.chunk_id,
            "document_id": self.document_id,
            "document_title": self.document_title,
            "chunk_index": self.chunk_index,
            "start_char": self.start_char,
            "end_char": self.end_char,
            "metadata": self.metadata,
        }


class DocumentChunker:
    """Chunk documents for indexing."""

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str, document_id: str, document_title: str = "") -> list[DocumentChunk]:
        """Chunk text into overlapping segments."""
        chunks = []

        if not text or not text.strip():
            return chunks

        if len(text) <= self.chunk_size:
            chunks.append(DocumentChunk(
                content=text.strip(),
                chunk_id=f"{document_id}_0",
                document_id=document_id,
                document_title=document_title,
                chunk_index=0,
                start_char=0,
                end_char=len(text),
            ))
            return chunks

        paragraphs = re.split(r"\n\s*\n", text)
        current_chunk = ""
        chunk_start = 0

        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue

            # Split a single paragraph that exceeds the chunk size
            while len(paragraph) > self.chunk_size:
                segment = paragraph[: self.chunk_size]
                remainder = paragraph[self.chunk_size :]
                if current_chunk:
                    chunks.append(DocumentChunk(
                        content=current_chunk.strip(),
                        chunk_id=f"{document_id}_{len(chunks)}",
                        document_id=document_id,
                        document_title=document_title,
                        chunk_index=len(chunks),
                        start_char=chunk_start,
                        end_char=chunk_start + len(current_chunk),
                    ))
                    overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else ""
                    chunk_start = chunk_start + len(current_chunk) - len(overlap_text)
                current_chunk = segment
                paragraph = remainder

            if len(current_chunk) + len(paragraph) + 2 <= self.chunk_size:
                current_chunk += ("\n\n" if current_chunk else "") + paragraph
            else:
                if current_chunk:
                    chunks.append(DocumentChunk(
                        content=current_chunk.strip(),
                        chunk_id=f"{document_id}_{len(chunks)}",
                        document_id=document_id,
                        document_title=document_title,
                        chunk_index=len(chunks),
                        start_char=chunk_start,
                        end_char=chunk_start + len(current_chunk),
                    ))
                    overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else ""
                    chunk_start = chunk_start + len(current_chunk) - len(overlap_text)
                    current_chunk = overlap_text + ("\n\n" if overlap_text else "") + paragraph
                else:
                    current_chunk = paragraph

        if current_chunk.strip():
            chunks.append(DocumentChunk(
                content=current_chunk.strip(),
                chunk_id=f"{document_id}_{len(chunks)}",
                document_id=document_id,
                document_title=document_title,
                chunk_index=len(chunks),
                start_char=chunk_start,
                end_char=chunk_start + len(current_chunk),
            ))

        return chunks

    def chunk_by_sentences(self, text: str, document_id: str, document_title: str = "") -> list[DocumentChunk]:
        """Chunk text by sentences with overlap."""
        sentence_pattern = re.compile(r"(?<=[.!?])\s+")
        sentences = sentence_pattern.split(text)

        chunks = []
        current_chunk = ""
        chunk_start = 0

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue

            if len(current_chunk) + len(sentence) + 1 <= self.chunk_size:
                current_chunk += (" " if current_chunk else "") + sentence
            else:
                if current_chunk:
                    chunks.append(DocumentChunk(
                        content=current_chunk.strip(),
                        chunk_id=f"{document_id}_{len(chunks)}",
                        document_id=document_id,
                        document_title=document_title,
                        chunk_index=len(chunks),
                        start_char=chunk_start,
                        end_char=chunk_start + len(current_chunk),
                    ))
                    words = current_chunk.split()
                    overlap_words = words[-self.chunk_size // 6:] if len(words) > self.chunk_size // 6 else []
                    overlap_text = " ".join(overlap_words)
                    chunk_start = chunk_start + len(current_chunk) - len(overlap_text)
                    current_chunk = overlap_text + (" " if overlap_text else "") + sentence
                else:
                    current_chunk = sentence

        if current_chunk.strip():
            chunks.append(DocumentChunk(
                content=current_chunk.strip(),
                chunk_id=f"{document_id}_{len(chunks)}",
                document_id=document_id,
                document_title=document_title,
                chunk_index=len(chunks),
                start_char=chunk_start,
                end_char=chunk_start + len(current_chunk),
            ))

        return chunks


def get_chunker(chunk_size: int = 1000, chunk_overlap: int = 200) -> DocumentChunker:
    """Create and return a document chunker instance."""
    return DocumentChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
