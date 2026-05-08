export const keywordPrompt = (
  organizationData: string,
  scrapedContent: string
) => {
  // Parse org data to extract structured fields for the prompt
  let org: any = {};
  try { org = JSON.parse(organizationData); } catch { /* use raw string */ }

  const name = org.name || 'the organization';
  const industry = org.industry || 'their industry';
  const geography = org.targetGeography || 'their target region';
  const audience = org.targetAudience || 'their target audience';
  const services = Array.isArray(org.services) ? org.services.join(', ') : (org.services || 'their services');
  const existing = Array.isArray(org.currentKeywords) && org.currentKeywords.length
    ? org.currentKeywords.join(', ')
    : 'none provided';

  return `
You are an expert local SEO strategist. Generate a highly specific keyword analysis for the following business. Every keyword MUST be directly relevant to the specific industry, services, and geography — avoid generic marketing or SaaS terms.

Business Name: ${name}
Industry: ${industry}
Location / Target Geography: ${geography}
Services Offered: ${services}
Target Audience: ${audience}
Existing Keywords (do not repeat these): ${existing}

Scraped Website Content:
${scrapedContent}

RULES:
- Keywords must reflect ACTUAL search queries real users in ${geography} would type on Google
- Use the specific services (${services}) and industry (${industry}) — not generic terms
- Include local intent keywords (e.g., "near me", city name, area-specific)
- Avoid: "solutions", "enterprise", "platform", "scaling", "growth hacking", "digital transformation"
- Primary keywords = high-volume, direct intent (e.g., "best dentist in Bangalore")
- Secondary keywords = supportive intent (e.g., "teeth whitening cost", "painless root canal")
- Long-tail = very specific, conversational (e.g., "affordable family dental clinic in Koramangala")

Generate exactly 5 primary keywords, 8 secondary keywords, and 8 long-tail keywords.
Return ONLY a valid JSON object:
{
  "primaryKeywords": ["...", "..."],
  "secondaryKeywords": ["...", "..."],
  "longTailKeywords": ["...", "..."]
}
`;
};
