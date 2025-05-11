
import { ReactNode } from 'react';

// Types for logging
export type LogType = 'info' | 'error' | 'warning' | 'success' | 'debug';

// Main deployment context type
export interface DeploymentContextType {
  // State
  isDeploying: boolean;
  progress: number;
  logs: string[];
  status: 'idle' | 'running' | 'success' | 'error' | 'canceled';
  
  // Actions
  startDeployment: () => void;
  cancelDeployment: () => void;
  resetDeployment: () => void;
  addLog: (message: string, type?: LogType, context?: Record<string, any>) => void;
  clearLogs: () => void;
  
  // Configuration
  environment: string;
  setEnvironment: (env: string) => void;
  provider: string;
  setProvider: (provider: string) => void;
}

export interface DeploymentProviderProps {
  children: ReactNode;
}
