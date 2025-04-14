
import { DeploymentStep } from '../../types/deployment';
import { CloudCommandResult, executeCloudCommand } from '../../services/deployment/cloudExecutionService';
import { createLogger } from '../../services/deployment/loggingService';
import { 
  createDeploymentError, 
  updateStepWithError, 
  getUserFriendlyErrorMessage,
  canAutoRecover
} from '../../services/deployment/errorHandling';
import { UseDeploymentProcessProps, RetryStrategy, DEFAULT_RETRY_STRATEGY } from './types';
import { validateDeploymentConfig } from '../../services/deployment/configValidation';

/**
 * Executes a deployment step with enhanced error handling and retry logic
 * @param stepId ID of the step to execute
 * @param props Deployment process props
 * @param timeoutMs Timeout in milliseconds
 * @param retryStrategy Optional retry strategy
 * @returns Promise resolving to true if successful, false otherwise
 */
export const executeDeploymentStep = async (
  stepId: string,
  props: UseDeploymentProcessProps,
  timeoutMs: number = 120000,
  retryStrategy?: Partial<RetryStrategy>
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
  
  // Create a logger for this operation
  const logger = createLogger(environment, deploymentConfig?.provider || 'aws');
  
  // Set up retry strategy by merging defaults with any provided options
  const finalRetryStrategy: RetryStrategy = {
    ...DEFAULT_RETRY_STRATEGY,
    ...retryStrategy
  };
  
  // Validate deployment configuration before proceeding
  const validationResult = validateDeploymentConfig(deploymentConfig, environment);
  if (!validationResult.valid) {
    const configError = createDeploymentError(
      { code: 'DEPLOY_CONFIG_001', message: `Deployment configuration is invalid: ${validationResult.errors.join(', ')}` },
      undefined,
      'aws',
      environment
    );
    addLog(getUserFriendlyErrorMessage(configError), 'error');
    return false;
  }

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

  // Implementation of actual step execution with retry
  const executeWithRetry = async (attemptNumber: number = 0): Promise<boolean> => {
    try {
      let commandResult: CloudCommandResult;

      if (step.command) {
        // If this is a retry attempt, log it
        if (attemptNumber > 0) {
          addLog(`[${step.title}] - Retry attempt ${attemptNumber} of ${finalRetryStrategy.maxAttempts}...`, 'info');
        }
        
        commandResult = await executeCloudCommand({
          command: step.command,
          provider: deploymentConfig.provider,
          timeout: timeoutMs,
          environment: environment,
          onProgress: (progress: number) => {
            updateStep(stepId, { progress: progress });
          },
          retryCount: 1 // Internal retry handled by command execution
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
          
          // Determine if we should retry
          if (attemptNumber < finalRetryStrategy.maxAttempts && canAutoRecover(commandError)) {
            // Calculate backoff delay with jitter
            const delay = Math.min(
              finalRetryStrategy.initialDelayMs * Math.pow(finalRetryStrategy.backoffFactor, attemptNumber),
              finalRetryStrategy.maxDelayMs
            ) * (0.8 + Math.random() * 0.4); // Add 20% jitter
            
            addLog(`[${step.title}] - Command failed, will retry in ${Math.round(delay / 1000)} seconds...`, 'warning');
            
            // Wait for the calculated delay
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Recursive retry
            return executeWithRetry(attemptNumber + 1);
          }
          
          // Log friendly error message if we're not retrying or max retries reached
          addLog(`[${step.title}] - ${getUserFriendlyErrorMessage(commandError, true)}`, 'error');
          
          // Update step with error details
          updateStep(stepId, updateStepWithError(step, commandError));
          
          // Check if auto-recovery should be attempted for other errors
          if (canAutoRecover(commandError) && step.id !== 'connect-cluster') {
            addLog(`[${step.title}] - Attempting automatic recovery...`, 'info');
            // Logic for auto-recovery would go here in a real implementation
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
      
      // Check if we can retry the operation
      if (attemptNumber < finalRetryStrategy.maxAttempts && canAutoRecover(executionError)) {
        // Calculate backoff delay
        const delay = Math.min(
          finalRetryStrategy.initialDelayMs * Math.pow(finalRetryStrategy.backoffFactor, attemptNumber),
          finalRetryStrategy.maxDelayMs
        );
        
        addLog(`[${step.title}] - Execution error, will retry in ${Math.round(delay / 1000)} seconds...`, 'warning');
        
        // Wait for the calculated delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Recursive retry
        return executeWithRetry(attemptNumber + 1);
      }
      
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
  
  // Start execution with retry
  return executeWithRetry();
};
