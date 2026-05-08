import { generateCompletion } from './openaiService';
import { executionPrompt } from '../prompts/executionPrompt';
import { ExecutionContent } from '../types/seo.types';

export const generateExecutionContent = async (
  organizationName: string,
  services: string,
  keywords: string,
  targetAudience: string,
  industry: string = 'local services',
  geography: string = 'your city'
): Promise<ExecutionContent> => {
  const prompt = executionPrompt(organizationName, services, keywords, targetAudience, industry, geography);
  const responseText = await generateCompletion(prompt);

  if (!responseText) {
    throw new Error('Failed to generate execution content');
  }

  return JSON.parse(responseText) as ExecutionContent;
};
