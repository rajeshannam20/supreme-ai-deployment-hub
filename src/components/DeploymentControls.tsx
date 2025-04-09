
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Play, XCircle, RefreshCw, Server, Loader2, Power, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DeploymentControls = () => {
  const [kubeConfig, setKubeConfig] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const { 
    isConnected, 
    isConnecting,
    isDeploying, 
    connectToCluster, 
    disconnectFromCluster,
    startDeployment, 
    cancelDeployment 
  } = useDeployment();

  const handleConnect = async () => {
    await connectToCluster(kubeConfig);
  };

  const handleDisconnect = () => {
    disconnectFromCluster();
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Deployment Controls</CardTitle>
            <CardDescription>Connect to your Kubernetes cluster and manage deployments</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowGuide(!showGuide)}
            className="h-8 w-8 p-0"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showGuide && (
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Deployment Guide</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal ml-4 text-sm space-y-2">
                <li>Set up AWS CLI and Terraform on your local machine</li>
                <li>Run <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">terraform init</code> and <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">terraform apply</code></li>
                <li>Get kubeconfig using <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">aws eks update-kubeconfig --name devonn-eks --region us-west-2</code></li>
                <li>Copy the kubeconfig file content and paste below</li>
                <li>Click Connect to establish cluster connection</li>
                <li>Start the deployment process when ready</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <Tabs defaultValue="kubeconfig">
              <TabsList className="w-full">
                <TabsTrigger value="kubeconfig" className="w-full">Kubeconfig</TabsTrigger>
                <TabsTrigger value="commands" className="w-full">Setup Commands</TabsTrigger>
              </TabsList>
              
              <TabsContent value="kubeconfig" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="commands">
                <div className="space-y-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-medium">Terraform Setup</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyCommand('terraform init && terraform plan -out=tfplan && terraform apply tfplan')}
                      >
                        <span className="sr-only">Copy</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 2V1H10V2H5ZM4.5 0H10.5C10.7761 0 11 0.223858 11 0.5V2.5C11 2.77614 10.7761 3 10.5 3H4.5C4.22386 3 4 2.77614 4 2.5V0.5C4 0.223858 4.22386 0 4.5 0ZM2 4V14H12V4H2ZM1 3H13C13.5523 3 14 3.44772 14 4V14C14 14.5523 13.5523 15 13 15H1C0.447715 15 0 14.5523 0 14V4C0 3.44772 0.447715 3 1 3Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto p-1">terraform init && terraform plan -out=tfplan && terraform apply tfplan</pre>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-medium">Get Kubeconfig</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyCommand('aws eks update-kubeconfig --name devonn-eks --region us-west-2')}
                      >
                        <span className="sr-only">Copy</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 2V1H10V2H5ZM4.5 0H10.5C10.7761 0 11 0.223858 11 0.5V2.5C11 2.77614 10.7761 3 10.5 3H4.5C4.22386 3 4 2.77614 4 2.5V0.5C4 0.223858 4.22386 0 4.5 0ZM2 4V14H12V4H2ZM1 3H13C13.5523 3 14 3.44772 14 4V14C14 14.5523 13.5523 15 13 15H1C0.447715 15 0 14.5523 0 14V4C0 3.44772 0.447715 3 1 3Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto p-1">aws eks update-kubeconfig --name devonn-eks --region us-west-2</pre>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-medium">Display Kubeconfig</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyCommand('cat ~/.kube/config')}
                      >
                        <span className="sr-only">Copy</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 2V1H10V2H5ZM4.5 0H10.5C10.7761 0 11 0.223858 11 0.5V2.5C11 2.77614 10.7761 3 10.5 3H4.5C4.22386 3 4 2.77614 4 2.5V0.5C4 0.223858 4.22386 0 4.5 0ZM2 4V14H12V4H2ZM1 3H13C13.5523 3 14 3.44772 14 4V14C14 14.5523 13.5523 15 13 15H1C0.447715 15 0 14.5523 0 14V4C0 3.44772 0.447715 3 1 3Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto p-1">cat ~/.kube/config</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
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
            <div className="flex gap-2">
              {!isDeploying ? (
                <Button onClick={() => startDeployment()} className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Start Deployment
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={cancelDeployment} className="w-1/2">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button variant="secondary" disabled className="w-1/2">
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
