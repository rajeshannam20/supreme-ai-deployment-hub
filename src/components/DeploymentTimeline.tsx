
import React from 'react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DeploymentTimeline = () => {
  const { deploymentSteps, currentStep } = useDeployment();

  const getStepIcon = (status: string, id: string) => {
    if (status === 'success') {
      return <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <Check className="h-6 w-6 text-green-500" />
      </div>;
    } else if (status === 'in-progress') {
      return <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      </div>;
    } else if (status === 'error') {
      return <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>;
    } else {
      return <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Clock className="h-6 w-6 text-gray-500" />
      </div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      default:
        return <Badge className="bg-gray-500">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {deploymentSteps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isComplete = step.status === 'success';
            
            return (
              <div key={step.id} className={`relative flex ${index < deploymentSteps.length - 1 ? 'pb-8' : ''}`}>
                {/* Connecting line */}
                {index < deploymentSteps.length - 1 && (
                  <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                )}
                
                {/* Step icon */}
                <div className="z-10 mr-4">{getStepIcon(step.status, step.id)}</div>
                
                {/* Step content */}
                <div className={`flex-1 ${isActive ? 'bg-secondary/30 p-4 rounded-lg -m-4' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{step.title}</h3>
                    {getStatusBadge(step.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  
                  {(step.status === 'in-progress' || step.status === 'success') && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <Progress value={step.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentTimeline;
