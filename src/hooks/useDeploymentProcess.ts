
import { useState } from 'react';
import { toast } from 'sonner';
import { DeploymentStep } from '../types/deployment';

interface UseDeploymentProcessProps {
  deploymentSteps: DeploymentStep[];
  isConnected: boolean;
  updateStep: (stepId: string, update: Partial<DeploymentStep>) => void;
  setCurrentStep: (stepId: string) => void;
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const useDeploymentProcess = ({
  deploymentSteps,
  isConnected,
  updateStep,
  setCurrentStep,
  connectToCluster,
  addLog
}: UseDeploymentProcessProps) => {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Simulate running a step
  const runStep = async (stepId: string): Promise<boolean> => {
    setCurrentStep(stepId);
    updateStep(stepId, { status: 'in-progress', progress: 10 });
    addLog(`Starting step: ${stepId}`, 'info');
    
    // Simulate step progress
    for (let progress = 20; progress <= 100; progress += 20) {
      if (!isDeploying) {
        updateStep(stepId, { status: 'error', progress: progress - 20 });
        addLog(`Step ${stepId} cancelled`, 'warning');
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep(stepId, { progress });
      addLog(`${stepId}: Progress ${progress}%`, 'info');
    }
    
    updateStep(stepId, { status: 'success', progress: 100 });
    addLog(`Completed step: ${stepId}`, 'success');
    return true;
  };

  // Start the full deployment process
  const startDeployment = async (): Promise<void> => {
    if (isDeploying) {
      toast.warning('Deployment already in progress');
      return;
    }
    
    if (!isConnected) {
      const connected = await connectToCluster();
      if (!connected) {
        toast.error('Cannot start deployment: Not connected to cluster');
        return;
      }
    }
    
    setIsDeploying(true);
    addLog('Starting DEVONN.AI Framework deployment', 'info');
    toast.info('Starting deployment process');
    
    // Reset all steps to pending
    deploymentSteps.forEach(step => {
      updateStep(step.id, { status: 'pending', progress: 0 });
    });
    
    // Run through each step sequentially
    for (const step of deploymentSteps) {
      const completed = await runStep(step.id);
      if (!completed) {
        addLog('Deployment process stopped', 'warning');
        setIsDeploying(false);
        return;
      }
    }
    
    addLog('DEVONN.AI Framework deployment completed successfully', 'success');
    toast.success('Deployment completed successfully');
    setIsDeploying(false);
  };

  // Cancel ongoing deployment
  const cancelDeployment = () => {
    if (isDeploying) {
      setIsDeploying(false);
      addLog('Deployment process cancelled by user', 'warning');
      toast.warning('Deployment cancelled');
    }
  };

  return {
    isDeploying,
    runStep,
    startDeployment,
    cancelDeployment
  };
};
