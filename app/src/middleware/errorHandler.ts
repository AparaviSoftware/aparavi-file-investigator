import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

// Custom error class
export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.status : 500;

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'An error occurred processing your request';

  const response: ErrorResponse = {
    error: true,
    message,
    ...(isAppError && err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(status).json(response);
}

// 404 handler
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found',
    path: req.url
  });
}