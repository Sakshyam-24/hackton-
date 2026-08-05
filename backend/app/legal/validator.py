"""Input validation utilities for legal queries."""

import re
from typing import Optional


BLOCKED_PATTERNS = [
    re.compile(r"\b(hack|exploit|illegal|unlawful)\b", re.IGNORECASE),
    re.compile(r"\b(bypass|evade|circumvent)\b.*\b(law|regulation|rule)\b", re.IGNORECASE),
    re.compile(r"\b(how to|ways to)\b.*\b(steal|fraud|scam|cheat)\b", re.IGNORECASE),
]

SENSITIVE_PATTERNS = [
    re.compile(r"\b(ssn|social security)\b.*\d{3}-?\d{2}-?\d{4}", re.IGNORECASE),
    re.compile(r"\b(credit card|debit card)\b.*\d{4}", re.IGNORECASE),
    re.compile(r"\b(account|routing)\s*(number|#)\b.*\d+", re.IGNORECASE),
    re.compile(r"\bpassword\b.*[:=]\s*\S+", re.IGNORECASE),
]


class ValidationError(Exception):
    """Raised when input validation fails."""
    def __init__(self, message: str, code: str = "VALIDATION_ERROR"):
        self.message = message
        self.code = code
        super().__init__(message)


def validate_query(query: str) -> str:
    """Validate and sanitize a legal query."""
    if not query or not query.strip():
        raise ValidationError("Query cannot be empty", "EMPTY_QUERY")

    query = query.strip()

    if len(query) < 3:
        raise ValidationError("Query must be at least 3 characters long", "QUERY_TOO_SHORT")

    if len(query) > 10000:
        raise ValidationError("Query exceeds maximum length of 10000 characters", "QUERY_TOO_LONG")

    for pattern in BLOCKED_PATTERNS:
        if pattern.search(query):
            raise ValidationError(
                "Your query contains content that cannot be processed. Please rephrase your question.",
                "INAPPROPRIATE_CONTENT",
            )

    return query


def sanitize_for_llm(text: str) -> str:
    """Sanitize text for safe use in LLM prompts."""
    text = text.replace("\\", "\\\\")
    text = text.replace("{", "\\{").replace("}", "\\}")
    text = text.replace("<", "\\<").replace(">", "\\>")
    return text.strip()


def detect_sensitive_info(text: str) -> list[str]:
    """Detect potentially sensitive information in text."""
    sensitive_info = []

    for pattern in SENSITIVE_PATTERNS:
        if pattern.search(text):
            sensitive_info.append(f"Potential sensitive data detected: {pattern.pattern}")

    return sensitive_info


def validate_file_upload(
    filename: str,
    file_size: int,
    max_size_mb: int = 20,
    allowed_extensions: Optional[list[str]] = None,
) -> str:
    """Validate a file upload."""
    if allowed_extensions is None:
        allowed_extensions = [".pdf", ".docx", ".txt", ".md"]

    if not filename:
        raise ValidationError("Filename is required", "NO_FILENAME")

    file_ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if file_ext not in allowed_extensions:
        raise ValidationError(
            f"File type '{file_ext}' is not allowed. Allowed types: {', '.join(allowed_extensions)}",
            "INVALID_FILE_TYPE",
        )

    max_size_bytes = max_size_mb * 1024 * 1024
    if file_size > max_size_bytes:
        raise ValidationError(
            f"File size exceeds maximum of {max_size_mb}MB",
            "FILE_TOO_LARGE",
        )

    return filename


def is_legal_question(text: str) -> bool:
    """Determine if text appears to be a legal question."""
    legal_indicators = [
        r"\b(legal|law|attorney|lawyer|court|judge|statute)\b",
        r"\b(sue|lawsuit|claim|rights|liable|liability)\b",
        r"\b(contract|agreement|terms|conditions)\b",
        r"\b(crime|criminal|charges|arrest)\b",
        r"\b(divorce|custody|marriage|spouse)\b",
        r"\b(property|landlord|tenant|lease|rent)\b",
        r"\b(employment|fired|terminated|discrimination)\b",
        r"\b(immigration|visa|deportation)\b",
        r"\b(tax|irs|filing|deduction)\b",
        r"\b(patent|trademark|copyright)\b",
    ]

    for pattern in legal_indicators:
        if re.search(pattern, text, re.IGNORECASE):
            return True

    return False
