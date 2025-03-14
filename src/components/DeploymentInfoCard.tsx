
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DeploymentInfoCardProps {
  title: string;
  description?: string;
  status: 'success' | 'warning' | 'error' | 'pending' | 'in-progress';
  progress?: number;
  className?: string;
  children?: React.ReactNode;
}

const DeploymentInfoCard: React.FC<DeploymentInfoCardProps> = ({
  title,
  description,
  status,
  progress,
  className,
  children,
}) => {
  const statusColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    pending: 'bg-gray-400',
    'in-progress': 'bg-blue-500',
  };

  const statusText = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    pending: 'Pending',
    'in-progress': 'In Progress',
  };

  return (
    <Card className={cn("transition-all duration-300", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={statusColors[status]}>{statusText[status]}</Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {typeof progress === 'number' && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default DeploymentInfoCard;
