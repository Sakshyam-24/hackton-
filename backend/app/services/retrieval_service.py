"""Retrieval service for document search and context building."""

from typing import Any, Optional

from app.core.config import get_settings
from app.core.logger import logger
from app.rag.retriever import get_retriever
from app.rag.reranker import get_reranker


class RetrievalService:
    """Service for document retrieval and search."""

    def __init__(self):
        self.settings = get_settings()
        self.retriever = get_retriever()
        self.reranker = get_reranker()

    async def retrieve_with_context(
        self,
        query: str,
        top_k: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> dict[str, Any]:
        """Retrieve relevant documents and build context."""
        if top_k is None:
            top_k = self.settings.TOP_K_RETRIEVAL

        results = await self.retriever.retrieve(query, top_k=top_k, filters=filters)

        if results:
            results = self.reranker.rerank(query, results, top_k=self.settings.TOP_K_RERANK)

        context = self._build_context(results)
        sources = self._extract_sources(results)

        return {
            "context": context,
            "sources": sources,
            "results": results,
        }

    async def search_documents(
        self,
        query: str,
        top_k: int = 5,
        filters: Optional[dict] = None,
    ) -> list[dict[str, Any]]:
        """Search for documents."""
        results = await self.retriever.retrieve(query, top_k=top_k, filters=filters)

        if results:
            results = self.reranker.rerank(query, results, top_k=top_k)

        return results

    def _build_context(self, results: list[dict]) -> str:
        """Build context string from results."""
        if not results:
            return ""

        context_parts = []
        current_length = 0
        max_length = 4000

        for result in results:
            metadata = result.get("metadata", {})
            content = metadata.get("content", "")
            title = metadata.get("document_title", "Unknown")

            chunk_text = f"[Source: {title}]\n{content}\n"

            if current_length + len(chunk_text) > max_length:
                remaining = max_length - current_length
                if remaining > 100:
                    chunk_text = chunk_text[:remaining] + "..."
                    context_parts.append(chunk_text)
                break

            context_parts.append(chunk_text)
            current_length += len(chunk_text)

        return "\n---\n".join(context_parts)

    def _extract_sources(self, results: list[dict]) -> list[dict[str, Any]]:
        """Extract source information from results."""
        sources = []
        seen_titles = set()

        for result in results:
            metadata = result.get("metadata", {})
            title = metadata.get("document_title", "Unknown")

            if title in seen_titles:
                continue
            seen_titles.add(title)

            sources.append({
                "title": title,
                "document_type": metadata.get("document_type", ""),
                "legal_category": metadata.get("legal_category", ""),
                "score": result.get("score", 0.0),
                "document_id": metadata.get("document_id", ""),
            })

        return sources


_retrieval_service: Optional[RetrievalService] = None


def get_retrieval_service() -> RetrievalService:
    """Get or create the retrieval service singleton."""
    global _retrieval_service
    if _retrieval_service is None:
        _retrieval_service = RetrievalService()
    return _retrieval_service
