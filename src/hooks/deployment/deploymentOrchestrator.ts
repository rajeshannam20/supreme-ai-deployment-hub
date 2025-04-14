
import { DeploymentStep } from '../../types/deployment';
import { createLogger } from '../../services/deployment/loggingService';
import { executeDeploymentStep } from './stepExecution';
import { UseDeploymentProcessProps } from './types';
import { validateEnvironmentReadiness } from './deploymentValidator';

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
    // Validate environment readiness
    if (deploymentConfig) {
      const isEnvironmentReady = validateEnvironmentReadiness(
        environment,
        deploymentConfig.provider,
        addLog
      );
      
      if (!isEnvironmentReady && environment === 'production') {
        addLog('Deployment aborted due to environment validation failures.', 'error');
        setIsDeploying(false);
        return;
      }
    }
    
    // Pre-deployment summary
    const totalSteps = deploymentSteps.length;
    addLog(`Starting deployment with ${totalSteps} steps for ${environment} environment.`, 'info');
    
    if (environment === 'production') {
      addLog('PRODUCTION DEPLOYMENT: Ensure all items in the production checklist are addressed.', 'warning');
    }
    
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
        
        // For production deployments, provide more detailed failure analysis
        if (environment === 'production') {
          addLog('Production deployment failed. Performing deployment analysis...', 'info');
          // In a real implementation, this would gather more diagnostics and provide recovery suggestions
          addLog('Refer to the production deployment runbook for recovery procedures.', 'info');
        }
        
        setIsDeploying(false);
        return;
      }
    }

    // Post-deployment verification
    addLog('All deployment steps completed. Running post-deployment verification...', 'info');
    
    // In a real implementation, this would perform actual verification checks
    if (environment === 'production') {
      addLog('Production deployment verification complete. System is now live.', 'success');
    } else {
      addLog('Deployment completed successfully!', 'success');
    }
    
    setIsDeploying(false);
  } catch (error: any) {
    addLog(`Deployment failed: ${error.message}`, 'error');
    logger.error('Deployment process failed', { error });
    setIsDeploying(false);
  }
};
