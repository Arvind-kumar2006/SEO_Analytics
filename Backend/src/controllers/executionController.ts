import { Request, Response } from 'express';
import { generateExecutionContent } from '../services/executionService';
import { HTTP_STATUS } from '../constants';
import { APIResponse } from '../types/api.types';
import Organization from '../models/Organization';

export const generateExecution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, customPrompt } = req.body;
    
    if (!organizationId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'organizationId is required' });
      return;
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Organization not found' });
      return;
    }

    // You could mix customPrompt here or let the system generate from base defaults
    // For this implementation, we use our existing service with base parameters
    const content = await generateExecutionContent(
      organization.name,
      organization.services.join(', '),
      organization.currentKeywords.length
        ? organization.currentKeywords.join(', ')
        : `${organization.services[0]} in ${organization.targetGeography}`,
      organization.targetAudience,
      organization.industry,
      organization.targetGeography
    );

    const response: APIResponse = {
      success: true,
      message: 'Execution content generated successfully',
      data: content
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error: any) {
    console.error('Execution Generation Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};
