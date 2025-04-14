
import { useState } from 'react';
import { toast } from 'sonner';
import { DeploymentStep, CloudProvider, DeploymentConfig } from '../types/deployment';
import { executeCloudCommand } from '../services/deployment/cloudExecutionService';

interface UseDeploymentProcessProps {
  deploymentSteps: DeploymentStep[];
  isConnected: boolean;
  updateStep: (stepId: string, update: Partial<DeploymentStep>) => void;
  setCurrentStep: (stepId: string) => void;
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  deploymentConfig?: DeploymentConfig;
}

export const useDeploymentProcess = ({
  deploymentSteps,
  isConnected,
  updateStep,
  setCurrentStep,
  connectToCluster,
  addLog,
  deploymentConfig
}: UseDeploymentProcessProps) => {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const DEFAULT_TIMEOUT = 120000; // 2 minutes timeout by default

  // Execute a real cloud command
  const executeStep = async (step: DeploymentStep): Promise<boolean> => {
    if (!step.command) {
      addLog(`Step ${step.id} has no command defined`, 'error');
      return false;
    }

    try {
      // Execute the actual cloud command
      const result = await executeCloudCommand({
        command: step.command,
        provider: step.provider || (deploymentConfig?.provider || 'aws'),
        timeout: DEFAULT_TIMEOUT,
        onProgress: (progress: number) => {
          updateStep(step.id, { progress });
        }
      });

      if (result.success) {
        updateStep(step.id, { 
          status: 'success', 
          progress: 100, 
          outputLog: result.logs 
        });
        addLog(`Successfully executed step: ${step.title}`, 'success');
        return true;
      } else {
        updateStep(step.id, { 
          status: 'error', 
          progress: result.progress || 0, 
          outputLog: result.logs,
          errorMessage: result.error
        });
        addLog(`Failed to execute step ${step.title}: ${result.error}`, 'error');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStep(step.id, { 
        status: 'error', 
        progress: 0,
        errorMessage
      });
      addLog(`Error in step ${step.title}: ${errorMessage}`, 'error');
      return false;
    }
  };

  // Function to run a step with timeout
  const runStep = async (
    stepId: string, 
    timeoutMs: number = DEFAULT_TIMEOUT
  ): Promise<boolean> => {
    const step = deploymentSteps.find(s => s.id === stepId);
    if (!step) {
      addLog(`Step ${stepId} not found`, 'error');
      return false;
    }

    // Set step as in progress
    setCurrentStep(stepId);
    updateStep(stepId, { status: 'in-progress', progress: 0 });
    addLog(`Starting step: ${step.title}`, 'info');

    // Check if all dependencies are met
    if (step.dependsOn && step.dependsOn.length > 0) {
      const unmetDependencies = step.dependsOn.filter(depId => {
        const depStep = deploymentSteps.find(s => s.id === depId);
        return !depStep || depStep.status !== 'success';
      });

      if (unmetDependencies.length > 0) {
        addLog(`Cannot start step ${step.title}: unmet dependencies`, 'error');
        updateStep(stepId, { status: 'error', progress: 0 });
        return false;
      }
    }

    return new Promise((resolve) => {
      let stepComplete = false;
      
      // Set timeout for the step
      const timeoutId = setTimeout(() => {
        if (!stepComplete) {
          updateStep(stepId, { status: 'error', progress: 0, errorMessage: 'Operation timed out' });
          addLog(`Step ${step.title} timed out after ${timeoutMs/1000} seconds`, 'error');
          stepComplete = true;
          resolve(false);
        }
      }, timeoutMs);
      
      // Execute the actual step
      executeStep(step)
        .then(success => {
          stepComplete = true;
          clearTimeout(timeoutId);
          resolve(success);
        })
        .catch(error => {
          stepComplete = true;
          clearTimeout(timeoutId);
          addLog(`Error in step ${step.title}: ${error.message}`, 'error');
          updateStep(stepId, { status: 'error', progress: 0, errorMessage: error.message });
          resolve(false);
        });
    });
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

    if (!deploymentConfig) {
      toast.error('Deployment configuration is missing');
      return;
    }
    
    setIsDeploying(true);
    addLog(`Starting deployment to ${deploymentConfig.environment} environment on ${deploymentConfig.provider}`, 'info');
    toast.info('Starting deployment process');
    
    // Reset all steps to pending
    deploymentSteps.forEach(step => {
      // Skip steps that are not relevant to the selected provider
      if (step.providerSpecific && step.provider !== deploymentConfig.provider) {
        updateStep(step.id, { status: 'pending', progress: 0 });
        return;
      }
      updateStep(step.id, { status: 'pending', progress: 0 });
    });
    
    // Filter steps by provider if needed
    const applicableSteps = deploymentSteps.filter(step => 
      !step.providerSpecific || step.provider === deploymentConfig.provider
    );

    // Run through each step sequentially with timeouts
    for (const step of applicableSteps) {
      // Skip steps that should be skipped
      if (step.status === 'success') {
        addLog(`Skipping already completed step: ${step.title}`, 'info');
        continue;
      }
      
      // Custom timeouts for different steps based on complexity
      let timeout = DEFAULT_TIMEOUT;
      if (step.id === 'backend' || step.id === 'monitoring') {
        timeout = 180000; // 3 minutes for more complex steps
      } else if (step.id === 'infrastructure') {
        timeout = 300000; // 5 minutes for infrastructure provisioning
      }
      
      const completed = await runStep(step.id, timeout);
      if (!completed) {
        addLog('Deployment process stopped due to errors', 'error');
        toast.error(`Deployment failed during ${step.title} step`);
        setIsDeploying(false);
        return;
      }
    }
    
    addLog(`Deployment to ${deploymentConfig.environment} completed successfully`, 'success');
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
