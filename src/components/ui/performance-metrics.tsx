import React from 'react';
import { Clock, FileText, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetricsProps {
  fileCount: number;
  totalSize: number;
  processingTime?: number;
  isProcessing?: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  fileCount,
  totalSize,
  processingTime,
  isProcessing = false
}) => {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getPerformanceLevel = (fileCount: number, size: number) => {
    if (fileCount > 100 || size > 100 * 1024 * 1024) return 'high';
    if (fileCount > 50 || size > 50 * 1024 * 1024) return 'medium';
    return 'low';
  };

  const performanceLevel = getPerformanceLevel(fileCount, totalSize);
  
  const performanceColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const performanceLabels = {
    low: 'Léger',
    medium: 'Modéré',
    high: 'Intensif'
  };

  if (fileCount === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Zap size={16} />
          Métriques de performance
        </h4>
        <Badge 
          className={performanceColors[performanceLevel]}
          variant="outline"
        >
          {performanceLabels[performanceLevel]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <FileText size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">Fichiers:</span>
          <span className="font-medium">{fileCount}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">Taille:</span>
          <span className="font-medium">{formatSize(totalSize)}</span>
        </div>

        {processingTime && (
          <div className="col-span-2 flex items-center space-x-2">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Temps de traitement:</span>
            <span className="font-medium">{processingTime.toFixed(2)}s</span>
          </div>
        )}
      </div>

      {performanceLevel === 'high' && (
        <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-orange-700 dark:text-orange-300">
            ⚠️ Volume important détecté. Le traitement peut prendre plus de temps.
          </p>
        </div>
      )}

      {isProcessing && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            🔄 Optimisation en cours pour de meilleures performances...
          </p>
        </div>
      )}
    </Card>
  );
};
