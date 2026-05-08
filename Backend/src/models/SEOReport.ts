import mongoose, { Document, Schema } from 'mongoose';

export interface ISEOReport extends Document {
  organizationId: mongoose.Types.ObjectId;
  scrapedData: {
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
  };
  seoScore: number;
  scoreBreakdown: {
    technical: number;
    content: number;
    keywords: number;
    backlinks: number;
  };
  issues: {
    type: string;
    severity: string;
    message: string;
  }[];
  recommendations: {
    category: string;
    suggestion: string;
    impact: string;
  }[];
  keywords: {
    primaryKeywords: string[];
    secondaryKeywords: string[];
    longTailKeywords: string[];
  };
  competitorAnalysis?: {
    keywordOverlap: string[];
    headingOverlap: string[];
    contentFocus: string;
  };
  executionAssistant: {
    linkedinPost: string;
    outreachEmail: string;
    blogCommentDraft: string;
    socialMediaCaption: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SEOReportSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    scrapedData: { type: Schema.Types.Mixed, required: true },
    seoScore: { type: Number, required: true },
    scoreBreakdown: {
      technical: { type: Number, required: true },
      content: { type: Number, required: true },
      keywords: { type: Number, required: true },
      backlinks: { type: Number, required: true }
    },
    issues: [{ type: Schema.Types.Mixed, required: true }],
    recommendations: [{ type: Schema.Types.Mixed, required: true }],
    keywords: { type: Schema.Types.Mixed, required: true },
    competitorAnalysis: { type: Schema.Types.Mixed },
    executionAssistant: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISEOReport>('SEOReport', SEOReportSchema);
