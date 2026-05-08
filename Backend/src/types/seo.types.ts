export interface ScrapedWebsiteData {
  title: string;
  metaDescription: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  paragraphs: string[];
  imageAlts: string[];
  contentLength: number;
}

export interface SEOIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
}

export interface SEORecommendation {
  category: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export interface KeywordAnalysis {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
}

export interface CompetitorAnalysis {
  keywordOverlap: string[];
  headingOverlap: string[];
  contentFocus: string;
}

export interface ExecutionContent {
  linkedinPost: string;
  outreachEmail: string;
  blogCommentDraft: string;
  socialMediaCaption: string;
}

export interface ScoreBreakdown {
  technical: number;
  content: number;
  keywords: number;
  backlinks: number;
}

export interface SEOReportResponse {
  organizationId: string;
  scrapedData: ScrapedWebsiteData;
  seoScore: number;
  scoreBreakdown: ScoreBreakdown;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  keywords: KeywordAnalysis;
  competitorAnalysis?: CompetitorAnalysis;
  executionAssistant: ExecutionContent;
}