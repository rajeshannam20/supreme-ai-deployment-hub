
import { DeploymentStep } from '../../types/deployment';
import { createLogger } from '../../services/deployment/loggingService';
import { executeDeploymentStep } from './stepExecution';
import { UseDeploymentProcessProps } from './types';

/**
 * Handles the execution of the entire deployment process
 */
export const runDeploymentProcess = async (
  props: UseDeploymentProcessProps,
  isDeploying: boolean,
  setIsDeploying: (val: boolean) => void
): Promise<void> => {
  const { deploymentSteps, addLog, updateStep, deploymentConfig, environment } = props;
  const logger = createLogger(environment, deploymentConfig?.provider || 'aws');
  
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
        const dependencies = step.dependsOn.map(depId => 
          deploymentSteps.find(s => s.id === depId)
        );
        const allDependenciesSuccessful = dependencies.every(
          dep => dep && dep.status === 'success'
        );

        if (!allDependenciesSuccessful) {
          addLog(`Skipping step ${step.title} due to failed dependencies.`, 'warning');
          updateStep(step.id, { status: 'pending', progress: 0 });
          continue;
        }
      }

      // Execute the step with default retry strategy
      const success = await executeDeploymentStep(step.id, props);
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
};
