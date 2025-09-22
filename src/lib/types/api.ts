// Common API types and error handling patterns

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: string;
  } | null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility type for async state management
export type AsyncState<T, E = ApiError> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

// Generic async data hook result
export interface AsyncDataResult<T, E = ApiError> {
  state: AsyncState<T, E>;
  execute: () => Promise<void>;
  reset: () => void;
}

// Database entities with common fields
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Type guard for checking if response has error
export function hasError<T>(response: SupabaseResponse<T>): response is SupabaseResponse<T> & { error: NonNullable<SupabaseResponse<T>['error']> } {
  return response.error !== null;
}

// Helper to throw ApiError from Supabase response
export function throwIfError<T>(response: SupabaseResponse<T>): asserts response is SupabaseResponse<T> & { error: null } {
  if (hasError(response)) {
    throw new ApiError(
      response.error.message,
      response.error.code,
      undefined,
      response.error.details
    );
  }
}
