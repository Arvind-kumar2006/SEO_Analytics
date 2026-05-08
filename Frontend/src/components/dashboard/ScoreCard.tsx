import React from 'react';
import SectionCard from '../common/SectionCard';
import { Target, TrendingUp, Search, Link as LinkIcon, FileText } from 'lucide-react';
import type { ScoreBreakdown } from '../../types/seo.types';

interface ScoreCardProps {
  score: number;
  breakdown?: ScoreBreakdown;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, breakdown }) => {
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-green-500';
    if (s >= 70) return 'text-blue-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 85) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Average';
    return 'Poor';
  };

  // Use real backend breakdown if available, otherwise derive from score as fallback
  const baseFactor = score / 100;
  const resolvedBreakdown = [
    {
      name: 'Technical SEO',
      score: breakdown?.technical ?? Math.round(35 * baseFactor),
      max: 35,
      icon: <Target className="w-4 h-4" />
    },
    {
      name: 'Content Quality',
      score: breakdown?.content ?? Math.round(30 * baseFactor * 1.05),
      max: 30,
      icon: <FileText className="w-4 h-4" />
    },
    {
      name: 'Keyword Optimization',
      score: breakdown?.keywords ?? Math.round(20 * baseFactor * 0.9),
      max: 20,
      icon: <Search className="w-4 h-4" />
    },
    {
      name: 'Backlink Potential',
      score: breakdown?.backlinks ?? Math.round(15 * baseFactor * 0.8),
      max: 15,
      icon: <LinkIcon className="w-4 h-4" />
    }
  ];

  return (
    <SectionCard title="SEO Health Score" icon={<TrendingUp className="w-5 h-5 text-brand-600" />}>
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative mb-2">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              className="text-gray-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
            />
            <circle
              className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
              strokeWidth="10"
              strokeDasharray={70 * 2 * Math.PI}
              strokeDashoffset={70 * 2 * Math.PI - (score / 100) * 70 * 2 * Math.PI}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">{getScoreLabel(score)}</span>
          </div>
        </div>

        <div className="w-full mt-6 space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Score Breakdown</h4>
          {resolvedBreakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreColor((item.score / item.max) * 100)}`}
                    style={{ width: `${Math.min((item.score / item.max) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700 w-8 text-right">{item.score}/{item.max}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

export default ScoreCard;
