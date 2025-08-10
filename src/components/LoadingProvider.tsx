import React from 'react';
import { LoadingContext, LoadingState } from '../hooks/use-loading-hooks';

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoadingState] = React.useState<LoadingState>({
    isLoading: false,
    operation: null,
    progress: 0,
  });

  const setLoading = React.useCallback((isLoading: boolean, operation?: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading,
      operation: operation || null,
      progress: isLoading ? 0 : prev.progress,
    }));
  }, []);

  const setProgress = React.useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100),
    }));
  }, []);

  const updateProgress = React.useCallback((increment: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(prev.progress + increment, 100),
    }));
  }, []);

  const resetLoading = React.useCallback(() => {
    setLoadingState({
      isLoading: false,
      operation: null,
      progress: 0,
    });
  }, []);

  const value = React.useMemo(() => ({
    loading,
    setLoading,
    setProgress,
    updateProgress,
    resetLoading,
  }), [loading, setLoading, setProgress, updateProgress, resetLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
