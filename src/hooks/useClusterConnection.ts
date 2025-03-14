
import { useState } from 'react';
import { ClusterStatus, ServiceStatus } from '../types/deployment';
import { toast } from 'sonner';

export const useClusterConnection = (addLog: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [clusterStatus, setClusterStatus] = useState<ClusterStatus>({
    nodes: 0,
    pods: 0,
    services: 0,
    deployments: 0,
    status: 'Disconnected',
  });
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus[]>([]);

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

  return {
    isConnected,
    clusterStatus,
    serviceStatus,
    connectToCluster
  };
};
