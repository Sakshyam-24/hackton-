"""RAG retriever for document retrieval and context building."""

from typing import Any, Optional

from app.core.config import get_settings
from app.core.logger import logger
from app.llm.embeddings import get_embedding_generator
from app.rag.vector_store import get_vector_store


class RAGRetriever:
    """Retrieve relevant documents for RAG responses."""

    def __init__(self):
        self.embedding_generator = get_embedding_generator()
        self.vector_store = get_vector_store()
        self.settings = get_settings()

    async def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> list[dict[str, Any]]:
        """Retrieve relevant chunks for a query."""
        if top_k is None:
            top_k = self.settings.TOP_K_RETRIEVAL

        if self.vector_store.size == 0:
            logger.warning("Vector store is empty. No documents to retrieve.")
            return []

        try:
            query_embedding = await self.embedding_generator.generate_embedding(query)

            results = self.vector_store.search(query_embedding, top_k=top_k * 2)

            if filters:
                results = self._apply_filters(results, filters)

            results = results[:top_k]

            logger.info(f"Retrieved {len(results)} chunks for query: {query[:50]}...")
            return results

        except Exception as e:
            logger.error(f"Retrieval failed: {e}")
            return []

    def _apply_filters(self, results: list[dict], filters: dict) -> list[dict]:
        """Apply metadata filters to results."""
        filtered = []
        for result in results:
            metadata = result.get("metadata", {})
            match = True
            for key, value in filters.items():
                if key in metadata and metadata[key] != value:
                    match = False
                    break
            if match:
                filtered.append(result)
        return filtered

    async def build_context(
        self,
        query: str,
        top_k: Optional[int] = None,
        filters: Optional[dict] = None,
        max_context_length: int = 4000,
    ) -> str:
        """Build context string from retrieved documents."""
        results = await self.retrieve(query, top_k=top_k, filters=filters)

        if not results:
            return ""

        context_parts = []
        current_length = 0

        for i, result in enumerate(results):
            metadata = result.get("metadata", {})
            content = metadata.get("content", "")
            title = metadata.get("document_title", f"Document {i + 1}")

            chunk_text = f"[Source: {title}]\n{content}\n"

            if current_length + len(chunk_text) > max_context_length:
                remaining = max_context_length - current_length
                if remaining > 100:
                    chunk_text = chunk_text[:remaining] + "..."
                    context_parts.append(chunk_text)
                break

            context_parts.append(chunk_text)
            current_length += len(chunk_text)

        return "\n---\n".join(context_parts)

    async def retrieve_with_sources(
        self,
        query: str,
        top_k: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> dict[str, Any]:
        """Retrieve with full source information."""
        results = await self.retrieve(query, top_k=top_k, filters=filters)

        sources = []
        for result in results:
            metadata = result.get("metadata", {})
            sources.append({
                "title": metadata.get("document_title", "Unknown"),
                "content": metadata.get("content", ""),
                "score": result.get("score", 0.0),
                "chunk_id": result.get("chunk_id", ""),
                "document_id": metadata.get("document_id", ""),
                "document_type": metadata.get("document_type", ""),
            })

        return {
            "sources": sources,
            "context": "\n---\n".join([
                f"[Source: {s['title']}]\n{s['content']}" for s in sources
            ]),
        }


_retriever: Optional[RAGRetriever] = None


def get_retriever() -> RAGRetriever:
    """Get or create the RAG retriever singleton."""
    global _retriever
    if _retriever is None:
        _retriever = RAGRetriever()
    return _retriever
