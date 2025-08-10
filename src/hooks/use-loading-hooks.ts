import React from 'react';

interface LoadingState {
  isLoading: boolean;
  operation: string | null;
  progress: number;
}

interface LoadingContextType {
  loading: LoadingState;
  setLoading: (loading: boolean, operation?: string) => void;
  setProgress: (progress: number) => void;
  updateProgress: (increment: number) => void;
  resetLoading: () => void;
}

const LoadingContext = React.createContext<LoadingContextType | null>(null);

// Hook principal pour accéder au contexte de loading
export function useLoading() {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Hook pour créer un loader avec nettoyage automatique
export function useOperation(operationName: string) {
  const { setLoading, setProgress, resetLoading } = useLoading();

  const startOperation = React.useCallback(() => {
    setLoading(true, operationName);
  }, [setLoading, operationName]);

  const finishOperation = React.useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      resetLoading();
    }, 500);
  }, [setProgress, resetLoading]);

  const failOperation = React.useCallback(() => {
    resetLoading();
  }, [resetLoading]);

  return {
    startOperation,
    finishOperation,
    failOperation,
    setProgress,
  };
}

export { LoadingContext };
export type { LoadingState, LoadingContextType };
