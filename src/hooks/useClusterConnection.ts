
import { useState } from 'react';
import { ClusterStatus, ServiceStatus } from '../types/deployment';
import { toast } from 'sonner';

export const useClusterConnection = (addLog: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [clusterStatus, setClusterStatus] = useState<ClusterStatus>({
    nodes: 0,
    pods: 0,
    services: 0,
    deployments: 0,
    status: 'Disconnected',
  });
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus[]>([]);

  // Connect to Kubernetes cluster with automatic retry
  const connectToCluster = async (kubeConfig?: string): Promise<boolean> => {
    if (isConnecting) {
      addLog('Connection attempt already in progress', 'warning');
      return false;
    }
    
    setIsConnecting(true);
    addLog('Attempting to connect to Kubernetes cluster...', 'info');
    
    // Increment connection attempts
    const attempts = connectionAttempts + 1;
    setConnectionAttempts(attempts);
    
    try {
      // Simulating connection to a Kubernetes cluster
      await new Promise((resolve, reject) => {
        // Simulate occasional connection failures (1 in 4 chance of failure)
        const shouldFail = Math.random() < 0.25;
        
        setTimeout(() => {
          if (shouldFail && attempts < 3) {
            reject(new Error('Connection timeout'));
          } else {
            resolve(true);
          }
        }, 2000);
      });
      
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
      setIsConnecting(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Connection attempt ${attempts} failed: ${errorMessage}`, 'error');
      
      // Auto-retry logic for first and second attempts
      if (attempts < 3) {
        addLog(`Automatically retrying connection (attempt ${attempts + 1}/3)...`, 'warning');
        toast.warning(`Connection failed. Retrying (${attempts + 1}/3)...`);
        setIsConnecting(false);
        return connectToCluster(kubeConfig);
      }
      
      toast.error('Failed to connect to Kubernetes cluster after multiple attempts');
      setIsConnecting(false);
      return false;
    }
  };

  // Disconnect from cluster
  const disconnectFromCluster = () => {
    if (isConnected) {
      setIsConnected(false);
      setClusterStatus({
        nodes: 0,
        pods: 0,
        services: 0,
        deployments: 0,
        status: 'Disconnected',
      });
      setServiceStatus([]);
      setConnectionAttempts(0);
      addLog('Disconnected from Kubernetes cluster', 'info');
      toast.info('Disconnected from cluster');
      return true;
    }
    return false;
  };

  return {
    isConnected,
    isConnecting,
    clusterStatus,
    serviceStatus,
    connectToCluster,
    disconnectFromCluster
  };
};
