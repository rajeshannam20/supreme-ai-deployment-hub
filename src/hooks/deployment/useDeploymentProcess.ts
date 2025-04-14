
import { useCallback, useState } from 'react';
import { createLogger } from '../../services/deployment/loggingService';
import { executeDeploymentStep } from './stepExecution';
import { UseDeploymentProcessProps, UseDeploymentProcess } from './types';

export const useDeploymentProcess = (props: UseDeploymentProcessProps): UseDeploymentProcess => {
  const [isDeploying, setIsDeploying] = useState(false);
  const logger = createLogger(props.environment, props.deploymentConfig?.provider || 'aws');
  const { deploymentSteps, addLog, updateStep } = props;

  const runStep = useCallback(async (stepId: string, timeoutMs: number = 120000): Promise<boolean> => {
    return executeDeploymentStep(stepId, props, timeoutMs);
  }, [props]);

  const retryStep = useCallback(async (stepId: string): Promise<boolean> => {
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
    return runStep(stepId);
  }, [deploymentSteps, addLog, runStep]);

  const startDeployment = useCallback(async (): Promise<void> => {
    setIsDeploying(true);
    addLog('Deployment started.');

    try {
      for (const step of deploymentSteps) {
        if (step.dependsOn) {
          const dependencies = step.dependsOn.map(depId => deploymentSteps.find(s => s.id === depId));
          const allDependenciesSuccessful = dependencies.every(dep => dep && dep.status === 'success');

          if (!allDependenciesSuccessful) {
            addLog(`Skipping step ${step.title} due to failed dependencies.`, 'warning');
            updateStep(step.id, { status: 'pending', progress: 0 });
            continue;
          }
        }

        const success = await runStep(step.id);
        if (!success) {
          addLog(`Deployment stopped due to failure in step: ${step.title}`, 'error');
          setIsDeploying(false);
          return;
        }
      }

      addLog('Deployment completed successfully!');
    } catch (error: any) {
      addLog(`Deployment failed: ${error.message}`, 'error');
    } finally {
      setIsDeploying(false);
    }
  }, [deploymentSteps, runStep, addLog, updateStep]);

  const cancelDeployment = useCallback(() => {
    setIsDeploying(false);
    addLog('Deployment cancelled.');
    // Implement any necessary cancellation logic here
  }, [setIsDeploying, addLog]);

  return { isDeploying, runStep, retryStep, startDeployment, cancelDeployment };
};
