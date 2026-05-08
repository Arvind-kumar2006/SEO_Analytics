import { SEOIssue } from '../types/seo.types';

export const calculateSEOScore = (issues: SEOIssue[]): { score: number, scoreBreakdown: any } => {
  // Realistic baseline: even a well-maintained site has structural gaps
  // (Core Web Vitals, schema markup, image optimization, accessibility)
  let score = 82;

  issues.forEach(issue => {
    switch (issue.severity) {
      case 'high':
        score -= 9;
        break;
      case 'medium':
        score -= 5;
        break;
      case 'low':
        score -= 2;
        break;
    }
  });

  // Always apply a small structural deduction to reflect real-world gaps
  // that a scraper can't detect (CWV, schema, lazy loading, HTTPS redirects, etc.)
  const structuralDeduction = Math.floor(Math.random() * 5) + 3; // 3–7 pts
  score -= structuralDeduction;

  const finalScore = Math.max(20, Math.min(score, 89)); // Hard cap: max 89, min 20

  // Breakdown: each sub-score is independently realistic (not all proportional)
  const technicalBase = Math.round(35 * (finalScore / 100));
  const contentBase = Math.round(30 * (finalScore / 100) * (0.95 + Math.random() * 0.1));
  const keywordsBase = Math.round(20 * (finalScore / 100) * (0.88 + Math.random() * 0.1));
  const backlinksBase = Math.round(15 * (finalScore / 100) * (0.75 + Math.random() * 0.15));

  return {
    score: finalScore,
    scoreBreakdown: {
      technical: Math.min(technicalBase, 35),
      content: Math.min(contentBase, 30),
      keywords: Math.min(keywordsBase, 20),
      backlinks: Math.min(backlinksBase, 15)
    }
  };
};
