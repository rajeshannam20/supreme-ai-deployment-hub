
import { useCallback, useState } from 'react';
import { DeploymentStep, DeploymentConfig, DeploymentEnvironment, CloudProvider } from '../types/deployment';
import { executeCloudCommand, CloudCommandResult } from '../services/deployment/cloudExecutionService';
import { createLogger } from '../services/deployment/loggingService';

interface UseDeploymentProcessProps {
  deploymentSteps: DeploymentStep[];
  isConnected: boolean;
  updateStep: (stepId: string, updates: Partial<DeploymentStep>) => void;
  setCurrentStep: (stepId: string) => void;
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  addLog: (log: string, type?: 'info' | 'error' | 'warning') => void;
  deploymentConfig: DeploymentConfig | undefined;
  environment: DeploymentEnvironment;
}

interface UseDeploymentProcess {
  isDeploying: boolean;
  runStep: (stepId: string, timeoutMs?: number) => Promise<boolean>;
  retryStep: (stepId: string) => Promise<boolean>;
  startDeployment: () => Promise<void>;
  cancelDeployment: () => void;
}

export const useDeploymentProcess = ({
  deploymentSteps,
  isConnected,
  updateStep,
  setCurrentStep,
  connectToCluster,
  addLog,
  deploymentConfig,
  environment
}: UseDeploymentProcessProps): UseDeploymentProcess => {
  const [isDeploying, setIsDeploying] = useState(false);
  const logger = createLogger(environment, deploymentConfig?.provider || 'aws');

  const runStep = useCallback(async (stepId: string, timeoutMs: number = 120000): Promise<boolean> => {
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
            errorCode: commandResult.errorCode,
            errorDetails: commandResult.errorDetails
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
  }, [deploymentSteps, isConnected, updateStep, setCurrentStep, connectToCluster, addLog, deploymentConfig, environment, logger]);

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
  }, [deploymentSteps, runStep, addLog, updateStep, setIsDeploying]);

  const cancelDeployment = useCallback(() => {
    setIsDeploying(false);
    addLog('Deployment cancelled.');
    // Implement any necessary cancellation logic here
  }, [setIsDeploying, addLog]);

  return { isDeploying, runStep, retryStep, startDeployment, cancelDeployment };
};

