
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
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
import { createLogger } from '../services/deployment/loggingService';

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
  retryStep?: (stepId: string) => Promise<boolean>;
  cancelDeployment: () => void;
  getDeploymentSummary: () => string;
  exportLogs?: () => string;
  clearLogs?: () => void;
}

// Create the context
const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

// Provider component
export const DeploymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the context logger
  const logger = createLogger('development', 'aws');
  
  // Get deployment logs handling
  const { logs, addLog, exportLogs, clearLogs } = useDeploymentLogs();
  
  // Get deployment steps state management
  const { deploymentSteps, currentStep, setCurrentStep, updateStep } = useDeploymentSteps();
  
  // Get cluster connection handling
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
  
  // State for environment and deployment config
  const [environment, setEnvironment] = useState<DeploymentEnvironment>('development');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig | null>(null);

  // Create a memoized config update function that doesn't change on every render
  const updateDeploymentConfigWithDefaults = useCallback((env: DeploymentEnvironment, prov: CloudProvider) => {
    logger.info('Updating deployment configuration', { provider: prov, environment: env });
    
    setDeploymentConfig({
      provider: prov,
      environment: env,
      region: prov === 'aws' ? 'us-west-2' : 
              prov === 'azure' ? 'eastus' : 
              prov === 'gcp' ? 'us-central1' : '',
      clusterName: `devonn-${env}`,
      namespace: 'default',
      useExistingCluster: false,
      resourcePrefix: `devonn-${env}`,
      tags: {
        environment: env,
        project: 'devonn-ai',
        managedBy: 'devonn-dashboard'
      }
    });
  }, [logger]);

  // Initialize deployment config when provider or environment changes
  useEffect(() => {
    updateDeploymentConfigWithDefaults(environment, provider);
  }, [provider, environment, updateDeploymentConfigWithDefaults]);

  // Get deployment process management with error handling
  const { isDeploying, runStep, retryStep, startDeployment, cancelDeployment } = useDeploymentProcess({
    deploymentSteps,
    isConnected,
    updateStep,
    setCurrentStep,
    connectToCluster,
    addLog,
    deploymentConfig: deploymentConfig || undefined,
    environment
  });

  // Update deployment environment
  const setDeploymentEnvironment = useCallback((newEnvironment: DeploymentEnvironment) => {
    if (isDeploying) {
      addLog('Cannot change environment while deployment is in progress', 'warning');
      return;
    }
    
    logger.info(`Changing deployment environment to ${newEnvironment}`);
    setEnvironment(newEnvironment);
    
    addLog(`Deployment environment set to ${newEnvironment}`, 'info');
  }, [isDeploying, addLog, logger]);

  // Update deployment configuration
  const updateDeploymentConfig = useCallback((config: Partial<DeploymentConfig>) => {
    if (isDeploying) {
      addLog('Cannot update configuration while deployment is in progress', 'warning');
      return;
    }
    
    if (deploymentConfig) {
      logger.info('Updating deployment configuration', { 
        changes: Object.keys(config),
        provider: config.provider || deploymentConfig.provider
      });
      
      setDeploymentConfig(prevConfig => ({
        ...prevConfig!,
        ...config
      }));
      
      addLog('Deployment configuration updated', 'info');
    }
  }, [isDeploying, addLog, logger, deploymentConfig]);

  // Calculate overall progress when deployment steps change
  useEffect(() => {
    const completedSteps = deploymentSteps.filter(step => step.status === 'success').length;
    const inProgressSteps = deploymentSteps.filter(step => step.status === 'in-progress');
    
    if (inProgressSteps.length > 0) {
      const currentProgress = inProgressSteps[0].progress / 100;
      const overallProgress = (completedSteps + currentProgress) / deploymentSteps.length * 100;
      
      if (environment === 'production') {
        logger.info(`Deployment progress: ${Math.floor(overallProgress)}%`, {
          completedSteps,
          totalSteps: deploymentSteps.length,
          currentStep: inProgressSteps[0].id
        });
      }
    }
  }, [deploymentSteps, environment, logger]);

  // New function to get a summary of the deployment status
  const getDeploymentSummary = useCallback((): string => {
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
  }, [deploymentSteps, isConnected, provider, clusterStatus.region, isDeploying, environment, serviceStatus]);

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
        retryStep,
        cancelDeployment,
        getDeploymentSummary,
        exportLogs,
        clearLogs
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
