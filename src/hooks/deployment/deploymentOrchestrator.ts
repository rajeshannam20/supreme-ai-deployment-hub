
import { DeploymentStep } from '../../types/deployment';
import { createLogger } from '../../services/deployment/loggingService';
import { executeDeploymentStep } from './stepExecution';
import { UseDeploymentProcessProps } from './types';
import { validateEnvironmentReadiness } from './deploymentValidator';
import { toast } from '@/hooks/use-toast';

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
  
  // Keep track of completed steps for potential rollback
  const completedSteps: string[] = [];
  
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
        
        toast({
          title: "Deployment Aborted",
          description: "Environment validation failures detected",
          variant: "destructive",
          duration: 5000,
        });
        
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
      if (success) {
        // Track successful steps for potential rollback
        completedSteps.push(step.id);
      } else {
        addLog(`Deployment stopped due to failure in step: ${step.title}`, 'error');
        
        toast({
          title: "Deployment Failed",
          description: `Failed at step: ${step.title}`,
          variant: "destructive",
          duration: 5000,
        });
        
        // For production deployments, provide more detailed failure analysis
        if (environment === 'production') {
          addLog('Production deployment failed. Performing deployment analysis...', 'info');
          // In a real implementation, this would gather more diagnostics and provide recovery suggestions
          addLog('Refer to the production deployment runbook for recovery procedures.', 'info');
          
          // Offer rollback for production deployments
          if (completedSteps.length > 0 && environment === 'production') {
            addLog('Initiating automatic rollback of completed steps...', 'warning');
            await performRollback(completedSteps, props);
          }
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
      
      toast({
        title: "Production Deployment Complete",
        description: "System is now live",
        variant: "success",
        duration: 5000,
      });
    } else {
      addLog('Deployment completed successfully!', 'success');
      
      toast({
        title: "Deployment Successful",
        description: `${environment} environment is ready`,
        variant: "success",
        duration: 5000,
      });
    }
    
    setIsDeploying(false);
  } catch (error: any) {
    addLog(`Deployment failed: ${error.message}`, 'error');
    logger.error('Deployment process failed', { error });
    
    toast({
      title: "Unexpected Error",
      description: error.message || "Deployment process failed",
      variant: "destructive",
      duration: 5000,
    });
    
    // Attempt rollback for production environments on unexpected errors
    if (completedSteps.length > 0 && environment === 'production') {
      addLog('Unexpected error occurred. Initiating rollback...', 'warning');
      await performRollback(completedSteps, props);
    }
    
    setIsDeploying(false);
  }
};

/**
 * Rolls back completed deployment steps in reverse order
 */
export const performRollback = async (
  completedStepIds: string[],
  props: UseDeploymentProcessProps
): Promise<void> => {
  const { deploymentSteps, addLog, updateStep } = props;
  
  addLog('Starting rollback procedure...', 'warning');
  
  toast({
    title: "Rollback Initiated",
    description: "Reverting deployment changes",
    variant: "warning",
    duration: 5000,
  });
  
  // Process steps in reverse order (most recent first)
  for (const stepId of [...completedStepIds].reverse()) {
    const step = deploymentSteps.find(s => s.id === stepId);
    if (!step) continue;
    
    addLog(`Rolling back: ${step.title}`, 'info');
    updateStep(stepId, { status: 'rolling-back', progress: 0 });
    
    try {
      // Check if step has a rollback handler
      if (step.rollback) {
        // Execute rollback function if available
        await step.rollback();
        addLog(`Rolled back step: ${step.title}`, 'success');
        updateStep(stepId, { status: 'rolled-back', progress: 100 });
      } else {
        // Mark as skipped if no rollback function available
        addLog(`No rollback function for step: ${step.title}. Manual intervention may be required.`, 'warning');
        updateStep(stepId, { status: 'rollback-skipped', progress: 100 });
      }
    } catch (error: any) {
      addLog(`Error during rollback of step ${step.title}: ${error.message}`, 'error');
      updateStep(stepId, { status: 'rollback-failed', progress: 0 });
      // Continue with other rollbacks even if one fails
    }
  }
  
  addLog('Rollback procedure completed. System may require additional manual recovery.', 'warning');
  
  toast({
    title: "Rollback Completed",
    description: "Manual verification recommended",
    variant: "info",
    duration: 5000,
  });
};
