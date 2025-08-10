import React from 'react';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = React.useState<AsyncState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  });

  const execute = React.useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, isLoading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, isLoading: false, error: err });
      onError?.(err);
      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, isLoading: false, error: null }),
  };
}

// Hook pour les opérations avec retry automatique
export function useAsyncWithRetry<T>(
  asyncFunction: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
) {
  const [retryCount, setRetryCount] = React.useState(0);
  
  const asyncWithRetry = React.useCallback(async (): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFunction();
        setRetryCount(0); // Reset on success
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        setRetryCount(attempt + 1);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
    
    throw lastError!;
  }, [asyncFunction, maxRetries, retryDelay]);

  const asyncState = useAsync(asyncWithRetry, { immediate: false });

  return {
    ...asyncState,
    retryCount,
    canRetry: retryCount <= maxRetries,
  };
}
