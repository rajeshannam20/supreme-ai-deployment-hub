
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Play, XCircle, RefreshCw, Server, Loader2, Power, Info, AlertCircle, Copy, Terminal, Check, FileCode } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DeploymentControls = () => {
  const [kubeConfig, setKubeConfig] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
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

  const copyCommand = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deploymentCommands = [
    {
      id: 'aws-configure',
      title: 'Configure AWS CLI',
      description: 'Set up your AWS credentials for Terraform',
      command: 'aws configure',
    },
    {
      id: 'terraform-init',
      title: 'Initialize Terraform',
      description: 'Set up Terraform in your project directory',
      command: 'terraform init',
    },
    {
      id: 'terraform-plan',
      title: 'Plan Terraform Deployment',
      description: 'Create an execution plan for your infrastructure',
      command: 'terraform plan -out=tfplan -var-file="environments/prod.tfvars"',
    },
    {
      id: 'terraform-apply',
      title: 'Apply Terraform Plan',
      description: 'Deploy your infrastructure to AWS',
      command: 'terraform apply tfplan',
    },
    {
      id: 'kubeconfig',
      title: 'Get Kubeconfig',
      description: 'Configure kubectl to connect to your EKS cluster',
      command: 'aws eks update-kubeconfig --name devonn-eks-prod --region us-west-2',
    }
  ];

  return (
    <Card className="shadow-md border-border">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Deployment Controls</CardTitle>
            <CardDescription>Connect to your Kubernetes cluster and manage deployments</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowGuide(!showGuide)}
                  className="h-8 w-8 p-0"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle deployment guide</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {showGuide && (
          <div className="mb-4 space-y-4">
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Deployment Guide</AlertTitle>
              <AlertDescription>
                Follow these steps to deploy DEVONN.AI to your AWS infrastructure:
              </AlertDescription>
            </Alert>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="prerequisites">
                <AccordionTrigger className="text-sm font-medium">
                  1. Prerequisites
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc ml-4 text-sm space-y-2">
                    <li>AWS Account with appropriate permissions</li>
                    <li>AWS CLI installed and configured</li>
                    <li>Terraform CLI installed (v1.0+)</li>
                    <li>kubectl installed</li>
                    <li>Docker installed (for building images)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="terraform-setup">
                <AccordionTrigger className="text-sm font-medium">
                  2. Terraform Infrastructure Setup
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal ml-4 text-sm space-y-2">
                    <li>Create an <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">environments</code> directory with environment-specific <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">.tfvars</code> files</li>
                    <li>Run Terraform commands in sequence to provision infrastructure</li>
                    <li>Retrieve kubeconfig for cluster access</li>
                  </ol>
                  <div className="mt-3 space-y-2">
                    {deploymentCommands.slice(0, 5).map(cmd => (
                      <div key={cmd.id} className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-medium">{cmd.title}</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => copyCommand(cmd.command, cmd.id)}
                          >
                            <span className="sr-only">Copy</span>
                            {copied === cmd.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{cmd.description}</p>
                        <div className="flex items-center bg-slate-200 dark:bg-slate-900 p-1 rounded">
                          <Terminal className="h-3 w-3 mr-1 text-muted-foreground" />
                          <pre className="text-xs overflow-x-auto flex-1">{cmd.command}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="connect-deploy">
                <AccordionTrigger className="text-sm font-medium">
                  3. Connect and Deploy
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal ml-4 text-sm space-y-2">
                    <li>Copy your kubeconfig content into the connection field below</li>
                    <li>Click "Connect" to establish connection with your cluster</li>
                    <li>Use the "Start Deployment" button to begin deploying DEVONN.AI components</li>
                    <li>Monitor progress in the Deployment Logs and Timeline sections</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="verify">
                <AccordionTrigger className="text-sm font-medium">
                  4. Verify Deployment
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm mb-2">After deployment completes successfully:</p>
                  <ol className="list-decimal ml-4 text-sm space-y-2">
                    <li>Check service status in the monitoring dashboard</li>
                    <li>Access DEVONN.AI through the LoadBalancer endpoint (available in deployment outputs)</li>
                    <li>Set up DNS records to point to your new infrastructure</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setShowGuide(false)}>
                <FileCode className="h-3 w-3" /> View Sample Environment File
              </Button>
            </div>
          </div>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <Tabs defaultValue="kubeconfig">
              <TabsList className="w-full">
                <TabsTrigger value="kubeconfig" className="w-full">Kubeconfig</TabsTrigger>
                <TabsTrigger value="commands" className="w-full">Setup Commands</TabsTrigger>
                <TabsTrigger value="env" className="w-full">Environment</TabsTrigger>
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
                  {deploymentCommands.map(cmd => (
                    <div key={cmd.id} className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs font-medium">{cmd.title}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyCommand(cmd.command, cmd.id)}
                        >
                          <span className="sr-only">Copy</span>
                          {copied === cmd.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <div className="flex items-center bg-slate-200 dark:bg-slate-900 p-1 rounded">
                        <Terminal className="h-3 w-3 mr-1 text-muted-foreground" />
                        <pre className="text-xs overflow-x-auto flex-1">{cmd.command}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="env">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Create environment-specific tfvars files in the <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">environments/</code> directory
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-medium">environments/prod.tfvars</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyCommand(`aws_region = "us-west-2"
environment = "prod"
vpc_cidr = "10.0.0.0/16"
availability_zones = ["us-west-2a", "us-west-2b"]
private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
public_subnet_cidrs = ["10.0.101.0/24", "10.0.102.0/24"]
node_desired_capacity = 2
node_max_capacity = 4
node_min_capacity = 1
node_instance_types = ["t3.medium"]
node_disk_size = 50
db_instance_class = "db.t3.micro"
db_allocated_storage = 20
db_max_allocated_storage = 50`, "tfvars")}
                      >
                        <span className="sr-only">Copy</span>
                        {copied === "tfvars" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto p-2 bg-slate-200 dark:bg-slate-900 rounded">
aws_region = "us-west-2"
environment = "prod"
vpc_cidr = "10.0.0.0/16"
availability_zones = ["us-west-2a", "us-west-2b"]
private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
public_subnet_cidrs = ["10.0.101.0/24", "10.0.102.0/24"]
node_desired_capacity = 2
node_max_capacity = 4
node_min_capacity = 1
node_instance_types = ["t3.medium"]
node_disk_size = 50
db_instance_class = "db.t3.micro"
db_allocated_storage = 20
db_max_allocated_storage = 50
# db_password should be provided via CLI or secure method
                    </pre>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> For security, provide the database password via command line: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">terraform apply -var="db_password=secure_password"</code>
                  </p>
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
            <Separator />
            <div className="flex gap-2">
              {!isDeploying ? (
                <Button onClick={() => startDeployment()} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Start Deployment
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={cancelDeployment} className="w-1/2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950">
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
      {showGuide && (
        <CardFooter className="border-t border-border bg-muted/30 p-3 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Need help? Refer to <a href="/documentation" className="text-blue-600 underline dark:text-blue-400 hover:text-blue-800">full deployment documentation</a>
          </p>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowGuide(false)}>
            Hide Guide
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DeploymentControls;
