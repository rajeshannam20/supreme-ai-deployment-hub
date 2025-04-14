
import { useState } from 'react';
import { ClusterStatus, ServiceStatus, CloudProvider, CloudProviderCredentials } from '../types/deployment';
import { toast } from 'sonner';
import { connectToKubernetesCluster } from '../services/deployment/kubernetesService';

export const useClusterConnection = (addLog: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [provider, setProvider] = useState<CloudProvider>('aws');
  const [providerCredentials, setProviderCredentials] = useState<CloudProviderCredentials | null>(null);
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
      // Use the actual Kubernetes connection service
      const result = await connectToKubernetesCluster({
        kubeConfig,
        provider,
        attempt: attempts
      });
      
      if (result.connected) {
        // Successfully connected
        setIsConnected(true);
        setClusterStatus({
          nodes: result.clusterInfo.nodes,
          pods: result.clusterInfo.pods,
          services: result.clusterInfo.services,
          deployments: result.clusterInfo.deployments,
          status: result.clusterInfo.status,
          provider: result.clusterInfo.provider,
          region: result.clusterInfo.region,
          version: result.clusterInfo.version,
          uptime: result.clusterInfo.uptime,
        });
        
        setServiceStatus(result.serviceStatuses);
        
        // Update provider credentials if available
        if (result.providerCredentials) {
          setProviderCredentials(result.providerCredentials);
          setProvider(result.providerCredentials.provider);
        }
        
        addLog('Successfully connected to Kubernetes cluster', 'success');
        toast.success('Connected to Kubernetes cluster');
        setIsConnecting(false);
        return true;
      } else {
        throw new Error(result.error || 'Failed to connect to cluster');
      }
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

  // Set cloud provider
  const setCloudProvider = (newProvider: CloudProvider) => {
    if (isConnected) {
      addLog('Cannot change provider while connected to a cluster', 'warning');
      toast.warning('Disconnect from the current cluster first');
      return false;
    }
    
    setProvider(newProvider);
    addLog(`Cloud provider set to ${newProvider}`, 'info');
    return true;
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
      setProviderCredentials(null);
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
    provider,
    providerCredentials,
    connectToCluster,
    disconnectFromCluster,
    setCloudProvider
  };
};
