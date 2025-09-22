import { useState, useCallback, useEffect } from 'react';
import type { AsyncState, AsyncDataResult } from '../lib/types/api';
import { ApiError } from '../lib/types/api';

/**
 * Custom hook for handling async data fetching with proper error handling
 * Follows the discriminated union pattern for type-safe state management
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>
): AsyncDataResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  const execute = useCallback(async () => {
    setState({ status: 'loading' });
    
    try {
      const data = await fetchFn();
      setState({ status: 'success', data });
    } catch (error) {
      const apiError = error instanceof ApiError 
        ? error 
        : new ApiError(
            error instanceof Error ? error.message : 'Unknown error',
            'UNKNOWN_ERROR'
          );
      
      setState({ status: 'error', error: apiError });
    }
  }, [fetchFn]);

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  return { state, execute, reset };
}

/**
 * Hook for data that should be fetched immediately and optionally refetched
 */
export function useAsyncDataWithPolling<T>(
  fetchFn: () => Promise<T>,
  pollingInterval?: number
): AsyncDataResult<T> & { refetch: () => Promise<void> } {
  const { state, execute, reset } = useAsyncData(fetchFn);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  // Auto-execute on mount
  useEffect(() => {
    execute();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set up polling if interval provided
  useEffect(() => {
    if (!pollingInterval) return;

    const interval = setInterval(execute, pollingInterval);
    return () => clearInterval(interval);
  }, [execute, pollingInterval]);

  return { state, execute, reset, refetch };
}
