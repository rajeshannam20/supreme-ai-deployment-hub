
import { DeploymentStep } from '../../types/deployment';
import { CloudCommandResult, executeCloudCommand } from '../../services/deployment/cloudExecutionService';
import { createLogger } from '../../services/deployment/loggingService';
import { 
  createDeploymentError, 
  updateStepWithError, 
  getUserFriendlyErrorMessage,
  canAutoRecover
} from '../../services/deployment/errorHandling';
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
    const configError = createDeploymentError(
      { code: 'DEPLOY_CONFIG_001', message: 'Deployment configuration is not set' },
      undefined,
      'aws',
      environment
    );
    addLog(getUserFriendlyErrorMessage(configError), 'error');
    return false;
  }

  const step = deploymentSteps.find(step => step.id === stepId);
  if (!step) {
    const stepError = createDeploymentError(
      { code: 'DEPLOY_RESOURCE_001', message: `Step with id ${stepId} not found` },
      undefined,
      deploymentConfig.provider,
      environment
    );
    addLog(getUserFriendlyErrorMessage(stepError), 'error');
    return false;
  }

  setCurrentStep(stepId);
  updateStep(stepId, { status: 'in-progress', progress: 0, outputLog: [] });
  addLog(`[${step.title}] - Starting...`);

  if (!isConnected && step.id !== 'connect-cluster') {
    const connectionError = createDeploymentError(
      { code: 'DEPLOY_CONN_001', message: 'Not connected to the cluster' },
      step,
      deploymentConfig.provider,
      environment
    );
    addLog(`[${step.title}] - ${getUserFriendlyErrorMessage(connectionError)}`, 'warning');
    updateStep(stepId, updateStepWithError(step, connectionError));
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
        addLog(`[${step.title}] - Completed successfully.`, 'info'); // Changed from 'success' to 'info'
        updateStep(stepId, { status: 'success', progress: 100, outputLog: commandResult.logs });
        return true;
      } else {
        // Create structured error from command failure
        const commandError = createDeploymentError(
          {
            code: commandResult.errorCode || 'DEPLOY_UNKNOWN',
            message: commandResult.error || 'Command execution failed',
            details: commandResult.errorDetails
          },
          step,
          deploymentConfig.provider,
          environment
        );
        
        // Log friendly error message
        addLog(`[${step.title}] - ${getUserFriendlyErrorMessage(commandError, true)}`, 'error');
        
        // Update step with error details
        updateStep(stepId, updateStepWithError(step, commandError));
        
        // Check if auto-recovery should be attempted
        if (canAutoRecover(commandError) && step.id !== 'connect-cluster') {
          addLog(`[${step.title}] - Attempting automatic recovery...`, 'info');
          // Logic for auto-recovery would go here in a real implementation
          // For now, we just return false
        }
        
        return false;
      }
    } else {
      if (step.id === 'connect-cluster') {
        try {
          const success = await connectToCluster();
          if (success) {
            updateStep(stepId, { status: 'success', progress: 100 });
            return true;
          } else {
            const connectionError = createDeploymentError(
              { code: 'DEPLOY_CONN_001', message: 'Failed to connect to cluster' },
              step,
              deploymentConfig.provider,
              environment
            );
            updateStep(stepId, updateStepWithError(step, connectionError));
            addLog(`[${step.title}] - ${getUserFriendlyErrorMessage(connectionError)}`, 'error');
            return false;
          }
        } catch (error) {
          const connectionError = createDeploymentError(
            error,
            step,
            deploymentConfig.provider,
            environment
          );
          updateStep(stepId, updateStepWithError(step, connectionError));
          addLog(`[${step.title}] - ${getUserFriendlyErrorMessage(connectionError)}`, 'error');
          return false;
        }
      } else {
        const noCommandError = createDeploymentError(
          { code: 'DEPLOY_CONFIG_001', message: 'No command to execute' },
          step,
          deploymentConfig.provider,
          environment
        );
        addLog(`[${step.title}] - ${getUserFriendlyErrorMessage(noCommandError)}`, 'warning');
        updateStep(stepId, { status: 'warning', progress: 100, outputLog: ['No command to execute.'] });
        return true;
      }
    }
  } catch (error: any) {
    // Create structured error from caught exception
    const executionError = createDeploymentError(
      error,
      step,
      deploymentConfig.provider,
      environment
    );
    
    // Log detailed error
    logger.error(`[${step.title}] - Execution error:`, {
      error: executionError,
      stack: error.stack
    });
    
    // Log user-friendly message
    addLog(`[${step.title}] - ${getUserFriendlyErrorMessage(executionError)}`, 'error');
    
    // Update step with error details
    updateStep(stepId, updateStepWithError(step, executionError));
    
    return false;
  }
};
