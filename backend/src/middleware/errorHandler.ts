import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { logger } from '../utils/logger';
import { ErrorResponse } from '../types';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler for Joi validation errors
 */
const handleValidationError = (error: ValidationError): ApiError => {
  const message = error.details.map(detail => detail.message).join(', ');
  return new ApiError(`Validation Error: ${message}`, 400);
};

/**
 * Error handler for Sequelize errors
 */
const handleSequelizeError = (error: any): ApiError => {
  switch (error.name) {
    case 'SequelizeValidationError':
      const message = error.errors.map((err: any) => err.message).join(', ');
      return new ApiError(`Database Validation Error: ${message}`, 400);
    case 'SequelizeUniqueConstraintError':
      return new ApiError('Resource already exists', 409);
    case 'SequelizeForeignKeyConstraintError':
      return new ApiError('Invalid reference to related resource', 400);
    case 'SequelizeConnectionError':
      return new ApiError('Database connection error', 503);
    default:
      return new ApiError('Database error occurred', 500);
  }
};

/**
 * Error handler for JWT errors
 */
const handleJWTError = (error: any): ApiError => {
  switch (error.name) {
    case 'JsonWebTokenError':
      return new ApiError('Invalid token', 401);
    case 'TokenExpiredError':
      return new ApiError('Token expired', 401);
    case 'NotBeforeError':
      return new ApiError('Token not active', 401);
    default:
      return new ApiError('Authentication error', 401);
  }
};

/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let apiError: ApiError;

  // Handle different types of errors
  if (error instanceof ApiError) {
    apiError = error;
  } else if (error.name === 'ValidationError') {
    apiError = handleValidationError(error as ValidationError);
  } else if (error.name?.startsWith('Sequelize')) {
    apiError = handleSequelizeError(error);
  } else if (error.name?.includes('JsonWebToken') || error.name?.includes('Token')) {
    apiError = handleJWTError(error);
  } else {
    // Generic error handling
    apiError = new ApiError(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      500,
      false
    );
  }

  // Log error details
  const requestId = (req as any).requestId || 'unknown';
  logger.error('Error occurred', {
    requestId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: apiError.statusCode,
      isOperational: apiError.isOperational
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    message: apiError.message,
    error: error.name,
    timestamp: new Date().toISOString()
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  // Send error response
  res.status(apiError.statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};