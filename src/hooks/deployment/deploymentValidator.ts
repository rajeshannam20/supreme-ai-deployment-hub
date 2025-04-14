
import { UseDeploymentProcessProps } from './types';
import { validateDeploymentConfig } from '../../services/deployment/configValidation';

/**
 * Validates a deployment configuration before starting the deployment process
 */
export const validateDeploymentBeforeStart = (props: UseDeploymentProcessProps): boolean => {
  const { deploymentConfig, environment, addLog } = props;

  // Validate deployment configuration
  if (deploymentConfig) {
    const validationResult = validateDeploymentConfig(deploymentConfig, environment);
    if (!validationResult.valid) {
      validationResult.errors.forEach(error => {
        addLog(`Configuration error: ${error}`, 'error');
      });
      validationResult.warnings.forEach(warning => {
        addLog(`Configuration warning: ${warning}`, 'warning');
      });
      addLog('Deployment cannot start due to configuration errors.', 'error');
      return false;
    } else if (validationResult.warnings.length > 0) {
      validationResult.warnings.forEach(warning => {
        addLog(`Configuration warning: ${warning}`, 'warning');
      });
    }
    return true;
  }
  
  addLog('Deployment configuration is missing.', 'error');
  return false;
};
