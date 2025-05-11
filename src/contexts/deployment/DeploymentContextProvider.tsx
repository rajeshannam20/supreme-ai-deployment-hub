
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { DeploymentContextType, DeploymentProviderProps, LogType } from './DeploymentContextTypes';
import { useDeploymentLogs } from '@/hooks/useDeploymentLogs';

// Create the context with default values
export const DeploymentContext = createContext<DeploymentContextType>({
  isDeploying: false,
  progress: 0,
  logs: [],
  status: 'idle',
  startDeployment: () => {},
  cancelDeployment: () => {},
  resetDeployment: () => {},
  addLog: () => {},
  clearLogs: () => {},
  environment: 'development',
  setEnvironment: () => {},
  provider: 'aws',
  setProvider: () => {},
});

export const DeploymentProvider: React.FC<DeploymentProviderProps> = ({ children }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error' | 'canceled'>('idle');
  const [environment, setEnvironment] = useState('development');
  const [provider, setProvider] = useState('aws');
  
  // Use the deployment logs hook
  const { 
    logs, 
    addLog: addLogInternal, 
    clearLogs: clearLogsInternal 
  } = useDeploymentLogs(
    environment as any, 
    provider as any
  );
  
  // Start deployment
  const startDeployment = useCallback(() => {
    setIsDeploying(true);
    setStatus('running');
    setProgress(0);
    addLogInternal('Deployment started', 'info');
    
    // Simulate deployment progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          setStatus('success');
          addLogInternal('Deployment completed successfully', 'success');
          return 100;
        }
        return prev + 5;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [addLogInternal]);
  
  // Cancel deployment
  const cancelDeployment = useCallback(() => {
    setIsDeploying(false);
    setStatus('canceled');
    addLogInternal('Deployment canceled by user', 'warning');
  }, [addLogInternal]);
  
  // Reset deployment
  const resetDeployment = useCallback(() => {
    setIsDeploying(false);
    setProgress(0);
    setStatus('idle');
    addLogInternal('Deployment reset', 'info');
  }, [addLogInternal]);
  
  // Add log
  const addLog = useCallback((message: string, type: LogType = 'info', context?: Record<string, any>) => {
    addLogInternal(message, type, context);
  }, [addLogInternal]);
  
  // Clear logs
  const clearLogs = useCallback(() => {
    clearLogsInternal();
  }, [clearLogsInternal]);
  
  // Create the context value
  const value = useMemo(() => ({
    isDeploying,
    progress,
    logs,
    status,
    startDeployment,
    cancelDeployment,
    resetDeployment,
    addLog,
    clearLogs,
    environment,
    setEnvironment,
    provider,
    setProvider,
  }), [
    isDeploying, 
    progress, 
    logs, 
    status, 
    startDeployment, 
    cancelDeployment, 
    resetDeployment,
    addLog,
    clearLogs,
    environment,
    setEnvironment,
    provider,
    setProvider,
  ]);
  
  return (
    <DeploymentContext.Provider value={value}>
      {children}
    </DeploymentContext.Provider>
  );
};
