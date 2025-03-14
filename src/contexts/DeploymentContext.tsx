
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define the types for our deployment data
export type DeploymentStatus = 'success' | 'warning' | 'error' | 'pending' | 'in-progress';

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: DeploymentStatus;
  icon: string;
  progress: number;
}

export interface ServiceStatus {
  name: string;
  status: string;
  pods: string;
  cpu: string;
  memory: string;
}

export interface ClusterStatus {
  nodes: number;
  pods: number;
  services: number;
  deployments: number;
  status: string;
}

// Context interface
interface DeploymentContextType {
  deploymentSteps: DeploymentStep[];
  clusterStatus: ClusterStatus;
  serviceStatus: ServiceStatus[];
  logs: string[];
  currentStep: string;
  isConnected: boolean;
  isDeploying: boolean;
  connectToCluster: (kubeConfig?: string) => Promise<boolean>;
  startDeployment: () => Promise<void>;
  runStep: (stepId: string) => Promise<boolean>;
  cancelDeployment: () => void;
}

// Create the context
const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

// Provider component
export const DeploymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      description: 'Set up cloud provider and install required tools',
      status: 'pending',
      icon: '/lovable-uploads/a65e1231-578b-497e-8b86-06503b0b6eae.png',
      progress: 0,
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Setup',
      description: 'Configure Kubernetes cluster and persistent storage',
      status: 'pending',
      icon: '/lovable-uploads/3ae77958-660d-4e58-9ea4-8fec69755b33.png',
      progress: 0,
    },
    {
      id: 'backend',
      title: 'Backend Services',
      description: 'Deploy backend services and APIs',
      status: 'pending',
      icon: '/lovable-uploads/e06effdb-49e8-415b-ba43-d67319d4d975.png',
      progress: 0,
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      description: 'Set up Prometheus and Grafana',
      status: 'pending',
      icon: '/lovable-uploads/89803b30-4c31-445d-b3a9-4ce66f2d4135.png',
      progress: 0,
    },
    {
      id: 'testing',
      title: 'Testing',
      description: 'Run end-to-end and load tests',
      status: 'pending',
      icon: '/lovable-uploads/b6150d98-c2bc-47a2-8da1-2391d04d8dce.png',
      progress: 0,
    },
    {
      id: 'finalize',
      title: 'Finalize',
      description: 'Update DNS and announce launch',
      status: 'pending',
      icon: '/lovable-uploads/5fe3964f-7cb4-4a09-a27b-fc5233b042dc.png',
      progress: 0,
    },
  ]);

  const [clusterStatus, setClusterStatus] = useState<ClusterStatus>({
    nodes: 0,
    pods: 0,
    services: 0,
    deployments: 0,
    status: 'Disconnected',
  });

  const [serviceStatus, setServiceStatus] = useState<ServiceStatus[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Add a log entry with timestamp
  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logEntry]);
  };

  // Update a specific step
  const updateStep = (stepId: string, update: Partial<DeploymentStep>) => {
    setDeploymentSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, ...update } : step
      )
    );
  };

  // Connect to Kubernetes cluster
  const connectToCluster = async (kubeConfig?: string): Promise<boolean> => {
    addLog('Attempting to connect to Kubernetes cluster...');
    
    try {
      // Simulating connection to a Kubernetes cluster
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Successfully connected
      setIsConnected(true);
      setClusterStatus({
        nodes: 3,
        pods: 12,
        services: 8,
        deployments: 5,
        status: 'Healthy',
      });
      
      setServiceStatus([
        { name: 'devonn-ai-backend', status: 'Running', pods: '3/3', cpu: '45%', memory: '512Mi' },
        { name: 'devonn-ai-frontend', status: 'Running', pods: '2/2', cpu: '30%', memory: '256Mi' },
        { name: 'devonn-ai-inference', status: 'Running', pods: '2/3', cpu: '85%', memory: '1.2Gi' },
        { name: 'devonn-ai-redis', status: 'Running', pods: '1/1', cpu: '10%', memory: '128Mi' },
        { name: 'devonn-ai-database', status: 'Running', pods: '1/1', cpu: '25%', memory: '512Mi' },
      ]);
      
      addLog('Successfully connected to Kubernetes cluster', 'success');
      toast.success('Connected to Kubernetes cluster');
      return true;
    } catch (error) {
      addLog(`Failed to connect to cluster: ${error}`, 'error');
      toast.error('Failed to connect to Kubernetes cluster');
      return false;
    }
  };

  // Simulate running a step
  const runStep = async (stepId: string): Promise<boolean> => {
    setCurrentStep(stepId);
    updateStep(stepId, { status: 'in-progress', progress: 10 });
    addLog(`Starting step: ${stepId}`);
    
    // Simulate step progress
    for (let progress = 20; progress <= 100; progress += 20) {
      if (!isDeploying) {
        updateStep(stepId, { status: 'error', progress: progress - 20 });
        addLog(`Step ${stepId} cancelled`, 'warning');
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep(stepId, { progress });
      addLog(`${stepId}: Progress ${progress}%`);
    }
    
    updateStep(stepId, { status: 'success', progress: 100 });
    addLog(`Completed step: ${stepId}`, 'success');
    return true;
  };

  // Start the full deployment process
  const startDeployment = async (): Promise<void> => {
    if (isDeploying) {
      toast.warning('Deployment already in progress');
      return;
    }
    
    if (!isConnected) {
      const connected = await connectToCluster();
      if (!connected) {
        toast.error('Cannot start deployment: Not connected to cluster');
        return;
      }
    }
    
    setIsDeploying(true);
    addLog('Starting DEVONN.AI Framework deployment', 'info');
    toast.info('Starting deployment process');
    
    // Reset all steps to pending
    setDeploymentSteps(steps =>
      steps.map(step => ({ ...step, status: 'pending', progress: 0 }))
    );
    
    // Run through each step sequentially
    for (const step of deploymentSteps) {
      const completed = await runStep(step.id);
      if (!completed) {
        addLog('Deployment process stopped', 'warning');
        setIsDeploying(false);
        return;
      }
    }
    
    addLog('DEVONN.AI Framework deployment completed successfully', 'success');
    toast.success('Deployment completed successfully');
    setIsDeploying(false);
  };

  // Cancel ongoing deployment
  const cancelDeployment = () => {
    if (isDeploying) {
      setIsDeploying(false);
      addLog('Deployment process cancelled by user', 'warning');
      toast.warning('Deployment cancelled');
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

  return (
    <DeploymentContext.Provider
      value={{
        deploymentSteps,
        clusterStatus,
        serviceStatus,
        logs,
        currentStep,
        isConnected,
        isDeploying,
        connectToCluster,
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
