
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Check, CloudOff, Server, Database, AlertTriangle, Clock } from 'lucide-react';
import { useDeployment } from '@/contexts/DeploymentContext';
import DeploymentControls from '@/components/DeploymentControls';
import DeploymentLogs from '@/components/DeploymentLogs';
import DeploymentTimeline from '@/components/DeploymentTimeline';
import DeploymentConfig from '@/components/DeploymentConfig';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const ServiceStatusBadge = ({ status }: { status: string }) => {
  if (status === 'Running') {
    return <Badge className="bg-green-500">Running</Badge>;
  } else if (status === 'Warning') {
    return <Badge variant="secondary" className="bg-yellow-500">Warning</Badge>;
  } else {
    return <Badge variant="destructive">Error</Badge>;
  }
};

const DeploymentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    deploymentSteps, 
    clusterStatus, 
    serviceStatus, 
    isConnected
  } = useDeployment();
  
  // Calculate overall progress
  const completedSteps = deploymentSteps.filter(step => step.status === 'success').length;
  const inProgressSteps = deploymentSteps.filter(step => step.status === 'in-progress');
  let overallProgress = (completedSteps / deploymentSteps.length) * 100;
  
  if (inProgressSteps.length > 0) {
    const currentProgress = inProgressSteps[0].progress / 100;
    overallProgress = ((completedSteps + currentProgress) / deploymentSteps.length) * 100;
  }
  
  return (
    <Container className="py-12">
      <SectionHeading 
        centered
        tag="Deployment"
        subheading="Monitor and manage the deployment of DEVONN.AI Framework"
      >
        Deployment Dashboard
      </SectionHeading>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <DeploymentControls />
      </div>
      
      <Tabs defaultValue="overview" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cluster Status</CardTitle>
                <CardDescription>Kubernetes cluster overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={isConnected ? "bg-green-500" : "bg-red-500"}>
                    {isConnected ? clusterStatus.status : "Disconnected"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                    <span className="text-xs text-muted-foreground">Nodes</span>
                    <span className="text-xl font-semibold">{clusterStatus.nodes}</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                    <span className="text-xs text-muted-foreground">Pods</span>
                    <span className="text-xl font-semibold">{clusterStatus.pods}</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                    <span className="text-xs text-muted-foreground">Services</span>
                    <span className="text-xl font-semibold">{clusterStatus.services}</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                    <span className="text-xs text-muted-foreground">Deployments</span>
                    <span className="text-xl font-semibold">{clusterStatus.deployments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resource Usage</CardTitle>
                <CardDescription>Current resource utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memory</span>
                      <span className="text-sm text-muted-foreground">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Storage</span>
                      <span className="text-sm text-muted-foreground">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Network</span>
                      <span className="text-sm text-muted-foreground">17%</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Deployment Progress</CardTitle>
                <CardDescription>Overall deployment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Total Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.floor(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Step Status:</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs">Completed: {completedSteps}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs">In Progress: {inProgressSteps.length}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                      <span className="text-xs">Pending: {deploymentSteps.length - completedSteps - inProgressSteps.length}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-xs">Failed: {deploymentSteps.filter(step => step.status === 'error').length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <DeploymentTimeline />
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Services Status</CardTitle>
                <CardDescription>Status of all DEVONN.AI services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 gap-4 p-4 bg-secondary/50 font-medium">
                    <div>Service</div>
                    <div>Status</div>
                    <div>Pods</div>
                    <div>CPU</div>
                    <div>Memory</div>
                  </div>
                  <div className="divide-y">
                    {serviceStatus.map((service, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4 p-4 hover:bg-secondary/20">
                        <div className="font-medium">{service.name}</div>
                        <div><ServiceStatusBadge status={service.status} /></div>
                        <div>{service.pods}</div>
                        <div>
                          <HoverCard>
                            <HoverCardTrigger>
                              <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{ width: service.cpu }}
                                ></div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="text-sm">{service.cpu} CPU usage</div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        <div>
                          <HoverCard>
                            <HoverCardTrigger>
                              <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500 rounded-full" 
                                  style={{ width: service.memory.includes('Mi') ? 
                                    (parseInt(service.memory) / 1024 * 100) + '%' : '50%' }}
                                ></div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="text-sm">{service.memory} memory usage</div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="configuration" className="mt-6">
          <DeploymentConfig />
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <DeploymentLogs />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default DeploymentDashboard;
