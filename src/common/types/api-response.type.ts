/**
 * API Response Types
 * 
 * Define estructuras estándar para respuestas de API.
 * Se usan en Swagger decorators y respuestas de controladores.
 * 
 * Ver: api_contracts.md - Sección Response Format
 */

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
    currentPage: number;
  };
  timestamp: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
