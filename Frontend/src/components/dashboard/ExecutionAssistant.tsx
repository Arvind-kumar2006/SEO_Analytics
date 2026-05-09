import React, { useState } from 'react';
import SectionCard from '../common/SectionCard';
import { PenTool, Copy, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import type { ExecutionContent } from '../../types/seo.types';

interface ExecutionAssistantProps {
  content?: ExecutionContent;
  orgName?: string;
  industry?: string;
  services?: string[];
  targetAudience?: string;
  geography?: string;
}

/**
 * Generates fully industry-aware execution content from org data.
 * Used when the backend OpenAI call fails or returns empty content.
 * This ensures textareas are NEVER empty, regardless of API status.
 */
const buildFallback = (
  orgName: string,
  industry: string,
  services: string[],
  audience: string,
  geography: string
): ExecutionContent => {
  const name = orgName || 'our team';
  const primaryService = services?.[0] || industry || 'our services';
  const allServices = services?.join(', ') || primaryService;
  const geo = geography || 'your area';
  const aud = audience || 'our clients';
  const ind = (industry || '').toLowerCase();
  const contextStr = (ind + ' ' + (services || []).join(' ')).toLowerCase();

  const emoji =
    contextStr.includes('dental') || contextStr.includes('teeth') || contextStr.includes('oral') || contextStr.includes('clinic')
      ? '🦷'
      : contextStr.includes('fitness') || contextStr.includes('gym') || contextStr.includes('yoga')
      ? '💪'
      : contextStr.includes('legal') || contextStr.includes('law') || contextStr.includes('lawyer')
      ? '⚖️'
      : contextStr.includes('food') || contextStr.includes('restaurant') || contextStr.includes('cafe')
      ? '🍽️'
      : contextStr.includes('real estate') || contextStr.includes('property')
      ? '🏡'
      : contextStr.includes('hosting') || contextStr.includes('cloud') || contextStr.includes('saas') || contextStr.includes('software')
      ? '🚀'
      : '✨';

  const tag1 = primaryService.replace(/\s+/g, '');
  const tag2 = (industry || 'Business').replace(/\s+/g, '');
  const tag3 = geo.split(',')[0].trim().replace(/\s+/g, '');

  return {
    linkedinPost: `${emoji} ${primaryService} should be accessible, transparent, and built around the people who need it most.\n\nAt ${name}, we've built our work around serving ${aud} in ${geo} with ${allServices} — delivered with clarity and genuine care at every step.\n\nWhether you're coming to us for the first time or you've trusted us for years, our commitment stays the same: quality service, honest communication, and results that matter.\n\nReach out to schedule your consultation.\n\n#${tag1} #${tag2} #${tag3}`,

    outreachEmail: `Subject: ${primaryService} services for ${aud} in ${geo}\n\nHi [Name],\n\nI came across your recent work and appreciated your perspective on the ${industry || 'industry'}.\n\nAt ${name}, we specialize in ${services?.slice(0, 2).join(' and ') || primaryService} for ${aud} in ${geo}. I believe there's a meaningful opportunity for us to work together and better serve our shared community.\n\nWould you be open to a 15-minute call this week?\n\nWarm regards,\nThe ${name} Team`,

    blogCommentDraft: `Really valuable perspective on ${industry || 'the industry'}. At ${name}, we've noticed similar patterns — ${aud} increasingly prioritize transparency and reliability when choosing a ${primaryService} provider. Consistent communication and quality service go a long way in building lasting trust. Thanks for sharing these insights.`,

    socialMediaCaption: `${emoji} Looking for trusted ${primaryService} in ${geo}?\n\n${name} offers ${services?.slice(0, 2).join(', ') || primaryService} designed around the needs of ${aud} — flexible, professional, and genuinely caring.\n\n📍 Book your visit today. Link in bio.\n\n#${tag1} #${tag2} #${tag3}`,
  };
};

const ExecutionAssistant: React.FC<ExecutionAssistantProps> = ({
  content,
  orgName = 'the organization',
  industry = 'local services',
  services = [],
  targetAudience = 'our clients',
  geography = 'your area',
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  // Use backend content if all key fields are non-empty strings
  const hasRealContent =
    typeof content?.linkedinPost === 'string' && content.linkedinPost.trim().length > 20 &&
    typeof content?.outreachEmail === 'string' && content.outreachEmail.trim().length > 20;

  const data = hasRealContent
    ? content!
    : buildFallback(orgName, industry, services, targetAudience, geography);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const ContentBox = ({
    id,
    title,
    defaultText,
    icon,
  }: {
    id: string;
    title: string;
    defaultText: string;
    icon: React.ReactNode;
  }) => {
    const [text, setText] = useState(defaultText);

    return (
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all shadow-sm hover:shadow-md flex flex-col">
        <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-3 flex justify-between items-center transition-colors group-hover:bg-brand-50/30">
          <div className="flex items-center gap-2">
            <div className="text-brand-600 bg-white p-1 rounded shadow-sm">{icon}</div>
            <span className="font-bold text-sm text-gray-800">{title}</span>
          </div>
          <button
            onClick={() => handleCopy(text, id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              copied === id
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-200 shadow-sm'
            }`}
            title="Copy to clipboard"
          >
            {copied === id ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Copied!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy</>
            )}
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 flex-grow min-h-[140px] text-gray-700 text-sm leading-relaxed outline-none resize-y overflow-y-auto bg-transparent focus:bg-white transition-colors"
          placeholder={`Write your ${title}...`}
        />
      </div>
    );
  };

  return (
    <SectionCard
      title="AI Execution Assistant"
      icon={<Sparkles className="w-5 h-5 text-brand-600" />}
      className="border-brand-200 shadow-md ring-1 ring-brand-50"
      action={
        <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5" /> Human review required
        </span>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ContentBox id="linkedin" title="LinkedIn Post" defaultText={data.linkedinPost} icon={<PenTool className="w-4 h-4" />} />
        <ContentBox id="email" title="Outreach Email" defaultText={data.outreachEmail} icon={<PenTool className="w-4 h-4" />} />
        <ContentBox id="social" title="Social Media Caption" defaultText={data.socialMediaCaption} icon={<PenTool className="w-4 h-4" />} />
        <ContentBox id="blog" title="Blog Comment Draft" defaultText={data.blogCommentDraft} icon={<PenTool className="w-4 h-4" />} />
      </div>
    </SectionCard>
  );
};

export default ExecutionAssistant;
