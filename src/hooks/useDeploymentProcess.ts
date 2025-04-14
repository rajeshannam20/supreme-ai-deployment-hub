
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { DeploymentStep, CloudProvider, DeploymentConfig, DeploymentEnvironment } from '../types/deployment';
import { executeCloudCommand, CloudCommandResult } from '../services/deployment/cloudExecutionService';
import { createLogger } from '../services/deployment/loggingService';

interface UseDeploymentProcessProps {
  deploymentSteps: DeploymentStep[];
  isConnected: boolean;
  updateStep: (stepId: string, update: Partial<DeploymentStep>) => void;
  setCurrentStep: (stepId: string) => void;
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  deploymentConfig?: DeploymentConfig;
  environment?: DeploymentEnvironment;
}

export const useDeploymentProcess = ({
  deploymentSteps,
  isConnected,
  updateStep,
  setCurrentStep,
  connectToCluster,
  addLog,
  deploymentConfig,
  environment = 'development'
}: UseDeploymentProcessProps) => {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [failedSteps, setFailedSteps] = useState<string[]>([]);
  const [retryAttempts, setRetryAttempts] = useState<Record<string, number>>({});
  
  const DEFAULT_TIMEOUT = 120000; // 2 minutes timeout by default
  const MAX_RETRY_ATTEMPTS = 3;
  
  // Create a deployment-specific logger
  const logger = createLogger(
    environment,
    deploymentConfig?.provider || 'aws'
  );

  // Handle deployment errors
  const handleDeploymentError = useCallback((
    step: DeploymentStep, 
    error: any, 
    result?: CloudCommandResult
  ) => {
    const errorMessage = error?.message || result?.error || 'Unknown error occurred';
    const errorCode = error?.code || result?.errorCode || 'UNKNOWN_ERROR';
    const errorDetails = error?.details || result?.errorDetails || {};
    
    // Log detailed error information
    logger.error(`Failed to execute ${step.title}`, { 
      step: step.id,
      errorCode,
      errorMessage,
      errorDetails,
      command: step.command
    });
    
    // Update step status with error information
    updateStep(step.id, { 
      status: 'error', 
      progress: result?.progress || 0, 
      outputLog: result?.logs || [errorMessage],
      errorMessage: errorMessage
    });
    
    // Add to failed steps list for retry tracking
    setFailedSteps(prev => [...prev, step.id]);
    
    // Log to deployment logs
    addLog(`Failed to execute step ${step.title}: ${errorMessage}`, 'error');
    
    // Show toast for critical errors
    if (environment !== 'development') {
      toast.error(`Deployment step failed: ${step.title}`, {
        description: errorMessage,
        duration: 5000
      });
    }
  }, [updateStep, addLog, environment, logger]);

  // Execute a deployment step with error handling
  const executeStep = async (step: DeploymentStep): Promise<boolean> => {
    if (!step.command) {
      addLog(`Step ${step.id} has no command defined`, 'error');
      return false;
    }

    try {
      // Log step execution
      logger.info(`Executing step: ${step.title}`, { 
        stepId: step.id,
        command: step.command,
        provider: step.provider || deploymentConfig?.provider || 'aws'
      });
      
      // Track retry attempts
      const currentAttempt = retryAttempts[step.id] || 0;
      if (currentAttempt > 0) {
        addLog(`Retry attempt ${currentAttempt} for step: ${step.title}`, 'warning');
      }

      // Execute the cloud command with provider and timeout
      const result = await executeCloudCommand({
        command: step.command,
        provider: step.provider || (deploymentConfig?.provider || 'aws'),
        timeout: step.id === 'infrastructure' ? 300000 : DEFAULT_TIMEOUT, // 5 min for infra
        onProgress: (progress: number) => {
          updateStep(step.id, { progress });
        },
        retryCount: currentAttempt > 0 ? 0 : 2, // Only use internal retries on first attempt
        environment: environment
      });

      if (result.success) {
        updateStep(step.id, { 
          status: 'success', 
          progress: 100, 
          outputLog: result.logs,
          errorMessage: undefined // Clear any previous error
        });
        
        // Log successful execution
        logger.success(`Successfully executed step: ${step.title}`, {
          stepId: step.id,
          duration: `${(performance.now() / 1000).toFixed(2)}s`,
          operationId: result.operationId
        });
        
        addLog(`Successfully executed step: ${step.title}`, 'success');
        
        // Remove from failed steps if it was previously failed
        setFailedSteps(prev => prev.filter(id => id !== step.id));
        
        return true;
      } else {
        // Handle command failure
        handleDeploymentError(step, null, result);
        return false;
      }
    } catch (error) {
      // Handle unexpected errors
      handleDeploymentError(step, error);
      return false;
    }
  };

  // Function to run a step with timeout and retry logic
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
    updateStep(stepId, { status: 'in-progress', progress: 0, errorMessage: undefined });
    addLog(`Starting step: ${step.title}`, 'info');

    // Check if all dependencies are met
    if (step.dependsOn && step.dependsOn.length > 0) {
      const unmetDependencies = step.dependsOn.filter(depId => {
        const depStep = deploymentSteps.find(s => s.id === depId);
        return !depStep || depStep.status !== 'success';
      });

      if (unmetDependencies.length > 0) {
        const errorMessage = `Cannot start step ${step.title}: unmet dependencies (${unmetDependencies.join(', ')})`;
        addLog(errorMessage, 'error');
        updateStep(stepId, { 
          status: 'error', 
          progress: 0, 
          errorMessage
        });
        return false;
      }
    }

    return new Promise((resolve) => {
      let stepComplete = false;
      
      // Set timeout for the step
      const timeoutId = setTimeout(() => {
        if (!stepComplete) {
          const errorMessage = `Operation timed out after ${timeoutMs/1000} seconds`;
          updateStep(stepId, { 
            status: 'error', 
            progress: 0, 
            errorMessage
          });
          addLog(`Step ${step.title} timed out after ${timeoutMs/1000} seconds`, 'error');
          
          logger.error(`Step timed out: ${step.title}`, {
            stepId,
            timeout: timeoutMs/1000,
            command: step.command
          });
          
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
          
          logger.error(`Unexpected error in step ${step.title}`, {
            error: error.message,
            stack: error.stack,
            stepId
          });
          
          addLog(`Error in step ${step.title}: ${error.message}`, 'error');
          updateStep(stepId, { 
            status: 'error', 
            progress: 0, 
            errorMessage: error.message
          });
          resolve(false);
        });
    });
  };

  // Retry a failed step
  const retryStep = async (stepId: string): Promise<boolean> => {
    const step = deploymentSteps.find(s => s.id === stepId);
    if (!step) {
      addLog(`Cannot retry - Step ${stepId} not found`, 'error');
      return false;
    }
    
    // Check if we've exceeded max retry attempts
    const attemptsSoFar = retryAttempts[stepId] || 0;
    if (attemptsSoFar >= MAX_RETRY_ATTEMPTS) {
      addLog(`Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) reached for step: ${step.title}`, 'error');
      return false;
    }
    
    // Update retry counter
    setRetryAttempts(prev => ({
      ...prev,
      [stepId]: (prev[stepId] || 0) + 1
    }));
    
    // Log retry
    logger.info(`Retrying step: ${step.title}`, {
      stepId,
      attemptNumber: attemptsSoFar + 1,
      maxAttempts: MAX_RETRY_ATTEMPTS
    });
    
    addLog(`Retrying step: ${step.title} (Attempt ${attemptsSoFar + 1}/${MAX_RETRY_ATTEMPTS})`, 'warning');
    
    // Run the step again
    return runStep(stepId);
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
    
    // Reset retry attempts
    setRetryAttempts({});
    setFailedSteps([]);
    
    // Log deployment start with enhanced context
    logger.info(`Starting deployment to ${deploymentConfig.environment} environment`, {
      provider: deploymentConfig.provider,
      region: deploymentConfig.region,
      clusterName: deploymentConfig.clusterName,
      namespace: deploymentConfig.namespace,
      environment: environment
    });
    
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
      
      // Execute the step
      let completed = await runStep(step.id, timeout);
      
      // If step failed, try to retry up to MAX_RETRY_ATTEMPTS
      if (!completed) {
        // Only retry in production environment
        if (environment === 'production') {
          for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            completed = await retryStep(step.id);
            if (completed) break;
          }
        }
        
        // If still not completed after retries, stop deployment
        if (!completed) {
          addLog('Deployment process stopped due to errors', 'error');
          
          // Log deployment failure with diagnostics
          logger.error(`Deployment failed during ${step.title} step`, {
            failedStep: step.id,
            provider: deploymentConfig.provider,
            environment: environment,
            remainingSteps: applicableSteps.slice(applicableSteps.indexOf(step) + 1).map(s => s.id)
          });
          
          toast.error(`Deployment failed during ${step.title} step`);
          setIsDeploying(false);
          return;
        }
      }
    }
    
    // Log successful deployment completion
    logger.success(`Deployment to ${deploymentConfig.environment} completed successfully`, {
      duration: `${(performance.now() / 1000).toFixed(2)}s`,
      environment: environment,
      provider: deploymentConfig.provider
    });
    
    addLog(`Deployment to ${deploymentConfig.environment} completed successfully`, 'success');
    toast.success('Deployment completed successfully');
    setIsDeploying(false);
  };

  // Cancel ongoing deployment
  const cancelDeployment = () => {
    if (isDeploying) {
      setIsDeploying(false);
      
      logger.warning('Deployment process cancelled by user', {
        environment: environment,
        currentStatus: deploymentSteps.reduce((acc, step) => {
          acc[step.id] = step.status;
          return acc;
        }, {} as Record<string, string>)
      });
      
      addLog('Deployment process cancelled by user', 'warning');
      toast.warning('Deployment cancelled');
    }
  };

  return {
    isDeploying,
    runStep,
    retryStep,
    startDeployment,
    cancelDeployment,
    failedSteps
  };
};
