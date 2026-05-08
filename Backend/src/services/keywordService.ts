import { generateCompletion } from './openaiService';
import { keywordPrompt } from '../prompts/keywordPrompt';
import { KeywordAnalysis } from '../types/seo.types';

export const generateKeywords = async (
  organizationData: string,
  scrapedContent: string
): Promise<KeywordAnalysis> => {
  const prompt = keywordPrompt(organizationData, scrapedContent);
  const responseText = await generateCompletion(prompt);

  if (!responseText) {
    throw new Error('Failed to generate keywords');
  }

  return JSON.parse(responseText) as KeywordAnalysis;
};
