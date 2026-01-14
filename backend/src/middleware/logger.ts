import morgan from 'morgan';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom Morgan token for response time in milliseconds
 */
morgan.token('response-time-ms', (req: Request, res: Response) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

/**
 * Custom Morgan token for request ID (if available)
 */
morgan.token('request-id', (req: Request) => {
  return (req as any).requestId || '-';
});

/**
 * Custom Morgan format for structured logging
 */
const morganFormat = process.env.NODE_ENV === 'production'
  ? 'combined'
  : ':method :url :status :res[content-length] - :response-time ms';

/**
 * Morgan stream configuration to use Winston logger
 */
const stream = {
  write: (message: string) => {
    // Remove trailing newline
    const cleanMessage = message.trim();
    logger.info(cleanMessage, { type: 'http' });
  }
};

/**
 * HTTP request logging middleware
 */
export const requestLogger = morgan(morganFormat, {
  stream,
  skip: (req: Request, res: Response) => {
    // Skip logging for health check endpoint in production
    if (process.env.NODE_ENV === 'production' && req.path === '/health') {
      return true;
    }
    return false;
  }
});

/**
 * Custom request logging middleware for additional context
 */
export const customRequestLogger = (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();
  
  // Generate request ID
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  (req as any).requestId = requestId;
  
  // Log request start
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', duration);
    
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    });
    
    originalEnd.call(this, chunk, encoding);
  };

  next();
};