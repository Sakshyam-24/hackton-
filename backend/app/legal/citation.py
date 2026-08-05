"""Citation extraction and management for legal documents."""

import re
from typing import Any, Optional
from dataclasses import dataclass, field


@dataclass
class LegalCitation:
    """Represents a legal citation."""
    citation: str
    citation_type: str
    relevance: str = ""
    case_name: Optional[str] = None
    volume: Optional[str] = None
    reporter: Optional[str] = None
    page: Optional[str] = None
    year: Optional[str] = None
    court: Optional[str] = None
    statute_title: Optional[str] = None
    statute_section: Optional[str] = None

    def to_dict(self) -> dict[str, Any]:
        """Convert citation to dictionary."""
        return {
            "citation": self.citation,
            "type": self.citation_type,
            "relevance": self.relevance,
            "case_name": self.case_name,
            "volume": self.volume,
            "reporter": self.reporter,
            "page": self.page,
            "year": self.year,
            "court": self.court,
            "statute_title": self.statute_title,
            "statute_section": self.statute_section,
        }


CASE_LAW_PATTERNS = [
    re.compile(r"(\w[\w\s]+)\s+v\.?\s+(\w[\w\s]+),?\s+(\d+)\s+([A-Z][\w\s\.]+)\s+(\d+)(?:\s*\((?:(\d{4})|(\w+\s+\d{4}))\))?"),
    re.compile(r"(\w[\w\s]+)\s+v\.?\s+(\w[\w\s]+)\s+\((\d{4})\)"),
]

STATUTE_PATTERNS = [
    re.compile(r"(\d+)\s+U\.?S\.?C\.?\s+§?\s*(\d+(?:\.\d+)*)"),
    re.compile(r"(\d+)\s+CFR\s+§?\s*(\d+(?:\.\d+)*)"),
    re.compile(r"§\s*(\d+(?:\.\d+)*)\s+of\s+(.+?)\.?", re.IGNORECASE),
]


def extract_citations_from_text(text: str) -> list[LegalCitation]:
    """Extract legal citations from text using regex patterns."""
    citations = []

    for pattern in CASE_LAW_PATTERNS:
        for match in pattern.finditer(text):
            groups = match.groups()
            citation_text = match.group(0).strip()

            case_name = f"{groups[0].strip()} v. {groups[1].strip()}" if len(groups) > 1 else None
            year = groups[-1] if groups and re.match(r"\d{4}", groups[-1] or "") else None

            citations.append(LegalCitation(
                citation=citation_text,
                citation_type="case_law",
                case_name=case_name,
                year=year,
            ))

    for pattern in STATUTE_PATTERNS:
        for match in pattern.finditer(text):
            groups = match.groups()
            citation_text = match.group(0).strip()

            citations.append(LegalCitation(
                citation=citation_text,
                citation_type="statute",
                statute_title=groups[1] if len(groups) > 1 else None,
                statute_section=groups[0] if groups else None,
            ))

    return citations


def format_citation(citation: LegalCitation) -> str:
    """Format a citation for display."""
    if citation.citation_type == "case_law" and citation.case_name:
        parts = [citation.case_name]
        if citation.year:
            parts.append(f"({citation.year})")
        return " ".join(parts)
    return citation.citation


def deduplicate_citations(citations: list[LegalCitation]) -> list[LegalCitation]:
    """Remove duplicate citations based on citation text."""
    seen = set()
    unique_citations = []

    for citation in citations:
        normalized = citation.citation.lower().strip()
        if normalized not in seen:
            seen.add(normalized)
            unique_citations.append(citation)

    return unique_citations
