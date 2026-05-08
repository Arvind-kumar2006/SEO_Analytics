import { generateCompletion } from './openaiService';
import { recommendationPrompt } from '../prompts/recommendationPrompt';
import { SEORecommendation } from '../types/seo.types';

export const generateRecommendations = async (
  seoIssues: string,
  keywords: string,
  industry: string
): Promise<SEORecommendation[]> => {
  const prompt = recommendationPrompt(seoIssues, keywords, industry);
  const responseText = await generateCompletion(prompt);

  if (!responseText) {
    throw new Error('Failed to generate recommendations');
  }

  const parsed = JSON.parse(responseText);
  return Array.isArray(parsed) ? parsed : (parsed.recommendations || []);
};
