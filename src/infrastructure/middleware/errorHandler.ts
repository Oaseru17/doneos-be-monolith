import { Request, Response, NextFunction } from 'express';
import LOG from '../../library/logging';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  LOG.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message
    });
    return;
  }

  // Handle validation errors from Joi
  if (err.name === 'ValidationError') {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: err.message
    });
    return;
  }

  // Handle mongoose validation errors
  if (err.name === 'MongooseError') {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: err.message
    });
    return;
  }

  // Default error
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  });
}; 