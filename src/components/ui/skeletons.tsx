import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const FileZipperSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* File Drop Zone Skeleton */}
      <Card className="p-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </Card>

      {/* Mode Selection Skeleton */}
      <Card className="p-4">
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="space-y-3">
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-3 w-64 mt-1 ml-6" />
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-3 w-56 mt-1 ml-6" />
          </Card>
        </div>
      </Card>

      {/* Password Section Skeleton */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </Card>

      {/* Button Skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-12 w-64 rounded-lg" />
      </div>
    </div>
  );
};

export const ZipDecryptorSkeleton: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Warning Card Skeleton */}
          <Card className="p-4">
            <div className="flex items-start space-x-2">
              <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </Card>

          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Card>
  );
};
