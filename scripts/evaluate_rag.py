"""RAG evaluation script for measuring retrieval and generation quality."""

import argparse
import asyncio
import json
import sys
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.core.config import get_settings
from app.core.logger import logger


@dataclass
class EvaluationResult:
    """Result of a single evaluation query."""
    query: str
    expected_answer: str
    retrieved_chunks: list[str] = field(default_factory=list)
    generated_answer: str = ""
    retrieval_precision: float = 0.0
    retrieval_recall: float = 0.0
    latency_ms: float = 0.0
    passed: bool = False


@dataclass
class EvaluationReport:
    """Aggregated evaluation report."""
    total_queries: int = 0
    passed_queries: int = 0
    avg_precision: float = 0.0
    avg_recall: float = 0.0
    avg_latency_ms: float = 0.0
    pass_rate: float = 0.0
    results: list = field(default_factory=list)


def precision_at_k(retrieved: list[str], relevant: list[str], k: int) -> float:
    """Compute precision@k."""
    if k == 0:
        return 0.0
    retrieved_at_k = retrieved[:k]
    relevant_set = set(relevant)
    hits = sum(1 for r in retrieved_at_k if r in relevant_set)
    return hits / k


def recall_at_k(retrieved: list[str], relevant: list[str], k: int) -> float:
    """Compute recall@k."""
    if not relevant:
        return 0.0
    retrieved_at_k = retrieved[:k]
    relevant_set = set(relevant)
    hits = sum(1 for r in retrieved_at_k if r in relevant_set)
    return hits / len(relevant_set)


def evaluate_retrieval(
    query: str,
    vector_store,
    relevant_sources: list[str],
    top_k: int = 5,
) -> tuple[float, float, list[str]]:
    """Evaluate retrieval quality for a single query."""
    from app.llm.embeddings import get_embedding_generator

    embedding_generator = get_embedding_generator()
    query_embedding = asyncio.run(
        embedding_generator.generate_embedding(query)
    )

    start = time.time()
    results = vector_store.search(query_embedding, top_k=top_k)
    latency_ms = (time.time() - start) * 1000

    retrieved_sources = [
        r.get("metadata", {}).get("document_id", "")
        for r in results
    ]

    prec = precision_at_k(retrieved_sources, relevant_sources, top_k)
    rec = recall_at_k(retrieved_sources, relevant_sources, top_k)

    return prec, rec, retrieved_sources


def run_evaluation(
    test_data_path: Path,
    output_path: Path,
    top_k: int = 5,
) -> EvaluationReport:
    """Run evaluation on test queries."""
    from app.rag.vector_store import get_vector_store

    vector_store = get_vector_store()
    if vector_store.size == 0:
        logger.error("No vectors in index. Run the index pipeline first.")
        sys.exit(1)

    with open(test_data_path, "r", encoding="utf-8") as f:
        test_data = json.load(f)

    queries = test_data.get("queries", [])
    logger.info(f"Evaluating {len(queries)} queries...")

    report = EvaluationReport()

    for item in queries:
        query = item["query"]
        relevant_sources = item.get("relevant_sources", [])
        expected = item.get("expected_answer", "")

        prec, rec, retrieved = evaluate_retrieval(
            query, vector_store, relevant_sources, top_k
        )

        result = EvaluationResult(
            query=query,
            expected_answer=expected,
            retrieved_chunks=retrieved,
            retrieval_precision=prec,
            retrieval_recall=rec,
            passed=prec > 0.5 and rec > 0.5,
        )

        report.results.append(asdict(result))
        report.total_queries += 1
        if result.passed:
            report.passed_queries += 1

        logger.info(f"  Q: {query[:60]}...")
        logger.info(f"    Precision: {prec:.3f}, Recall: {rec:.3f}, Passed: {result.passed}")

    if report.total_queries > 0:
        report.avg_precision = sum(r["retrieval_precision"] for r in report.results) / report.total_queries
        report.avg_recall = sum(r["retrieval_recall"] for r in report.results) / report.total_queries
        report.pass_rate = report.passed_queries / report.total_queries

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(asdict(report), f, indent=2, ensure_ascii=False)

    logger.info(f"\nEvaluation complete. Results saved to {output_path}")
    logger.info(f"  Total: {report.total_queries}, Passed: {report.passed_queries}")
    logger.info(f"  Avg Precision: {report.avg_precision:.3f}")
    logger.info(f"  Avg Recall: {report.avg_recall:.3f}")
    logger.info(f"  Pass Rate: {report.pass_rate:.1%}")

    return report


def main():
    parser = argparse.ArgumentParser(description="Evaluate RAG retrieval quality")
    parser.add_argument(
        "--test-data",
        type=Path,
        default=Path("./data/evaluation/test_queries.json"),
        help="Path to test queries JSON file",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("./data/evaluation/report.json"),
        help="Output path for evaluation report",
    )
    parser.add_argument(
        "--top-k",
        type=int,
        default=5,
        help="Number of results to retrieve per query",
    )
    args = parser.parse_args()

    if not args.test_data.exists():
        logger.error(f"Test data not found: {args.test_data}")
        logger.info("Create a test_queries.json file with format:")
        logger.info('{"queries": [{"query": "...", "relevant_sources": ["doc_id"], "expected_answer": "..."}]}')
        sys.exit(1)

    run_evaluation(args.test_data, args.output, args.top_k)


if __name__ == "__main__":
    main()
