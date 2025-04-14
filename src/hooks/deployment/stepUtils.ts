
import { DeploymentStep, CloudProvider, DeploymentEnvironment } from '../../types/deployment';
import { createDeploymentError } from '../../services/deployment/errorHandling';
import { UseDeploymentProcessProps } from './types';

/**
 * Find a deployment step by its ID
 */
export const findStepById = (
  stepId: string,
  deploymentSteps: DeploymentStep[]
): DeploymentStep | undefined => {
  return deploymentSteps.find(step => step.id === stepId);
};

/**
 * Validates if the environment is ready for step execution
 */
export const validateExecutionEnvironment = (
  stepId: string,
  props: UseDeploymentProcessProps
): { valid: boolean; error?: Error } => {
  const { deploymentSteps, isConnected, addLog, deploymentConfig, environment } = props;
  
  if (!deploymentConfig) {
    const configError = createDeploymentError(
      { code: 'DEPLOY_CONFIG_001', message: 'Deployment configuration is not set' },
      undefined,
      'aws',
      environment
    );
    addLog(configError.message, 'error');
    return { valid: false, error: new Error(configError.message) };
  }

  const step = findStepById(stepId, deploymentSteps);
  if (!step) {
    const stepError = createDeploymentError(
      { code: 'DEPLOY_RESOURCE_001', message: `Step with id ${stepId} not found` },
      undefined,
      deploymentConfig.provider,
      environment
    );
    addLog(stepError.message, 'error');
    return { valid: false, error: new Error(stepError.message) };
  }

  // Enhanced environment-specific validation
  if (environment === 'production') {
    // For production, perform stricter validation checks
    if (step.id === 'finalize' || step.id === 'monitoring') {
      // Validate that security and infrastructure steps are complete
      const requiredSteps = ['prerequisites', 'infrastructure'];
      const completedRequiredSteps = requiredSteps.every(reqStepId => {
        const reqStep = findStepById(reqStepId, deploymentSteps);
        return reqStep?.status === 'success';
      });
      
      if (!completedRequiredSteps) {
        const envError = createDeploymentError(
          { 
            code: 'DEPLOY_ENV_002', 
            message: 'Production environment requires all prerequisite steps to be completed successfully' 
          },
          step,
          deploymentConfig.provider,
          environment
        );
        addLog(`[${step.title}] - ${envError.message}`, 'warning');
        return { valid: false, error: new Error(envError.message) };
      }
    }
  }

  if (!isConnected && step.id !== 'connect-cluster') {
    const connectionError = createDeploymentError(
      { code: 'DEPLOY_CONN_001', message: 'Not connected to the cluster' },
      step,
      deploymentConfig.provider,
      environment
    );
    addLog(`[${step.title}] - ${connectionError.message}`, 'warning');
    return { valid: false, error: new Error(connectionError.message) };
  }

  return { valid: true };
};

/**
 * Handles the successful completion of a step
 */
export const handleStepSuccess = (
  stepId: string, 
  step: DeploymentStep, 
  logs: string[] | undefined, 
  updateStep: UseDeploymentProcessProps['updateStep'],
  addLog: UseDeploymentProcessProps['addLog']
): void => {
  addLog(`[${step.title}] - Completed successfully.`, 'info');
  updateStep(stepId, { status: 'success', progress: 100, outputLog: logs });
};

/**
 * Handles the failure of a step execution
 */
export const handleStepFailure = (
  stepId: string,
  step: DeploymentStep,
  error: any,
  updateStep: UseDeploymentProcessProps['updateStep'],
  addLog: UseDeploymentProcessProps['addLog'],
  provider: CloudProvider,
  environment: DeploymentEnvironment
): void => {
  const stepError = createDeploymentError(error, step, provider, environment);
  addLog(`[${step.title}] - ${stepError.message}`, 'error');
  updateStep(stepId, {
    status: 'error',
    progress: 0,
    errorMessage: stepError.message,
    errorCode: stepError.code,
    errorDetails: stepError.details
  });
  
  // For production environments, provide more detailed error handling guidance
  if (environment === 'production') {
    addLog('Production deployment step failed. Refer to the runbook for recovery procedures.', 'warning');
    
    // Log additional information to help with troubleshooting
    if (stepError.code) {
      addLog(`Error code: ${stepError.code}. See documentation for troubleshooting this specific error.`, 'info');
    }
  }
};

/**
 * Validates environment variables required for deployment
 */
export const validateEnvironmentVariables = (
  environment: DeploymentEnvironment
): { valid: boolean; missing: string[] } => {
  const requiredVars = ['AWS_REGION'];
  
  if (environment === 'production') {
    requiredVars.push('AWS_ACCOUNT_ID', 'DEPLOYMENT_ROLE_ARN');
  }
  
  const missing = requiredVars.filter(envVar => !process.env[envVar]);
  
  return {
    valid: missing.length === 0,
    missing
  };
};
