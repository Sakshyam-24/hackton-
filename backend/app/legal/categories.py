"""Legal categories and classification utilities."""

from enum import Enum
from typing import Optional


class LegalCategory(str, Enum):
    """Legal categories for classification."""
    CONTRACT_LAW = "contract_law"
    FAMILY_LAW = "family_law"
    CRIMINAL_LAW = "criminal_law"
    CORPORATE_LAW = "corporate_law"
    INTELLECTUAL_PROPERTY = "intellectual_property"
    REAL_ESTATE = "real_estate"
    EMPLOYMENT_LAW = "employment_law"
    CIVIL_RIGHTS = "civil_rights"
    IMMIGRATION = "immigration"
    TAX_LAW = "tax_law"
    GENERAL = "general"


CATEGORY_KEYWORDS: dict[LegalCategory, list[str]] = {
    LegalCategory.CONTRACT_LAW: [
        "contract", "agreement", "breach", "terms", "conditions",
        "warranty", "liability", "indemnification", "obligations",
        "offer", "acceptance", "consideration", "performance",
    ],
    LegalCategory.FAMILY_LAW: [
        "divorce", "custody", "marriage", "child", "spouse",
        "alimony", "adoption", "guardian", "family", "domestic",
        "separation", "prenuptial", "visitation",
    ],
    LegalCategory.CRIMINAL_LAW: [
        "criminal", "crime", "felony", "misdemeanor", "arrest",
        "prosecution", "defendant", "guilty", "innocent", "bail",
        "sentence", "conviction", "charges", "theft", "assault",
    ],
    LegalCategory.CORPORATE_LAW: [
        "corporation", "llc", "company", "business", "shareholder",
        "board", "fiduciary", "merger", "acquisition", "compliance",
        "corporate", "incorporation", "bylaws",
    ],
    LegalCategory.INTELLECTUAL_PROPERTY: [
        "patent", "trademark", "copyright", "intellectual property",
        "ip", "invention", "brand", "license", "infringement",
        "trade secret", "proprietary",
    ],
    LegalCategory.REAL_ESTATE: [
        "property", "real estate", "landlord", "tenant", "lease",
        "rent", "mortgage", "deed", "title", "zoning",
        "foreclosure", "eviction",
    ],
    LegalCategory.EMPLOYMENT_LAW: [
        "employment", "employee", "employer", "workplace", "hiring",
        "firing", "discrimination", "harassment", "wages", "overtime",
        "workers compensation", "labor", "termination",
    ],
    LegalCategory.CIVIL_RIGHTS: [
        "civil rights", "discrimination", "equality", "freedom",
        "constitutional", "amendment", "due process", "equal protection",
        "human rights", "privacy",
    ],
    LegalCategory.IMMIGRATION: [
        "immigration", "visa", "green card", "citizenship", "deportation",
        "asylum", "refugee", "naturalization", "uscis", "passport",
    ],
    LegalCategory.TAX_LAW: [
        "tax", "taxation", "irs", "income tax", "deduction",
        "exemption", "filing", "audit", "tax return", "revenue",
    ],
}


def classify_legal_query(query: str) -> LegalCategory:
    """Classify a legal query into a category based on keywords."""
    query_lower = query.lower()
    scores: dict[LegalCategory, int] = {}

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in query_lower)
        if score > 0:
            scores[category] = score

    if not scores:
        return LegalCategory.GENERAL

    return max(scores, key=scores.get)


def get_category_description(category: LegalCategory) -> str:
    """Get a human-readable description of a legal category."""
    descriptions = {
        LegalCategory.CONTRACT_LAW: "Contract formation, interpretation, and disputes",
        LegalCategory.FAMILY_LAW: "Divorce, custody, adoption, and family matters",
        LegalCategory.CRIMINAL_LAW: "Criminal charges, defense, and legal proceedings",
        LegalCategory.CORPORATE_LAW: "Business formation, governance, and compliance",
        LegalCategory.INTELLECTUAL_PROPERTY: "Patents, trademarks, copyrights, and IP protection",
        LegalCategory.REAL_ESTATE: "Property transactions, landlord-tenant, and zoning",
        LegalCategory.EMPLOYMENT_LAW: "Workplace rights, discrimination, and labor laws",
        LegalCategory.CIVIL_RIGHTS: "Constitutional rights, discrimination, and civil liberties",
        LegalCategory.IMMIGRATION: "Visas, citizenship, deportation, and immigration matters",
        LegalCategory.TAX_LAW: "Tax obligations, filing, audits, and tax disputes",
        LegalCategory.GENERAL: "General legal information and guidance",
    }
    return descriptions.get(category, "Legal information")


def get_all_categories() -> list[dict[str, str]]:
    """Get all legal categories with their descriptions."""
    return [
        {
            "id": category.value,
            "name": category.name.replace("_", " ").title(),
            "description": get_category_description(category),
        }
        for category in LegalCategory
    ]
