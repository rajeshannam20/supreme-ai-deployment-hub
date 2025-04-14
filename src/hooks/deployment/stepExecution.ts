
import { DeploymentStep } from '../../types/deployment';
import { CloudCommandResult, executeCloudCommand } from '../../services/deployment/cloudExecutionService';
import { createLogger } from '../../services/deployment/loggingService';
import { UseDeploymentProcessProps } from './types';

export const executeDeploymentStep = async (
  stepId: string,
  props: UseDeploymentProcessProps,
  timeoutMs: number = 120000
): Promise<boolean> => {
  const { 
    deploymentSteps, 
    isConnected, 
    updateStep, 
    setCurrentStep, 
    connectToCluster, 
    addLog, 
    deploymentConfig, 
    environment 
  } = props;
  
  const logger = createLogger(environment, deploymentConfig?.provider || 'aws');

  if (!deploymentConfig) {
    addLog('Deployment configuration is not set. Please configure deployment settings.', 'error');
    return false;
  }

  const step = deploymentSteps.find(step => step.id === stepId);
  if (!step) {
    addLog(`Step with id ${stepId} not found.`, 'error');
    return false;
  }

  setCurrentStep(stepId);
  updateStep(stepId, { status: 'in-progress', progress: 0, outputLog: [] });
  addLog(`[${step.title}] - Starting...`);

  if (!isConnected && step.id !== 'connect-cluster') {
    addLog(`[${step.title}] - Not connected to the cluster. Skipping step.`, 'warning');
    updateStep(stepId, { status: 'warning', progress: 100, errorMessage: 'Not connected to cluster.' });
    return false;
  }

  try {
    let commandResult: CloudCommandResult;

    if (step.command) {
      commandResult = await executeCloudCommand({
        command: step.command,
        provider: deploymentConfig.provider,
        timeout: timeoutMs,
        environment: environment,
        onProgress: (progress: number) => {
          updateStep(stepId, { progress: progress });
        },
        retryCount: 2
      });

      if (commandResult.logs) {
        commandResult.logs.forEach(log => addLog(`[${step.title}] - ${log}`));
      }

      if (commandResult.success) {
        addLog(`[${step.title}] - Completed successfully.`);
        updateStep(stepId, { status: 'success', progress: 100, outputLog: commandResult.logs });
        return true;
      } else {
        addLog(`[${step.title}] - Failed: ${commandResult.error}`, 'error');
        updateStep(stepId, {
          status: 'error', 
          progress: commandResult.progress || 0, 
          errorMessage: commandResult.error,
          outputLog: commandResult.logs,
          // Include these properties only if they exist in DeploymentStep
          ...(commandResult.errorCode ? { errorCode: commandResult.errorCode } : {}),
          ...(commandResult.errorDetails ? { errorDetails: commandResult.errorDetails } : {})
        });
        return false;
      }
    } else {
      if (step.id === 'connect-cluster') {
        const success = await connectToCluster();
        if (success) {
          updateStep(stepId, { status: 'success', progress: 100 });
          return true;
        } else {
          updateStep(stepId, { status: 'error', progress: 0, errorMessage: 'Failed to connect to cluster.' });
          return false;
        }
      } else {
        addLog(`[${step.title}] - No command to execute.`, 'warning');
        updateStep(stepId, { status: 'warning', progress: 100, outputLog: ['No command to execute.'] });
        return true;
      }
    }
  } catch (error: any) {
    logger.error(`[${step.title}] - Execution error:`, error);
    addLog(`[${step.title}] - Execution failed: ${error.message}`, 'error');
    updateStep(stepId, {
      status: 'error',
      progress: 0,
      errorMessage: error.message,
      outputLog: [`Execution failed: ${error.message}`]
    });
    return false;
  }
};
