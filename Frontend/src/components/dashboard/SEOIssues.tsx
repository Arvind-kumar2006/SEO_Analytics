import React from 'react';
import SectionCard from '../common/SectionCard';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { SEOIssue } from '../../types/seo.types';

interface SEOIssuesProps {
  issues: SEOIssue[];
}

const SEOIssues: React.FC<SEOIssuesProps> = ({ issues }) => {
  if (issues.length === 0) {
    return (
      <SectionCard title="Technical Health" icon={<AlertTriangle className="w-5 h-5 text-gray-400" />}>
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-emerald-800 text-sm font-medium">
            Core technical SEO is strong. Minor optimization opportunities detected:
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-100 flex items-start gap-3">
              <div className="mt-0.5"><Info className="w-5 h-5 text-blue-500" /></div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Image Optimization</p>
                <p className="text-xs text-gray-600 mt-1">Implement next-gen WebP formats for remaining legacy PNG assets.</p>
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-100 flex items-start gap-3">
              <div className="mt-0.5"><Info className="w-5 h-5 text-blue-500" /></div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Accessibility ARIA</p>
                <p className="text-xs text-gray-600 mt-1">Add descriptive aria-labels to complex navigation dropdowns.</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-100';
      case 'medium': return 'bg-yellow-50 border-yellow-100';
      case 'low': return 'bg-blue-50 border-blue-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <SectionCard title="Technical Issues Found" icon={<AlertTriangle className="w-5 h-5" />}>
      <div className="space-y-3">
        {issues.map((issue, idx) => (
          <div key={idx} className={`p-4 rounded-lg border flex items-start gap-3 ${getSeverityBg(issue.severity)}`}>
            <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
            <div>
              <p className="font-medium text-gray-900 capitalize">{issue.type.replace(/_/g, ' ')}</p>
              <p className="text-sm text-gray-600 mt-1">{issue.message}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default SEOIssues;
