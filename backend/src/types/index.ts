import { Request } from 'express';

/**
 * Custom request interface extending Express Request
 * Includes user information for authenticated routes
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  stack?: string;
  timestamp: string;
}

/**
 * Health check response format
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

/**
 * JWT payload interface
 */
export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}