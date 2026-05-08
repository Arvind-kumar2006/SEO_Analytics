import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateCompletion = async (prompt: string): Promise<string | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content || null;
  } catch (error: any) {
    console.error('OpenAI API Error:', error?.message || error);
    console.log('Falling back to industry-aware mock data...');
    return generateIndustryAwareFallback(prompt);
  }
};

/**
 * Extracts org context from the prompt string for industry-aware fallback generation.
 */
const extractContext = (prompt: string) => {
  const nameMatch = prompt.match(/"name"\s*:\s*"([^"]+)"/i) || prompt.match(/Business Name:\s*([^\n]+)/i);
  const industryMatch = prompt.match(/"industry"\s*:\s*"([^"]+)"/i) || prompt.match(/Industry:\s*([^\n]+)/i);
  const geoMatch = prompt.match(/"targetGeography"\s*:\s*"([^"]+)"/i) || prompt.match(/Location[^:]*:\s*([^\n]+)/i);
  const audienceMatch = prompt.match(/"targetAudience"\s*:\s*"([^"]+)"/i) || prompt.match(/Target Audience:\s*([^\n]+)/i);
  const servicesMatch = prompt.match(/Services(?:\s*Offered)?:\s*([^\n]+)/i);

  const name = nameMatch ? nameMatch[1].trim() : 'the business';
  const industry = industryMatch ? industryMatch[1].trim().toLowerCase() : 'local services';
  const geography = geoMatch ? geoMatch[1].trim() : 'your city';
  const audience = audienceMatch ? audienceMatch[1].trim() : 'local customers';
  const rawServices = servicesMatch ? servicesMatch[1].trim() : '';
  const serviceList = rawServices.split(',').map(s => s.trim()).filter(Boolean);
  const primaryService = serviceList[0] || industry;
  const secondaryService = serviceList[1] || serviceList[0] || industry;

  return { name, industry, geography, audience, rawServices, serviceList, primaryService, secondaryService };
};

