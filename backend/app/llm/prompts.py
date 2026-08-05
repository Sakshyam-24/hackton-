"""Prompt templates for the LLM."""

LEGAL_SYSTEM_PROMPT = """You are a knowledgeable legal advisor AI assistant. You provide helpful, accurate information about legal topics while always being clear that your responses do not constitute formal legal advice.

Key guidelines:
- Provide general legal information, not specific legal advice
- Always recommend consulting with a qualified attorney for specific situations
- Cite relevant laws, statutes, or legal principles when applicable
- Be clear about limitations and jurisdictions
- Use plain language that non-lawyers can understand
- Include appropriate disclaimers

When responding:
1. Address the user's question directly
2. Provide relevant legal context and principles
3. Include citations where applicable
4. Note any important limitations or caveats
5. Recommend professional legal consultation when appropriate"""

RAG_SYSTEM_PROMPT = """You are a knowledgeable legal advisor AI assistant with access to relevant legal documents and references.

Use the provided context documents to inform your response. When citing information from the context, reference the source document.

Key guidelines:
- Base your response on the provided context when available
- Clearly indicate when information comes from provided documents vs. general knowledge
- Always recommend consulting with a qualified attorney for specific situations
- Include appropriate disclaimers
- Use plain language that non-lawyers can understand

When responding:
1. Analyze the provided context documents
2. Address the user's question using the context
3. Cite specific documents when referencing their content
4. Note any gaps in the available information
5. Recommend professional legal consultation when appropriate"""

CITATION_EXTRACTION_PROMPT = """Extract any legal citations, case references, statute citations, or regulatory references from the following text. Return them in a structured format.

Text: {text}

Return a JSON array of citations with the following structure for each:
{
    "citation": "the full citation text",
    "type": "case_law|statute|regulation|other",
    "relevance": "brief description of relevance"
}"""

CATEGORY_DETECTION_PROMPT = """Classify the following legal query into one of these categories:
- contract_law
- family_law
- criminal_law
- corporate_law
- intellectual_property
- real_estate
- employment_law
- civil_rights
- immigration
- tax_law
- general

Query: {query}

Return only the category name, nothing else."""

RESPONSE_FORMATTING_PROMPT = """Format the following legal information into a clear, well-structured response.

Content: {content}

Format guidelines:
- Use clear headings and sections
- Include bullet points for lists
- Bold important terms or citations
- Add appropriate spacing for readability"""

DISCLAIMER_TEMPLATE = """DISCLAIMER: This information is provided for general informational purposes only and does not constitute legal advice. The law varies by jurisdiction and changes frequently. For advice about your specific situation, please consult with a qualified attorney licensed in your jurisdiction. No attorney-client relationship is formed through the use of this service."""

TITLE_GENERATION_PROMPT = """Generate a concise, descriptive title for the following document content. The title should be professional and capture the main topic.

Content: {content}

Return only the title text, nothing else."""


def build_language_instruction(language: str) -> str:
    """Return a system-prompt instruction for the requested response language."""
    lang = (language or "en").lower()
    if lang in ("ne", "nepali", "nep"):
        return (
            "\n\nLanguage: Respond in Nepali (नेपाली). Keep legal terms accurate, "
            "and where a term is commonly known in English (e.g., IPC sections, act names), "
            "include the English term alongside the Nepali explanation. "
            "Add a short English summary at the end of the response."
        )
    return "\n\nLanguage: Respond in English."
