/**
 * Pagination Types
 * 
 * Define estructuras para manejo de paginación en endpoints de lista.
 * Se usan en DTOs y servicios.
 * 
 * Ver: api_contracts.md - Sección Pagination
 */

export class PaginationParams {
  limit?: number = 10;
  offset?: number = 0;
}

export class ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  pages: number;
  currentPage: number;
}