const generateIndustryAwareFallback = (prompt: string): string => {
  const { name, industry, geography, audience, rawServices, serviceList, primaryService, secondaryService } = extractContext(prompt);

  // ── KEYWORDS ──────────────────────────────────────────────────────────────
  if (prompt.toLowerCase().includes('keyword')) {
    return JSON.stringify({
      primaryKeywords: [
        `best ${primaryService} in ${geography}`,
        `${primaryService} near me`,
        `${industry} clinic ${geography}`,
        `${name} ${geography}`,
        `affordable ${primaryService}`
      ],
      secondaryKeywords: [
        `${secondaryService} cost in ${geography}`,
        `${primaryService} specialist`,
        `top rated ${industry} in ${geography}`,
        `${secondaryService} for ${audience}`,
        `${primaryService} without appointment`,
        `${industry} open on weekends ${geography}`,
        `${primaryService} treatment options`,
        `${name} reviews`
      ],
      longTailKeywords: [
        `best ${primaryService} clinic for ${audience} in ${geography}`,
        `how much does ${primaryService} cost in ${geography}`,
        `${primaryService} and ${secondaryService} in one visit`,
        `painless ${primaryService} near ${geography}`,
        `${industry} that accepts walk-ins in ${geography}`,
        `${primaryService} specialist for ${audience} ${geography}`,
        `${name} ${primaryService} appointment booking`,
        `${industry} with good reviews in ${geography}`
      ]
    });
  }

  // ── RECOMMENDATIONS ────────────────────────────────────────────────────────
  if (prompt.toLowerCase().includes('recommendation')) {
    // Check both industry AND services for domain-specific directories
    const contextStr = (industry + ' ' + rawServices).toLowerCase();
    const directorySite = (contextStr.includes('dental') || contextStr.includes('clinic') || contextStr.includes('teeth') || contextStr.includes('oral'))
        ? 'Practo, JustDial, and DentalDost'
      : (contextStr.includes('legal') || contextStr.includes('law') || contextStr.includes('lawyer'))
        ? 'Lawrato and Vakilsearch'
      : (contextStr.includes('fitness') || contextStr.includes('gym') || contextStr.includes('wellness') || contextStr.includes('yoga'))
        ? 'Cult.fit and HealthifyMe'
      : `${geography} business directories and industry-specific portals`;

    return JSON.stringify([
      {
        category: 'Local SEO',
        suggestion: `Create and fully optimize a Google Business Profile for ${name} — add all ${serviceList.length > 0 ? serviceList.join(', ') : primaryService} services, upload real clinic photos, and actively collect reviews from ${audience}.`,
        impact: 'high'
      },
      {
        category: 'Content Strategy',
        suggestion: `Publish 4–6 in-depth service pages — one dedicated page each for ${serviceList.slice(0, 3).join(', ')} — with local schema markup and FAQs targeting questions real ${audience} search in ${geography}.`,
        impact: 'high'
      },
      {
        category: 'Technical SEO',
        suggestion: `Fix Core Web Vitals: compress all images to WebP format, defer non-critical scripts, and target a Largest Contentful Paint (LCP) under 2.5s — critical for ranking in competitive ${geography} local search results.`,
        impact: 'high'
      },
      {
        category: 'Backlinks',
        suggestion: `Get listed on ${directorySite} — these are high-authority, industry-specific directories where ${audience} actively search for ${primaryService} in ${geography}.`,
        impact: 'medium'
      },
      {
        category: 'Keywords',
        suggestion: `Add location-specific H2 headings across all service pages (e.g., "${primaryService} in ${geography}") and embed them naturally in the first paragraph to capture "near me" and city-based searches.`,
        impact: 'medium'
      }
    ]);
  }

  // ── EXECUTION CONTENT ─────────────────────────────────────────────────────
  // Trigger on 'linkedinPost' — always present in the execution prompt's JSON schema
  if (prompt.includes('linkedinPost')) {
    // Check both industry field AND services for better context matching
    const contextStr = (industry + ' ' + rawServices).toLowerCase();
    const emoji = (contextStr.includes('dental') || contextStr.includes('teeth') || contextStr.includes('oral') || contextStr.includes('clinic'))
        ? '🦷'
      : (contextStr.includes('fitness') || contextStr.includes('gym') || contextStr.includes('yoga'))
        ? '💪'
      : (contextStr.includes('legal') || contextStr.includes('law'))
        ? '⚖️'
      : (contextStr.includes('restaurant') || contextStr.includes('food') || contextStr.includes('cafe'))
        ? '🍽️'
      : (contextStr.includes('real estate') || contextStr.includes('property'))
        ? '🏡'
      : '✨';

    const tag1 = primaryService.replace(/\s+/g, '');
    const tag2 = industry.replace(/\s+/g, '');
    const tag3 = geography.split(',')[0].trim().replace(/\s+/g, '');

    return JSON.stringify({
      linkedinPost: `${emoji} ${primaryService} is more than a service — it's peace of mind for ${audience}.\n\nAt ${name}, we understand that ${audience} need clarity, care, and convenience. That's why we've built our practice around providing ${rawServices} in a welcoming environment in ${geography}.\n\nWhether you're a first-time visitor or a long-standing patient, our team is committed to making every experience straightforward and stress-free.\n\nReach out to schedule your consultation today.\n\n#${tag1} #${tag2} #${tag3}`,

      outreachEmail: `Subject: Helping ${audience} find trusted ${primaryService} in ${geography}\n\nHi [Name],\n\nI came across your recent work and appreciated your insights on ${industry}.\n\nAt ${name}, we specialize in ${rawServices} for ${audience} in ${geography}. I believe there's a meaningful opportunity for our teams to collaborate and serve our shared community better.\n\nWould you be open to a brief 15-minute call this week?\n\nWarm regards,\nThe ${name} Team`,

      blogCommentDraft: `Really valuable perspective on ${industry} trends. At ${name}, we've observed similar patterns — ${audience} increasingly prioritize transparency and accessibility when choosing a ${primaryService} provider. Regular check-ins and clear communication go a long way in building lasting trust. Thanks for sharing these insights.`,

      socialMediaCaption: `${emoji} Looking for trusted ${primaryService} in ${geography}?\n\n${name} offers ${rawServices} designed for ${audience} — with flexible appointments and a team that genuinely cares.\n\n📍 Book your visit today. Link in bio.\n\n#${tag1} #${tag2} #${tag3}`
    });
  }

  return JSON.stringify({ fallback: true });
};
