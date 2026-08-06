"""Legal disclaimers for the AI advisor."""

from typing import Optional


MAIN_DISCLAIMER = """DISCLAIMER: This information is provided for general informational purposes only and does not constitute legal advice. The law varies by jurisdiction and changes frequently. For advice about your specific situation, please consult with a qualified attorney licensed in your jurisdiction. No attorney-client relationship is formed through the use of this service."""

SPECIFIC_DISCLAIMERS = {
    "contract_law": "Contract law varies significantly by jurisdiction. The information provided is general in nature and may not apply to your specific contract or jurisdiction.",
    "family_law": "Family law matters are highly sensitive and jurisdiction-specific. The information provided should not be used as a substitute for advice from a family law attorney in your area.",
    "criminal_law": "Criminal law matters can have serious consequences. If you are facing criminal charges, you should immediately consult with a criminal defense attorney.",
    "corporate_law": "Corporate law involves complex regulations that vary by state and country. Consult with a corporate attorney for advice specific to your business situation.",
    "intellectual_property": "Intellectual property protection varies by jurisdiction and type of IP. Consult with an IP attorney for advice on protecting your intellectual property.",
    "real_estate": "Real estate laws vary significantly by location. Consult with a real estate attorney for advice specific to your property matter.",
    "employment_law": "Employment laws vary by state and are subject to change. Consult with an employment attorney for advice about your specific workplace situation.",
    "civil_rights": "Civil rights matters are complex and often involve constitutional questions. Consult with a civil rights attorney for advice about your specific situation.",
    "immigration": "Immigration law is complex and constantly changing. Consult with a qualified immigration attorney for advice about your immigration status or application.",
    "tax_law": "Tax laws change frequently and vary by jurisdiction. Consult with a tax professional or tax attorney for advice specific to your tax situation.",
}


def get_disclaimer(category: Optional[str] = None) -> str:
    """Get the appropriate disclaimer, optionally with category-specific additions."""
    disclaimer = MAIN_DISCLAIMER

    if category and category in SPECIFIC_DISCLAIMERS:
        disclaimer += f"\n\n{SPECIFIC_DISCLAIMERS[category]}"

    return disclaimer


def get_consent_disclaimer() -> str:
    """Get the consent notice for users."""
    return """By using this service, you acknowledge and agree that:
1. The information provided is for general informational purposes only.
2. This service does not provide legal advice.
3. No attorney-client relationship is formed through the use of this service.
4. You should consult with a qualified attorney for specific legal advice.
5. The information may not be applicable to your specific situation or jurisdiction."""


def get_data_privacy_disclaimer() -> str:
    """Get the data privacy notice."""
    return """Your conversations with this AI assistant may be processed to provide legal information. We do not store or share your personal information. However, do not share confidential or sensitive personal information through this service. For confidential legal matters, please consult directly with a licensed attorney."""


def format_disclaimer_for_response(category: Optional[str] = None) -> str:
    """Format a disclaimer for inclusion in AI responses."""
    disclaimer = get_disclaimer(category)
    return f"\n\n---\n*{disclaimer}*"
