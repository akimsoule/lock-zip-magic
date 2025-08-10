import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface FileListSkeletonProps {
  count?: number;
}

export const FileListSkeleton: React.FC<FileListSkeletonProps> = ({ count = 5 }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Skeleton className="w-5 h-5 rounded" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-4 w-full max-w-xs" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        ))}
      </div>
    </Card>
  );
};
