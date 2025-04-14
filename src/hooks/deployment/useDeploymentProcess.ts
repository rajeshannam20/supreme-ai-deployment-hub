
import { useCallback, useState } from 'react';
import { createLogger } from '../../services/deployment/loggingService';
import { executeDeploymentStep } from './stepExecution';
import { UseDeploymentProcessProps, UseDeploymentProcess, RetryStrategy, DEFAULT_RETRY_STRATEGY } from './types';
import { validateDeploymentConfig } from '../../services/deployment/configValidation';

export const useDeploymentProcess = (props: UseDeploymentProcessProps): UseDeploymentProcess => {
  const [isDeploying, setIsDeploying] = useState(false);
  const logger = createLogger(props.environment, props.deploymentConfig?.provider || 'aws');
  const { deploymentSteps, addLog, updateStep } = props;

  // Run a deployment step with optional timeout and retry strategy
  const runStep = useCallback(async (
    stepId: string, 
    timeoutMs: number = 120000,
    retryStrategy?: Partial<RetryStrategy>
  ): Promise<boolean> => {
    return executeDeploymentStep(
      stepId, 
      props, 
      timeoutMs,
      { ...DEFAULT_RETRY_STRATEGY, ...retryStrategy }
    );
  }, [props]);

  // Retry a failed step
  const retryStep = useCallback(async (
    stepId: string,
    retryStrategy?: Partial<RetryStrategy>
  ): Promise<boolean> => {
    const step = deploymentSteps.find(step => step.id === stepId);
    if (!step) {
      addLog(`Step with id ${stepId} not found.`, 'error');
      return false;
    }

    if (step.status !== 'error') {
      addLog(`Step with id ${stepId} is not in error state.`, 'warning');
      return false;
    }

    addLog(`Retrying step: ${step.title}`);
    
    // Use more aggressive retry strategy for explicit retries
    const aggressiveRetryStrategy: Partial<RetryStrategy> = {
      maxAttempts: 5,
      initialDelayMs: 500,
      backoffFactor: 1.5,
      ...retryStrategy
    };
    
    return runStep(stepId, 180000, aggressiveRetryStrategy); // Extended timeout for retries
  }, [deploymentSteps, addLog, runStep]);

  // Start the entire deployment process
  const startDeployment = useCallback(async (): Promise<void> => {
    // Validate deployment configuration first
    if (props.deploymentConfig) {
      const validationResult = validateDeploymentConfig(props.deploymentConfig, props.environment);
      if (!validationResult.valid) {
        validationResult.errors.forEach(error => {
          addLog(`Configuration error: ${error}`, 'error');
        });
        validationResult.warnings.forEach(warning => {
          addLog(`Configuration warning: ${warning}`, 'warning');
        });
        addLog('Deployment cannot start due to configuration errors.', 'error');
        return;
      } else if (validationResult.warnings.length > 0) {
        validationResult.warnings.forEach(warning => {
          addLog(`Configuration warning: ${warning}`, 'warning');
        });
      }
    } else {
      addLog('Deployment configuration is missing.', 'error');
      return;
    }
    
    setIsDeploying(true);
    addLog('Deployment started.', 'success');
    
    try {
      for (const step of deploymentSteps) {
        // Check if deployment was cancelled
        if (!isDeploying) {
          addLog('Deployment was cancelled.', 'warning');
          return;
        }
        
        // Check step dependencies
        if (step.dependsOn) {
          const dependencies = step.dependsOn.map(depId => deploymentSteps.find(s => s.id === depId));
          const allDependenciesSuccessful = dependencies.every(dep => dep && dep.status === 'success');

          if (!allDependenciesSuccessful) {
            addLog(`Skipping step ${step.title} due to failed dependencies.`, 'warning');
            updateStep(step.id, { status: 'pending', progress: 0 });
            continue;
          }
        }

        // Execute the step with default retry strategy
        const success = await runStep(step.id);
        if (!success) {
          addLog(`Deployment stopped due to failure in step: ${step.title}`, 'error');
          setIsDeploying(false);
          return;
        }
      }

      addLog('Deployment completed successfully!', 'success');
      setIsDeploying(false);
    } catch (error: any) {
      addLog(`Deployment failed: ${error.message}`, 'error');
      logger.error('Deployment process failed', { error });
      setIsDeploying(false);
    }
  }, [deploymentSteps, runStep, addLog, updateStep, props.deploymentConfig, props.environment, logger, isDeploying]);

  // Cancel an ongoing deployment
  const cancelDeployment = useCallback(() => {
    if (!isDeploying) {
      addLog('No active deployment to cancel.', 'info');
      return;
    }
    
    setIsDeploying(false);
    addLog('Deployment cancellation requested. Waiting for current operations to complete...', 'warning');
    
    // Note: actual cancellation of in-progress operations would require additional implementation
    // such as passing abort signals to the executeCloudCommand function
  }, [isDeploying, addLog]);

  return { isDeploying, runStep, retryStep, startDeployment, cancelDeployment };
};
