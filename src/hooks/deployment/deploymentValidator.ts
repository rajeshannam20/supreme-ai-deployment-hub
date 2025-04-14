
import { DeploymentConfig, DeploymentEnvironment, CloudProvider } from '../../types/deployment';
import { validateDeploymentConfig } from '../../services/deployment/configValidation';
import { validateEnvironmentVariables } from './stepUtils';
import { UseDeploymentProcessProps } from './types';

/**
 * Validates if the environment is ready for deployment
 */
export const validateEnvironmentReadiness = (
  environment: DeploymentEnvironment,
  provider: CloudProvider,
  addLog: (log: string, type?: 'info' | 'error' | 'warning' | 'success') => void
): boolean => {
  // Check for required environment variables
  const envVarsCheck = validateEnvironmentVariables(environment);
  if (!envVarsCheck.valid) {
    addLog(
      `Missing required environment variables: ${envVarsCheck.missing.join(', ')}`,
      'error'
    );
    
    // For development, we can continue despite missing variables
    if (environment === 'development') {
      addLog('Continuing with deployment in development mode despite missing variables.', 'warning');
      return true;
    }
    
    return false;
  }

  // Additional checks could be added here: network connectivity, permissions, etc.
  
  return true;
};

/**
 * Validates if deployment can start
 */
export const validateDeploymentBeforeStart = (
  props: UseDeploymentProcessProps
): boolean => {
  const { deploymentConfig, addLog, environment } = props;
  
  if (!deploymentConfig) {
    addLog('Deployment configuration is not set. Please configure before starting deployment.', 'error');
    return false;
  }

  // Validate deployment configuration
  const validationResult = validateDeploymentConfig(deploymentConfig, environment);
  if (!validationResult.valid) {
    addLog(
      `Deployment configuration is invalid: ${validationResult.errors.join(', ')}`,
      'error'
    );
    return false;
  }

  // Show warnings but don't block deployment
  if (validationResult.warnings && validationResult.warnings.length > 0) {
    validationResult.warnings.forEach(warning => {
      addLog(`Warning: ${warning}`, 'warning');
    });
  }

  // Validate environment readiness
  const isEnvironmentReady = validateEnvironmentReadiness(
    environment,
    deploymentConfig.provider,
    addLog
  );
  
  if (!isEnvironmentReady && environment !== 'development') {
    addLog('Environment is not ready for deployment.', 'error');
    return false;
  }

  return true;
};
