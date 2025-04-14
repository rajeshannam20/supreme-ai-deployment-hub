
import { 
  CloudProvider,
  DeploymentConfig,
  DeploymentEnvironment,
  DeploymentStatus,
  DeploymentStep,
  ServiceStatus,
  ClusterStatus,
  CloudProviderCredentials
} from '../../types/deployment';

// Context interface
export interface DeploymentContextType {
  deploymentSteps: DeploymentStep[];
  clusterStatus: ClusterStatus;
  serviceStatus: ServiceStatus[];
  logs: string[];
  currentStep: string;
  isConnected: boolean;
  isConnecting: boolean;
  isDeploying: boolean;
  provider: CloudProvider;
  providerCredentials: CloudProviderCredentials | null;
  deploymentConfig: DeploymentConfig | null;
  environment: DeploymentEnvironment;
  overallProgress: number; // Added overall progress percentage
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  disconnectFromCluster: () => boolean;
  setCloudProvider: (provider: CloudProvider) => boolean;
  setDeploymentEnvironment: (environment: DeploymentEnvironment) => void;
  updateDeploymentConfig: (config: Partial<DeploymentConfig>) => void;
  startDeployment: () => Promise<void>;
  runStep: (stepId: string, timeoutMs?: number) => Promise<boolean>;
  retryStep?: (stepId: string) => Promise<boolean>;
  cancelDeployment: () => void;
  getDeploymentSummary: () => string;
  exportLogs?: () => string;
  clearLogs?: () => void;
}
