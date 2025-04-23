
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Server, Power, AlertCircle } from 'lucide-react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const KubeConfigConnect = () => {
  const [kubeConfig, setKubeConfig] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { isConnected, isConnecting, isDeploying, connectToCluster, disconnectFromCluster } = useDeployment();

  const handleConnect = async () => {
    setConnectionError(null);
    try {
      const success = await connectToCluster(kubeConfig);
      if (!success) {
        setConnectionError("Failed to connect to the cluster. Please check your kubeconfig.");
        toast.error("Connection failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown connection error";
      setConnectionError(errorMessage);
      toast.error("Connection error: " + errorMessage);
    }
  };

  const handleDisconnect = () => {
    disconnectFromCluster();
    setConnectionError(null);
    setKubeConfig('');
  };

  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm">Connected to Kubernetes cluster</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={isDeploying}>
            <Power className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect to your Kubernetes cluster to start deployment
      </p>
      
      {connectionError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {connectionError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 flex-col sm:flex-row">
        <Input
          placeholder="Paste your kubeconfig or leave blank for local"
          value={kubeConfig}
          onChange={(e) => setKubeConfig(e.target.value)}
          className="flex-1"
          disabled={isConnecting}
        />
        <Button onClick={handleConnect} disabled={isConnecting} className="sm:w-auto w-full">
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Server className="mr-2 h-4 w-4" />
              Connect
            </>
          )}
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        <p>Troubleshooting tips:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Ensure kubeconfig has proper permissions</li>
          <li>Check if kubectl works in your terminal</li>
          <li>For local clusters, make sure the cluster is running</li>
        </ul>
      </div>
    </div>
  );
};

export default KubeConfigConnect;
