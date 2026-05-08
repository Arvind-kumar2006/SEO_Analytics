import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { APIResponse } from '../types/api.types';

export const notFoundMiddleware = (req: Request, res: Response): void => {
  const response: APIResponse = {
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  };

  res.status(HTTP_STATUS.NOT_FOUND).json(response);
};
