"""Result reranking for improved retrieval quality."""

from typing import Any, Optional

from app.core.logger import logger


class ResultReranker:
    """Rerank search results for better relevance."""

    def __init__(self):
        self.boost_factors = {
            "exact_match": 1.5,
            "title_match": 1.3,
            "recent_document": 1.2,
        }

    def rerank(
        self,
        query: str,
        results: list[dict[str, Any]],
        top_k: Optional[int] = None,
    ) -> list[dict[str, Any]]:
        """Rerank results based on relevance signals."""
        if not results:
            return []

        query_lower = query.lower()
        query_words = set(query_lower.split())

        for result in results:
            metadata = result.get("metadata", {})
            content = metadata.get("content", "").lower()
            title = metadata.get("document_title", "").lower()

            base_score = result.get("score", 0.0)
            boost = 1.0

            if query_lower in content:
                boost *= self.boost_factors["exact_match"]

            query_word_matches = sum(1 for word in query_words if word in content)
            if query_word_matches > len(query_words) * 0.5:
                boost *= 1.2

            if query_lower in title or any(w in title for w in query_words):
                boost *= self.boost_factors["title_match"]

            result["rerank_score"] = base_score * boost
            result["base_score"] = base_score

        results.sort(key=lambda x: x.get("rerank_score", 0), reverse=True)

        if top_k:
            results = results[:top_k]

        return results

    def reciprocal_rank_fusion(
        self,
        result_lists: list[list[dict[str, Any]]],
        top_k: int = 5,
        k: int = 60,
    ) -> list[dict[str, Any]]:
        """Combine multiple result lists using Reciprocal Rank Fusion."""
        fused_scores: dict[str, float] = {}
        result_map: dict[str, dict] = {}

        for results in result_lists:
            for rank, result in enumerate(results):
                chunk_id = result.get("chunk_id", "")
                if not chunk_id:
                    continue

                rrf_score = 1.0 / (k + rank + 1)

                if chunk_id in fused_scores:
                    fused_scores[chunk_id] += rrf_score
                else:
                    fused_scores[chunk_id] = rrf_score
                    result_map[chunk_id] = result

        sorted_ids = sorted(fused_scores.keys(), key=lambda x: fused_scores[x], reverse=True)

        fused_results = []
        for chunk_id in sorted_ids[:top_k]:
            result = result_map[chunk_id].copy()
            result["rrf_score"] = fused_scores[chunk_id]
            fused_results.append(result)

        return fused_results


_reranker: Optional[ResultReranker] = None


def get_reranker() -> ResultReranker:
    """Get or create the result reranker singleton."""
    global _reranker
    if _reranker is None:
        _reranker = ResultReranker()
    return _reranker
