"""Legal service for legal analysis and operations."""

from typing import Any, Optional

from app.core.logger import logger
from app.llm.provider import get_llm_provider
from app.llm.prompts import CITATION_EXTRACTION_PROMPT, CATEGORY_DETECTION_PROMPT
from app.legal.categories import classify_legal_query, get_all_categories, LegalCategory
from app.legal.citation import extract_citations_from_text, LegalCitation
from app.legal.disclaimer import get_disclaimer, get_consent_disclaimer
from app.legal.validator import validate_query, is_legal_question


class LegalService:
    """Service for legal analysis operations."""

    def __init__(self):
        self.llm_provider = get_llm_provider()

    async def analyze_query(self, query: str) -> dict[str, Any]:
        """Analyze a legal query for category and intent."""
        validated_query = validate_query(query)
        category = classify_legal_query(validated_query)
        is_legal = is_legal_question(validated_query)

        return {
            "query": validated_query,
            "category": category.value,
            "category_description": category.value.replace("_", " ").title(),
            "is_legal_question": is_legal,
            "sensitivity_level": self._assess_sensitivity(validated_query),
        }

    async def extract_citations(self, text: str) -> list[dict[str, Any]]:
        """Extract legal citations from text."""
        regex_citations = extract_citations_from_text(text)

        try:
            prompt = CITATION_EXTRACTION_PROMPT.format(text=text[:3000])
            llm_response = await self.llm_provider.generate(
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=2000,
            )
        except Exception as e:
            logger.warning(f"LLM citation extraction failed, using regex only: {e}")

        all_citations = [c.to_dict() for c in regex_citations]

        seen = set()
        unique_citations = []
        for citation in all_citations:
            key = citation.get("citation", "").lower().strip()
            if key and key not in seen:
                seen.add(key)
                unique_citations.append(citation)

        return unique_citations

    async def detect_category(self, query: str) -> str:
        """Detect the legal category of a query."""
        category = classify_legal_query(query)
        return category.value

    def get_categories(self) -> list[dict[str, str]]:
        """Get all available legal categories."""
        return get_all_categories()

    def get_disclaimer(self, category: Optional[str] = None) -> str:
        """Get appropriate disclaimer."""
        return get_disclaimer(category)

    def get_consent_text(self) -> str:
        """Get consent text."""
        return get_consent_disclaimer()

    def validate_input(self, text: str) -> str:
        """Validate user input."""
        return validate_query(text)

    def is_legal_question(self, text: str) -> bool:
        """Check if text is a legal question."""
        return is_legal_question(text)

    def _assess_sensitivity(self, query: str) -> str:
        """Assess the sensitivity level of a query."""
        high_sensitivity_keywords = [
            "criminal", "arrest", "charges", "domestic violence",
            "child abuse", "sexual", "murder", "felony",
        ]
        medium_sensitivity_keywords = [
            "divorce", "custody", "lawsuit", "claim", "fired",
            "termination", "discrimination", "harassment",
        ]

        query_lower = query.lower()

        for keyword in high_sensitivity_keywords:
            if keyword in query_lower:
                return "high"

        for keyword in medium_sensitivity_keywords:
            if keyword in query_lower:
                return "medium"

        return "low"


_legal_service: Optional[LegalService] = None


def get_legal_service() -> LegalService:
    """Get or create the legal service singleton."""
    global _legal_service
    if _legal_service is None:
        _legal_service = LegalService()
    return _legal_service
