
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Play, XCircle, RefreshCw, Server } from 'lucide-react';

const DeploymentControls = () => {
  const [kubeConfig, setKubeConfig] = useState('');
  const { 
    isConnected, 
    isDeploying, 
    connectToCluster, 
    startDeployment, 
    cancelDeployment 
  } = useDeployment();

  const handleConnect = async () => {
    await connectToCluster(kubeConfig);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Controls</CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Connect to your Kubernetes cluster to start deployment
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste your kubeconfig or leave blank for local"
                  value={kubeConfig}
                  onChange={(e) => setKubeConfig(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleConnect}>
                  <Server className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm">Connected to Kubernetes cluster</span>
            </div>
            <div className="flex gap-2">
              {!isDeploying ? (
                <Button onClick={() => startDeployment()}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Deployment
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={cancelDeployment}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button variant="secondary" disabled>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeploymentControls;
