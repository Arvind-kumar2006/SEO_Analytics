import React from 'react';
import SectionCard from '../common/SectionCard';
import { Search, Flame, TrendingUp, Target } from 'lucide-react';
import type { KeywordAnalysis } from '../../types/seo.types';

interface KeywordSectionProps {
  keywords?: KeywordAnalysis;
}

const KeywordSection: React.FC<KeywordSectionProps> = ({ keywords }) => {
  // Only use fallback if keywords are fully missing (API failure scenario)
  const data = keywords?.primaryKeywords?.length ? keywords : {
    primaryKeywords: [],
    secondaryKeywords: [],
    longTailKeywords: []
  };

  const KeywordPill = ({ text, type }: { text: string, type: 'primary' | 'secondary' | 'longtail' }) => {
    const styles = {
      primary: "bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100 hover:border-brand-300 shadow-[0_1px_2px_rgba(37,99,235,0.05)]",
      secondary: "bg-white text-gray-700 border-gray-200 hover:border-gray-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
      longtail: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 shadow-[0_1px_2px_rgba(16,185,129,0.05)]"
    };

    return (
      <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-default ${styles[type]}`}>
        {text}
      </span>
    );
  };

  return (
    <SectionCard title="AI Keyword Strategy" icon={<Search className="w-5 h-5 text-indigo-500" />}>
      <div className="space-y-6">
        <div>
          <h4 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-brand-500" /> Primary Targets
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {data.primaryKeywords.map((kw, i) => (
              <KeywordPill key={i} text={kw} type="primary" />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" /> Secondary Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.secondaryKeywords.map((kw, i) => (
              <KeywordPill key={i} text={kw} type="secondary" />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-500" /> Long-Tail Opportunities
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.longTailKeywords.map((kw, i) => (
              <KeywordPill key={i} text={kw} type="longtail" />
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default KeywordSection;
