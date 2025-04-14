
import React, { createContext, useCallback, useEffect, useMemo, useState, ReactNode, useRef } from 'react';
import { DeploymentContextType } from './DeploymentContextTypes';
import { 
  CloudProvider,
  DeploymentConfig,
  DeploymentEnvironment
} from '../../types/deployment';

import { useDeploymentLogs } from '../../hooks/useDeploymentLogs';
import { useDeploymentSteps } from '../../hooks/useDeploymentSteps';
import { useClusterConnection } from '../../hooks/useClusterConnection';
import { useDeploymentProcess } from '../../hooks/useDeploymentProcess';
import { createLogger } from '../../services/deployment/loggingService';

// Create the context
export const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

// Provider component
export const DeploymentContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  
  // Track last calculated progress
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const lastProgressUpdateRef = useRef<number>(0);

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
  // Using a ref to prevent infinite update loops
  useEffect(() => {
    const calculateProgress = () => {
      const completedSteps = deploymentSteps.filter(step => step.status === 'success').length;
      const totalSteps = deploymentSteps.length;
      const inProgressSteps = deploymentSteps.filter(step => step.status === 'in-progress');
      
      let progress = 0;
      if (inProgressSteps.length > 0) {
        const currentProgress = inProgressSteps[0].progress / 100;
        progress = (completedSteps + currentProgress) / totalSteps * 100;
      } else {
        progress = (completedSteps / totalSteps) * 100;
      }
      
      // Round to 2 decimal places
      const roundedProgress = Math.round(progress * 100) / 100;
      
      // Only update if progress has changed significantly (avoid unnecessary re-renders)
      if (Math.abs(roundedProgress - lastProgressUpdateRef.current) >= 0.5) {
        setOverallProgress(roundedProgress);
        lastProgressUpdateRef.current = roundedProgress;
        
        // Log progress changes
        if (environment === 'production' || roundedProgress % 10 < 0.5) {
          logger.info(`Deployment progress: ${Math.floor(roundedProgress)}%`, {
            completedSteps,
            totalSteps,
            currentStep: inProgressSteps.length > 0 ? inProgressSteps[0].id : 'none',
            statusBreakdown: {
              completed: completedSteps,
              inProgress: inProgressSteps.length,
              pending: totalSteps - completedSteps - inProgressSteps.length
            }
          });
        }
      }
    };
    
    // Calculate initial progress
    calculateProgress();
  }, [deploymentSteps, environment, logger]); // Only recalculate when steps or environment changes

  // Get a summary of the deployment status
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
      status += `Deployment in progress (${environment} environment): ${Math.round(overallProgress)}% complete. `;
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
  }, [deploymentSteps, isConnected, provider, clusterStatus.region, isDeploying, environment, overallProgress, serviceStatus]);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => ({
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
    overallProgress,
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
  }), [
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
    overallProgress,
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
  ]);

  return (
    <DeploymentContext.Provider value={contextValue}>
      {children}
    </DeploymentContext.Provider>
  );
};
