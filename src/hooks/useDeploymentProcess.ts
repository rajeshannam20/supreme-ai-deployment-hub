
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
  const DEFAULT_TIMEOUT = 30000; // 30 seconds timeout by default

  // Function to run a step with timeout
  const runStepWithTimeout = async (
    stepId: string, 
    timeoutMs: number = DEFAULT_TIMEOUT
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      let stepComplete = false;
      
      // Set timeout for the step
      const timeoutId = setTimeout(() => {
        if (!stepComplete) {
          updateStep(stepId, { status: 'error', progress: 0 });
          addLog(`Step ${stepId} timed out after ${timeoutMs/1000} seconds`, 'error');
          stepComplete = true;
          resolve(false);
        }
      }, timeoutMs);
      
      // Run the actual step
      runStepImpl(stepId)
        .then(success => {
          stepComplete = true;
          clearTimeout(timeoutId);
          resolve(success);
        })
        .catch(error => {
          stepComplete = true;
          clearTimeout(timeoutId);
          addLog(`Error in step ${stepId}: ${error.message}`, 'error');
          updateStep(stepId, { status: 'error', progress: 0 });
          resolve(false);
        });
    });
  };

  // Internal implementation of running a step
  const runStepImpl = async (stepId: string): Promise<boolean> => {
    setCurrentStep(stepId);
    updateStep(stepId, { status: 'in-progress', progress: 10 });
    addLog(`Starting step: ${stepId}`, 'info');
    
    // Simulate randomness in completion time (and occasional failures)
    const shouldFail = Math.random() < 0.1; // 10% chance of failure
    const slowStep = Math.random() < 0.2; // 20% chance of slow step
    
    // Simulate step progress
    for (let progress = 20; progress <= 100; progress += 20) {
      if (!isDeploying) {
        updateStep(stepId, { status: 'error', progress: progress - 20 });
        addLog(`Step ${stepId} cancelled`, 'warning');
        return false;
      }
      
      // Simulate slower execution for some steps
      const delay = slowStep ? 2000 : 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // If this step is meant to fail, fail around 60% progress
      if (shouldFail && progress >= 60) {
        updateStep(stepId, { status: 'error', progress: progress });
        addLog(`Step ${stepId} failed at ${progress}%`, 'error');
        return false;
      }
      
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
    
    // Run through each step sequentially with timeouts
    for (const step of deploymentSteps) {
      // Custom timeouts for different steps
      let timeout = DEFAULT_TIMEOUT;
      if (step.id === 'backend' || step.id === 'monitoring') {
        timeout = 45000; // 45 seconds for more complex steps
      }
      
      const completed = await runStepWithTimeout(step.id, timeout);
      if (!completed) {
        addLog('Deployment process stopped due to errors', 'error');
        toast.error(`Deployment failed during ${step.title} step`);
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
    runStep: runStepWithTimeout, // Expose the timeout-enabled version
    startDeployment,
    cancelDeployment
  };
};
