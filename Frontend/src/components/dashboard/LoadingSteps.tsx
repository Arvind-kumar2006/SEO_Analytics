import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';

interface LoadingStepsProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Organization Saved', detail: 'Profile stored in database' },
  { id: 2, name: 'Scraping Website', detail: 'Extracting headings, meta, and content' },
  { id: 3, name: 'Technical SEO Analysis', detail: 'Detecting issues and scoring signals' },
  { id: 4, name: 'AI Keyword Strategy', detail: 'Generating local intent keywords' },
  { id: 5, name: 'AI Recommendations', detail: 'Building your execution plan' },
];


const LoadingSteps: React.FC<LoadingStepsProps> = ({ currentStep }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalEstimate = 30;
  const progressPct = Math.min(Math.round((elapsed / totalEstimate) * 100), 95);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3 mb-1">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h2 className="text-lg font-bold">Running AI Analysis</h2>
          </div>
          <p className="text-brand-100 text-sm">
            Scraping, scoring, and generating your SEO strategy...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-5">
          <div className="flex justify-between text-xs text-gray-500 font-medium mb-1.5">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">~{Math.max(totalEstimate - elapsed, 0)}s remaining</p>
        </div>

        {/* Steps */}
        <div className="px-6 py-4 space-y-3">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-brand-50 border border-brand-100'
                    : isCompleted
                    ? 'bg-gray-50'
                    : 'opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold leading-tight ${
                      isCurrent ? 'text-brand-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {step.name}
                  </p>
                  {(isCurrent || isCompleted) && (
                    <p className="text-xs text-gray-400 mt-0.5">{step.detail}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-6 pb-5">
          <p className="text-center text-xs text-gray-400">
            AI-generated content will require human review before publishing
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSteps;
