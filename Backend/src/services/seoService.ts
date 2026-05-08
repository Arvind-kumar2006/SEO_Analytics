import { ScrapedWebsiteData, SEOIssue, SEORecommendation } from '../types/seo.types';
import { calculateSEOScore } from '../utils/calculateSEOScore';

export const analyzeTechnicalSEO = (scrapedData: ScrapedWebsiteData) => {
  const issues: SEOIssue[] = [];

  // Title issues
  if (!scrapedData.title) {
    issues.push({ type: 'missing_title', severity: 'high', message: 'Missing page title' });
  }

  // Meta description issues
  if (!scrapedData.metaDescription) {
    issues.push({ type: 'missing_meta_description', severity: 'high', message: 'Missing meta description' });
  }

  // H1 issues
  if (scrapedData.headings.h1.length === 0) {
    issues.push({ type: 'missing_h1', severity: 'high', message: 'Missing H1 heading' });
  } else if (scrapedData.headings.h1.length > 1) {
    issues.push({ type: 'multiple_h1', severity: 'medium', message: 'Multiple H1 headings found' });
  }

  // No headings
  if (
    scrapedData.headings.h1.length === 0 &&
    scrapedData.headings.h2.length === 0 &&
    scrapedData.headings.h3.length === 0
  ) {
    issues.push({ type: 'no_headings', severity: 'high', message: 'No headings found on the page' });
  }

  // Low content
  if (scrapedData.contentLength < 300) {
    issues.push({ type: 'low_content', severity: 'medium', message: 'Low content length (less than 300 characters)' });
  }

  // Missing image alts
  if (scrapedData.imageAlts.length === 0) {
    // We only check if no alts are present, an advanced check would compare img count to alt count
    issues.push({ type: 'missing_image_alts', severity: 'low', message: 'Missing or no image alt tags found' });
  }

  const seoScore = calculateSEOScore(issues);

  return { issues, seoScore };
};
