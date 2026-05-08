import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';
import { APIResponse } from '../types/api.types';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  const response: APIResponse = {
    success: false,
    message,
  };

  res.status(statusCode).json(response);
};
