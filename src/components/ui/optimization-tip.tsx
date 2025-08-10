import React from 'react';
import { Lightbulb, Zap, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OptimizationTipProps {
  fileCount: number;
  totalSize: number;
  className?: string;
}

export const OptimizationTip: React.FC<OptimizationTipProps> = ({
  fileCount,
  totalSize,
  className
}) => {
  const getTips = () => {
    const tips = [];
    
    if (fileCount > 100) {
      tips.push({
        icon: <Zap size={16} />,
        title: "Volume important détecté",
        description: "Le traitement par chunks optimise les performances pour les gros volumes.",
        type: "info" as const
      });
    }
    
    if (totalSize > 200 * 1024 * 1024) {
      tips.push({
        icon: <Clock size={16} />,
        title: "Taille importante",
        description: "Le système utilise un traitement mémoire optimisé pour éviter les dépassements.",
        type: "warning" as const
      });
    }
    
    if (fileCount > 50 && totalSize < 100 * 1024 * 1024) {
      tips.push({
        icon: <CheckCircle size={16} />,
        title: "Configuration optimale",
        description: "Bon équilibre entre nombre de fichiers et taille totale.",
        type: "success" as const
      });
    }
    
    if (fileCount <= 10 && totalSize < 50 * 1024 * 1024) {
      tips.push({
        icon: <CheckCircle size={16} />,
        title: "Traitement rapide",
        description: "Volume léger, traitement instantané garanti.",
        type: "success" as const
      });
    }

    return tips;
  };

  const tips = getTips();
  
  if (tips.length === 0) return null;

  const getCardColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20';
      case 'info':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20';
      default:
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={className}>
      {tips.map((tip, index) => (
        <Card key={index} className={`p-4 ${getCardColor(tip.type)}`}>
          <div className="flex items-start space-x-3">
            <div className={`mt-0.5 ${getTextColor(tip.type)}`}>
              {tip.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-medium ${getTextColor(tip.type)}`}>
                  {tip.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  <Lightbulb size={12} className="mr-1" />
                  Optimisation
                </Badge>
              </div>
              <p className={`text-sm ${getTextColor(tip.type)}`}>
                {tip.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
