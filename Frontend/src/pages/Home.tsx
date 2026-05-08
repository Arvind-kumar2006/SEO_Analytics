import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import SectionCard from '../components/common/SectionCard';
import OrganizationForm from '../components/forms/OrganizationForm';
import LoadingSteps from '../components/dashboard/LoadingSteps';
import type { OrganizationInput } from '../types/seo.types';
import { createOrganization, runSEOAnalysis } from '../services/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const simulateProgress = () => {
    setCurrentStep(1);                             // Organization saved — immediate
    setTimeout(() => setCurrentStep(2), 2000);    // Scraping — 2s
    setTimeout(() => setCurrentStep(3), 7000);    // Technical SEO — 7s
    setTimeout(() => setCurrentStep(4), 14000);   // Keywords — 14s
    setTimeout(() => setCurrentStep(5), 22000);   // AI Recommendations — 22s
  };

  const handleFormSubmit = async (data: OrganizationInput) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // We simulate step progress for UX since the backend does it all in one API call
      simulateProgress();

      // 1. Create Organization
      const org = await createOrganization(data);

      // 2. Run Full Analysis (Backend does Scraping, Analysis, AI generation and saves Report)
      const report = await runSEOAnalysis(org._id);

      setCurrentStep(6); // Done
      
      // Navigate to report
      setTimeout(() => {
        navigate(`/report/${report._id}`);
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to complete analysis. Please try again.');
      setIsAnalyzing(false);
      setCurrentStep(0);
    }
  };

  if (isAnalyzing) {
    return <LoadingSteps currentStep={currentStep} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="text-center max-w-2xl mx-auto py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" /> AI-Powered
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          SEO Analysis & Execution
        </h1>
        <p className="text-base text-gray-500 leading-relaxed">
          Enter your organization's details to instantly generate a comprehensive technical SEO audit, AI keyword strategy, and ready-to-publish execution drafts.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <SectionCard 
          title="Organization Profile" 
          icon={<Building2 className="w-5 h-5 text-gray-400" />}
        >
          <OrganizationForm onSubmit={handleFormSubmit} isLoading={isAnalyzing} />
        </SectionCard>
      </div>
    </div>
  );
};

export default Home;
