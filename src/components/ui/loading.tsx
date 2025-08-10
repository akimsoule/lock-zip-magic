import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLoading } from '@/hooks/use-loading-hooks';
import { cn } from '@/lib/utils';

interface GlobalLoadingProps {
  className?: string;
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({ className }) => {
  const { loading } = useLoading();

  if (!loading.isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      "flex items-center justify-center",
      className
    )}>
      <Card className="p-6 max-w-md w-full mx-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Loader2 size={24} className="animate-spin text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {loading.operation || "Chargement en cours..."}
              </h3>
              <p className="text-sm text-muted-foreground">
                Veuillez patienter
              </p>
            </div>
          </div>
          
          {loading.progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="text-foreground font-medium">{loading.progress}%</span>
              </div>
              <Progress value={loading.progress} className="w-full" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Composant inline plus simple pour le loading local
interface InlineLoadingProps {
  isLoading: boolean;
  text?: string;
  progress?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  isLoading, 
  text = "Chargement...", 
  progress,
  className,
  size = 'md'
}) => {
  if (!isLoading) return null;

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  }[size];

  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }[size];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Loader2 size={iconSize} className="animate-spin text-primary" />
      <span className={cn("font-medium text-foreground", textSize)}>
        {text}
      </span>
      {progress !== undefined && progress > 0 && (
        <span className={cn("text-muted-foreground", textSize)}>
          ({progress}%)
        </span>
      )}
    </div>
  );
};
