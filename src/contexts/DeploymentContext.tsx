
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  DeploymentStatus, 
  DeploymentStep, 
  ServiceStatus, 
  ClusterStatus, 
  CloudProvider,
  DeploymentConfig,
  DeploymentEnvironment,
  CloudProviderCredentials
} from '../types/deployment';
import { useDeploymentLogs } from '../hooks/useDeploymentLogs';
import { useDeploymentSteps } from '../hooks/useDeploymentSteps';
import { useClusterConnection } from '../hooks/useClusterConnection';
import { useDeploymentProcess } from '../hooks/useDeploymentProcess';

// Context interface
interface DeploymentContextType {
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
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  disconnectFromCluster: () => boolean;
  setCloudProvider: (provider: CloudProvider) => boolean;
  setDeploymentEnvironment: (environment: DeploymentEnvironment) => void;
  updateDeploymentConfig: (config: Partial<DeploymentConfig>) => void;
  startDeployment: () => Promise<void>;
  runStep: (stepId: string, timeoutMs?: number) => Promise<boolean>;
  cancelDeployment: () => void;
  getDeploymentSummary: () => string;
}

// Create the context
const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

// Provider component
export const DeploymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { logs, addLog } = useDeploymentLogs();
  const { deploymentSteps, currentStep, setCurrentStep, updateStep } = useDeploymentSteps();
  const { 
    isConnected, 
    isConnecting, 
    clusterStatus, 
    serviceStatus, 
    provider, 
    providerCredentials,
    connectToCluster, 
    disconnectFromCluster,
    setCloudProvider 
  } = useClusterConnection(addLog);
  
  const [environment, setEnvironment] = useState<DeploymentEnvironment>('development');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig | null>(null);

  // Initialize deployment config when provider changes
  useEffect(() => {
    setDeploymentConfig({
      provider,
      environment,
      region: provider === 'aws' ? 'us-west-2' : 
              provider === 'azure' ? 'eastus' : 
              provider === 'gcp' ? 'us-central1' : '',
      clusterName: `devonn-${environment}`,
      namespace: 'default',
      useExistingCluster: false,
      resourcePrefix: `devonn-${environment}`,
      tags: {
        environment,
        project: 'devonn-ai',
        managedBy: 'devonn-dashboard'
      }
    });
  }, [provider, environment]);

  const { isDeploying, runStep, startDeployment, cancelDeployment } = useDeploymentProcess({
    deploymentSteps,
    isConnected,
    updateStep,
    setCurrentStep,
    connectToCluster,
    addLog,
    deploymentConfig: deploymentConfig || undefined
  });

  // Update deployment environment
  const setDeploymentEnvironment = (newEnvironment: DeploymentEnvironment) => {
    if (isDeploying) {
      addLog('Cannot change environment while deployment is in progress', 'warning');
      return;
    }
    
    setEnvironment(newEnvironment);
    if (deploymentConfig) {
      setDeploymentConfig({
        ...deploymentConfig,
        environment: newEnvironment,
        clusterName: `devonn-${newEnvironment}`,
        resourcePrefix: `devonn-${newEnvironment}`,
        tags: {
          ...deploymentConfig.tags,
          environment: newEnvironment
        }
      });
    }
    
    addLog(`Deployment environment set to ${newEnvironment}`, 'info');
  };

  // Update deployment configuration
  const updateDeploymentConfig = (config: Partial<DeploymentConfig>) => {
    if (isDeploying) {
      addLog('Cannot update configuration while deployment is in progress', 'warning');
      return;
    }
    
    if (deploymentConfig) {
      setDeploymentConfig({
        ...deploymentConfig,
        ...config
      });
      
      addLog('Deployment configuration updated', 'info');
    }
  };

  // Calculate overall progress when deployment steps change
  useEffect(() => {
    const completedSteps = deploymentSteps.filter(step => step.status === 'success').length;
    const inProgressSteps = deploymentSteps.filter(step => step.status === 'in-progress');
    
    if (inProgressSteps.length > 0) {
      const currentProgress = inProgressSteps[0].progress / 100;
      const overallProgress = (completedSteps + currentProgress) / deploymentSteps.length * 100;
      console.log(`Deployment progress: ${Math.floor(overallProgress)}%`);
    }
  }, [deploymentSteps]);

  // New function to get a summary of the deployment status
  const getDeploymentSummary = (): string => {
    const completedSteps = deploymentSteps.filter(step => step.status === 'success').length;
    const totalSteps = deploymentSteps.length;
    const failedSteps = deploymentSteps.filter(step => step.status === 'error').length;
    
    let status = '';
    if (isConnected) {
      status += `Connected to ${provider} cluster in ${clusterStatus.region || 'unknown region'}. `;
    } else {
      status += `Not connected to any cluster. `;
    }
    
    if (isDeploying) {
      status += `Deployment in progress (${environment} environment). `;
    }
    
    status += `${completedSteps}/${totalSteps} steps completed. `;
    
    if (failedSteps > 0) {
      status += `${failedSteps} step(s) failed. `;
    }
    
    if (serviceStatus.length > 0) {
      const runningServices = serviceStatus.filter(s => s.status === 'Running').length;
      status += `${runningServices}/${serviceStatus.length} services running.`;
    }
    
    return status;
  };

  return (
    <DeploymentContext.Provider
      value={{
        deploymentSteps,
        clusterStatus,
        serviceStatus,
        logs,
        currentStep,
        isConnected,
        isConnecting,
        isDeploying,
        provider,
        providerCredentials,
        deploymentConfig,
        environment,
        connectToCluster,
        disconnectFromCluster,
        setCloudProvider,
        setDeploymentEnvironment,
        updateDeploymentConfig,
        startDeployment,
        runStep,
        cancelDeployment,
        getDeploymentSummary,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
};

// Custom hook for using the deployment context
export const useDeployment = () => {
  const context = useContext(DeploymentContext);
  if (context === undefined) {
    throw new Error('useDeployment must be used within a DeploymentProvider');
  }
  return context;
};

// Export types for use in other files
export type { 
  DeploymentStatus, 
  DeploymentStep, 
  ServiceStatus, 
  ClusterStatus,
  CloudProvider,
  DeploymentConfig,
  DeploymentEnvironment
};
