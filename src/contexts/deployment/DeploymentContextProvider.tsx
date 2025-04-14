
import React, { createContext, useMemo, ReactNode } from 'react';
import { DeploymentContextType } from './DeploymentContextTypes';

import { useDeploymentLogs } from '../../hooks/useDeploymentLogs';
import { useDeploymentSteps } from '../../hooks/useDeploymentSteps';
import { useClusterConnection } from '../../hooks/useClusterConnection';
import { useDeploymentProcess } from '../../hooks/useDeploymentProcess';

import { ConfigProvider, useConfig } from './providers/ConfigProvider';
import { ProgressProvider, useProgress } from './providers/ProgressProvider';
import { SummaryProvider, useSummary } from './providers/SummaryProvider';

export const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

export const DeploymentContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core hooks
  const { logs, addLog, exportLogs, clearLogs } = useDeploymentLogs();
  
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

  // Compose the inner content with all providers
  const InnerContent: React.FC = () => {
    // Access the context from providers
    const { overallProgress } = useProgress();
    
    const {
      deploymentConfig,
      environment,
      setDeploymentEnvironment,
      updateDeploymentConfig
    } = useConfig();
    
    const { getDeploymentSummary } = useSummary();

    // Hook that depends on other contexts
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

  return (
    <ConfigProvider
      provider={provider}
      isDeploying={false}
      addLog={addLog}
    >
      <ProgressProvider
        deploymentSteps={deploymentSteps}
        environment="development"
      >
        <SummaryProvider
          deploymentSteps={deploymentSteps}
          isConnected={isConnected}
          provider={provider}
          clusterStatus={clusterStatus}
          isDeploying={false}
          environment="development"
          overallProgress={0}
          serviceStatus={serviceStatus}
        >
          <InnerContent />
        </SummaryProvider>
      </ProgressProvider>
    </ConfigProvider>
  );
};
