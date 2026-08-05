"""Response formatting utilities for legal content."""

import re
from typing import Any


def format_legal_response(
    content: str,
    citations: list[dict[str, Any]] | None = None,
    sources: list[dict[str, Any]] | None = None,
    include_disclaimer: bool = True,
) -> str:
    """Format a legal response with citations, sources, and disclaimer."""
    sections = []

    sections.append(content)

    if citations:
        sections.append("\n---\n**Legal Citations:**\n")
        for citation in citations:
            citation_text = citation.get("citation", "")
            citation_type = citation.get("type", "")
            relevance = citation.get("relevance", "")
            sections.append(f"- [{citation_type.upper()}] {citation_text}")
            if relevance:
                sections.append(f"  Relevance: {relevance}")

    if sources:
        sections.append("\n---\n**Referenced Documents:**\n")
        for source in sources:
            title = source.get("title", "Untitled")
            doc_type = source.get("document_type", "document")
            sections.append(f"- {title} ({doc_type})")

    if include_disclaimer:
        from app.legal.disclaimer import get_disclaimer
        sections.append(f"\n---\n{get_disclaimer()}")

    return "\n".join(sections)


def clean_markdown(text: str) -> str:
    """Clean and normalize markdown formatting."""
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r" {2,}", " ", text)
    return text.strip()


def extract_key_points(text: str) -> list[str]:
    """Extract key points from legal text."""
    key_points = []
    lines = text.split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith(("-", "•", "*", "·")):
            key_points.append(line.lstrip("-•*· ").strip())
        elif line.startswith(("1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.")):
            key_points.append(re.sub(r"^\d+\.\s*", "", line).strip())
        elif any(keyword in line.lower() for keyword in [
            "important", "note", "warning", "caution", "key point"
        ]):
            key_points.append(line)

    return key_points


def truncate_response(text: str, max_length: int = 4000) -> str:
    """Truncate response to max length while preserving word boundaries."""
    if len(text) <= max_length:
        return text

    truncated = text[:max_length]
    last_space = truncated.rfind(" ")
    if last_space > 0:
        truncated = truncated[:last_space]

    return truncated + "\n\n[Response truncated. Please ask for more specific details.]"
