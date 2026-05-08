import { Request, Response } from 'express';
import Organization from '../models/Organization';
import { organizationSchema } from '../validators/organizationValidator';
import { HTTP_STATUS } from '../constants';
import { APIResponse } from '../types/api.types';

export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = organizationSchema.parse(req.body);
    
    const organization = await Organization.create(validatedData);
    
    const response: APIResponse = {
      success: true,
      message: 'Organization created successfully',
      data: organization
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation Error',
        data: error.errors
      });
      return;
    }
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

export const getOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const organization = await Organization.findById(req.params.id);
    
    if (!organization) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Organization not found'
      });
      return;
    }
    
    const response: APIResponse = {
      success: true,
      message: 'Organization retrieved successfully',
      data: organization
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};
