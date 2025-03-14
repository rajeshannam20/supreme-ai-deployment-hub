
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { DeploymentStatus, DeploymentStep, ServiceStatus, ClusterStatus } from '../types/deployment';
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
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  disconnectFromCluster: () => boolean;
  startDeployment: () => Promise<void>;
  runStep: (stepId: string, timeoutMs?: number) => Promise<boolean>;
  cancelDeployment: () => void;
}

// Create the context
const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

// Provider component
export const DeploymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { logs, addLog } = useDeploymentLogs();
  const { deploymentSteps, currentStep, setCurrentStep, updateStep } = useDeploymentSteps();
  const { isConnected, isConnecting, clusterStatus, serviceStatus, connectToCluster, disconnectFromCluster } = useClusterConnection(addLog);
  const { isDeploying, runStep, startDeployment, cancelDeployment } = useDeploymentProcess({
    deploymentSteps,
    isConnected,
    updateStep,
    setCurrentStep,
    connectToCluster,
    addLog
  });

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
        connectToCluster,
        disconnectFromCluster,
        startDeployment,
        runStep,
        cancelDeployment,
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
export type { DeploymentStatus, DeploymentStep, ServiceStatus, ClusterStatus };
