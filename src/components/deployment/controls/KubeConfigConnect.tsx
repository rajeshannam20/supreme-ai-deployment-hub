
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Server, Power } from 'lucide-react';
import { useDeployment } from '@/contexts/DeploymentContext';

const KubeConfigConnect = () => {
  const [kubeConfig, setKubeConfig] = useState('');
  const { isConnected, isConnecting, isDeploying, connectToCluster, disconnectFromCluster } = useDeployment();

  const handleConnect = async () => {
    await connectToCluster(kubeConfig);
  };

  const handleDisconnect = () => {
    disconnectFromCluster();
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
      <div className="flex gap-2">
        <Input
          placeholder="Paste your kubeconfig or leave blank for local"
          value={kubeConfig}
          onChange={(e) => setKubeConfig(e.target.value)}
          className="flex-1"
          disabled={isConnecting}
        />
        <Button onClick={handleConnect} disabled={isConnecting}>
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
    </div>
  );
};

export default KubeConfigConnect;
