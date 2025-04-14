
import { DeploymentStep, DeploymentConfig, DeploymentEnvironment, CloudProvider } from '../../types/deployment';

export interface UseDeploymentProcessProps {
  deploymentSteps: DeploymentStep[];
  isConnected: boolean;
  updateStep: (stepId: string, updates: Partial<DeploymentStep>) => void;
  setCurrentStep: (stepId: string) => void;
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  addLog: (log: string, type?: 'info' | 'error' | 'warning') => void;
  deploymentConfig: DeploymentConfig | undefined;
  environment: DeploymentEnvironment;
}

export interface UseDeploymentProcess {
  isDeploying: boolean;
  runStep: (stepId: string, timeoutMs?: number) => Promise<boolean>;
  retryStep: (stepId: string) => Promise<boolean>;
  startDeployment: () => Promise<void>;
  cancelDeployment: () => void;
}
