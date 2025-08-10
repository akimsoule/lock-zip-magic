import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  icon,
  loadingIcon,
  children,
  disabled,
  className,
  ...props
}) => {
  const defaultLoadingIcon = <Loader2 size={16} className="animate-spin" />;
  
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn(
        "transition-all duration-200",
        isLoading && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          {loadingIcon || defaultLoadingIcon}
          {loadingText && (
            <span className="ml-2">{loadingText}</span>
          )}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
};
