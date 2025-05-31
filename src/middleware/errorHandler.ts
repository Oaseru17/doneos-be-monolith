import { Request, Response, NextFunction } from 'express';
import LOG from '../library/logging';

/**
 * Global error handling middleware
 * @param err Error object
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  LOG.error('Error:', err);

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