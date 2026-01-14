import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';
import { logger } from '../utils/logger';

/**
 * Rate limiter configurations
 */
const rateLimiters = {
  // General API rate limiter
  general: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 100, // Number of requests
    duration: 900, // Per 15 minutes
    blockDuration: 900, // Block for 15 minutes
  }),

  // Strict rate limiter for auth endpoints
  auth: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 5, // Number of requests
    duration: 900, // Per 15 minutes
    blockDuration: 1800, // Block for 30 minutes
  }),

  // Rate limiter for password reset
  passwordReset: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 3, // Number of requests
    duration: 3600, // Per 1 hour
    blockDuration: 3600, // Block for 1 hour
  })
};

/**
 * Rate limiting middleware factory
 */
export const rateLimit = (limiterType: keyof typeof rateLimiters = 'general') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limiter = rateLimiters[limiterType];
      await limiter.consume(req.ip);
      next();
    } catch (rateLimiterRes) {
      const remainingPoints = rateLimiterRes.remainingPoints || 0;
      const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
      const totalHits = rateLimiterRes.totalHits || 0;

      // Set rate limit headers
      res.set({
        'Retry-After': Math.round(msBeforeNext / 1000) || 1,
        'X-RateLimit-Limit': limiter.points,
        'X-RateLimit-Remaining': remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + msBeforeNext).toISOString()
      });

      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        totalHits,
        remainingPoints,
        msBeforeNext,
        limiterType
      });

      const error = new ApiError('Too many requests, please try again later', 429);
      next(error);
    }
  };
};