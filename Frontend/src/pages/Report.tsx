import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, Globe, Download, Sparkles } from 'lucide-react';
import { getSEOReport } from '../services/api';
import type { SEOReport as ReportType } from '../types/seo.types';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ScoreCard from '../components/dashboard/ScoreCard';
import SEOIssues from '../components/dashboard/SEOIssues';
import KeywordSection from '../components/dashboard/KeywordSection';
import Recommendations from '../components/dashboard/Recommendations';
import CompetitorAnalysis from '../components/dashboard/CompetitorAnalysis';
import ExecutionAssistant from '../components/dashboard/ExecutionAssistant';

const Report: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!reportId) return;
        const data = await getSEOReport(reportId);
        setReport(data);
      } catch (err: any) {
        setError('Failed to load SEO report. Please ensure the ID is correct.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) return <Loader fullScreen message="Compiling SEO Dashboard..." />;

  if (error || !report) {
    return (
      <EmptyState 
        icon={<RefreshCcw className="w-8 h-8" />}
        title="Report Not Found"
        description={error || "We couldn't find the SEO report you're looking for."}
        action={
          <Link to="/" className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            Go back to Home
          </Link>
        }
      />
    );
  }

  // Handle case where organization is populated
  const org = typeof report.organizationId !== 'string' ? report.organizationId : null;
  const orgName = org?.name || 'Organization';
  const competitors = org?.competitors || [];


  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div>
          <Link to="/" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-brand-600 mb-3 transition-colors uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> New Analysis
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center text-xl font-bold text-brand-600">
              {orgName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {orgName}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {typeof report.organizationId !== 'string' ? report.organizationId.website.replace(/^https?:\/\//, '') : 'Website'}</span>
                <span>•</span>
                <span>{typeof report.organizationId !== 'string' ? report.organizationId.industry : 'Industry'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start mt-2 md:mt-0 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition-all hover:shadow"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Completion Timeline Component */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-x-6 gap-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-400" /> AI Insights:
        </span>
        <div className="text-sm font-medium text-gray-700 flex-1">
          {orgName} demonstrates strong baseline authority in {org?.targetGeography || 'your market'}. Mobile Core Web Vitals and long-tail {org?.industry || 'industry'}-specific semantic targeting present the biggest growth opportunities.
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - 4/12 */}
        <div className="lg:col-span-4 space-y-6">
          <ScoreCard score={report.seoScore} breakdown={report.scoreBreakdown} />
          <SEOIssues issues={report.issues} />
        </div>
        
        {/* Right Column - 8/12 */}
        <div className="lg:col-span-8 space-y-6">
          <KeywordSection keywords={report.keywords} />
          <Recommendations recommendations={report.recommendations} />
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="w-full space-y-6">
        <ExecutionAssistant
          content={report.executionAssistant}
          orgName={orgName}
          industry={org?.industry}
          services={org?.services}
          targetAudience={org?.targetAudience}
          geography={org?.targetGeography}
        />
        
        {competitors.length > 0 && (
          <CompetitorAnalysis analysis={report.competitorAnalysis} competitorUrls={competitors} />
        )}
      </div>
    </div>
  );
};

export default Report;
