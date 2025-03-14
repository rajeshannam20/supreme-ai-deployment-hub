
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import CodeDisplay from '@/components/CodeDisplay';
import { Check, CloudOff, Server, Database, AlertTriangle, Clock } from 'lucide-react';

// Import the deployment step icons
import cloudProviderIcon from '/lovable-uploads/a65e1231-578b-497e-8b86-06503b0b6eae.png';
import kubernetesIcon from '/lovable-uploads/3ae77958-660d-4e58-9ea4-8fec69755b33.png';
import profileIcon from '/lovable-uploads/5fe3964f-7cb4-4a09-a27b-fc5233b042dc.png';
import deploymentIcon from '/lovable-uploads/e06effdb-49e8-415b-ba43-d67319d4d975.png';
import apiIcon from '/lovable-uploads/89803b30-4c31-445d-b3a9-4ce66f2d4135.png';
import abacusIcon from '/lovable-uploads/b6150d98-c2bc-47a2-8da1-2391d04d8dce.png';

// Define the deployment steps
const deploymentSteps = [
  {
    id: 'prerequisites',
    title: 'Prerequisites',
    description: 'Set up cloud provider and install required tools',
    status: 'completed',
    icon: cloudProviderIcon,
    progress: 100,
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure Setup',
    description: 'Configure Kubernetes cluster and persistent storage',
    status: 'completed',
    icon: kubernetesIcon,
    progress: 100,
  },
  {
    id: 'backend',
    title: 'Backend Services',
    description: 'Deploy backend services and APIs',
    status: 'in-progress',
    icon: deploymentIcon,
    progress: 65,
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description: 'Set up Prometheus and Grafana',
    status: 'pending',
    icon: apiIcon,
    progress: 0,
  },
  {
    id: 'testing',
    title: 'Testing',
    description: 'Run end-to-end and load tests',
    status: 'pending',
    icon: abacusIcon,
    progress: 0,
  },
  {
    id: 'finalize',
    title: 'Finalize',
    description: 'Update DNS and announce launch',
    status: 'pending',
    icon: profileIcon,
    progress: 0,
  },
];

// Sample Kubernetes YAML for display
const kubernetesSample = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: devonn-ai-backend
  labels:
    app: devonn-ai-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devonn-ai-backend
  template:
    metadata:
      labels:
        app: devonn-ai-backend
    spec:
      containers:
      - name: devonn-ai-backend
        image: devonn/backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: devonn-secrets
              key: database-url`;

// Environment variables sample
const envSample = `# Required environment variables
DATABASE_URL=postgresql://user:password@postgres:5432/devonnai
REDIS_URL=redis://redis:6379/0
PROMETHEUS_URL=http://prometheus:9090
GRAFANA_URL=http://grafana:3000

# API keys (keep these secret!)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`;

// Cluster status information
const clusterStatus = {
  nodes: 3,
  pods: 12,
  services: 8,
  deployments: 5,
  status: 'Healthy',
};

// Service status information
const serviceStatus = [
  { name: 'devonn-ai-backend', status: 'Running', pods: '3/3', cpu: '45%', memory: '512Mi' },
  { name: 'devonn-ai-frontend', status: 'Running', pods: '2/2', cpu: '30%', memory: '256Mi' },
  { name: 'devonn-ai-inference', status: 'Running', pods: '2/3', cpu: '85%', memory: '1.2Gi' },
  { name: 'devonn-ai-redis', status: 'Running', pods: '1/1', cpu: '10%', memory: '128Mi' },
  { name: 'devonn-ai-database', status: 'Running', pods: '1/1', cpu: '25%', memory: '512Mi' },
];

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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-6 w-6 text-yellow-500 animate-pulse" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-gray-300" />;
      case 'failed':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-300" />;
    }
  };
  
  return (
    <Container className="py-12">
      <SectionHeading 
        centered
        tag="Deployment"
        subheading="Monitor and manage the deployment of DEVONN.AI Framework"
      >
        Deployment Dashboard
      </SectionHeading>
      
      <Tabs defaultValue="overview" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cluster Status</CardTitle>
                <CardDescription>Kubernetes cluster overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-green-500">{clusterStatus.status}</Badge>
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
                    <span className="text-sm text-muted-foreground">44%</span>
                  </div>
                  <Progress value={44} className="h-2" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Total Steps:</span>
                    <span className="font-medium">{deploymentSteps.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>In Progress:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending:</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Deployment Steps</h3>
          <div className="space-y-4">
            {deploymentSteps.map((step) => (
              <Card key={step.id} className={`border ${step.status === 'in-progress' ? 'border-primary' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-background flex items-center justify-center">
                      <img src={step.icon} alt={step.title} className="h-8 w-8" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{step.title}</h4>
                        {getStatusIcon(step.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <Progress value={step.progress} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Services Status</CardTitle>
              <CardDescription>Current status of deployed services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Service</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Pods</th>
                      <th className="text-left py-3 px-4 font-medium">CPU</th>
                      <th className="text-left py-3 px-4 font-medium">Memory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceStatus.map((service, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{service.name}</td>
                        <td className="py-3 px-4">
                          <ServiceStatusBadge status={service.status} />
                        </td>
                        <td className="py-3 px-4">{service.pods}</td>
                        <td className="py-3 px-4">{service.cpu}</td>
                        <td className="py-3 px-4">{service.memory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Available API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">/api/predict</span>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Inference API for predictions</p>
                  </div>
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">/api/recommendations</span>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Recommendations API</p>
                  </div>
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">/api/analytics</span>
                      <Badge className="bg-yellow-500">Partial</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Analytics API</p>
                  </div>
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">/api/auth</span>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Authentication API</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monitoring URLs</CardTitle>
                <CardDescription>Links to monitoring tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded bg-secondary/50">
                  <div>
                    <h4 className="font-medium">Prometheus</h4>
                    <p className="text-sm text-muted-foreground">Metrics collection</p>
                  </div>
                  <a href="http://prometheus:9090" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Open Dashboard
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-secondary/50">
                  <div>
                    <h4 className="font-medium">Grafana</h4>
                    <p className="text-sm text-muted-foreground">Visualization & Dashboards</p>
                  </div>
                  <a href="http://grafana:3000" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Open Dashboard
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-secondary/50">
                  <div>
                    <h4 className="font-medium">Kibana</h4>
                    <p className="text-sm text-muted-foreground">Log Analysis</p>
                  </div>
                  <a href="http://kibana:5601" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Open Dashboard
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="configuration" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Kubernetes Configuration</h3>
              <CodeDisplay 
                code={kubernetesSample} 
                language="yaml" 
                title="devonn-ai-backend-deployment.yaml" 
                showLineNumbers 
              />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Environment Variables</h3>
              <CodeDisplay 
                code={envSample} 
                language="bash" 
                title=".env" 
                showLineNumbers 
              />
            </div>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Deployment Configuration</CardTitle>
              <CardDescription>Current configuration settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Cloud Provider</h4>
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-primary" />
                      <span>Google Cloud Platform (GKE)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Region</h4>
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <span>us-central1-a</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Database</h4>
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <span>PostgreSQL 14</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Cache</h4>
                  <div className="p-3 rounded bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <span>Redis 6.2</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Logs</CardTitle>
              <CardDescription>Recent deployment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-white p-4 rounded font-mono text-sm h-80 overflow-y-auto">
                <div className="text-gray-400">[2023-07-05 08:15:32] INFO: Starting deployment of DEVONN.AI Framework v1.0.0</div>
                <div className="text-gray-400">[2023-07-05 08:15:35] INFO: Checking prerequisites...</div>
                <div className="text-gray-400">[2023-07-05 08:15:40] INFO: All prerequisites satisfied</div>
                <div className="text-gray-400">[2023-07-05 08:16:02] INFO: Creating Kubernetes cluster in GCP...</div>
                <div className="text-gray-400">[2023-07-05 08:20:15] INFO: Kubernetes cluster created successfully</div>
                <div className="text-gray-400">[2023-07-05 08:20:20] INFO: Configuring persistent storage volumes...</div>
                <div className="text-gray-400">[2023-07-05 08:21:05] INFO: Persistent storage configured</div>
                <div className="text-gray-400">[2023-07-05 08:21:10] INFO: Building Docker images...</div>
                <div className="text-gray-400">[2023-07-05 08:24:30] INFO: Docker images built and pushed to registry</div>
                <div className="text-gray-400">[2023-07-05 08:24:35] INFO: Applying Kubernetes configurations...</div>
                <div className="text-gray-400">[2023-07-05 08:25:40] INFO: Backend services deployed</div>
                <div className="text-gray-400">[2023-07-05 08:26:05] INFO: Frontend deployed</div>
                <div className="text-gray-400">[2023-07-05 08:26:30] INFO: Deploying inference service...</div>
                <div className="text-green-400">[2023-07-05 08:27:15] SUCCESS: Inference service deployed</div>
                <div className="text-gray-400">[2023-07-05 08:27:20] INFO: Deploying recommendation service...</div>
                <div className="text-green-400">[2023-07-05 08:28:05] SUCCESS: Recommendation service deployed</div>
                <div className="text-gray-400">[2023-07-05 08:28:10] INFO: Setting up Prometheus...</div>
                <div className="text-yellow-400">[2023-07-05 08:28:45] WARNING: Prometheus configuration has validation warnings</div>
                <div className="text-gray-400">[2023-07-05 08:29:00] INFO: Continuing with Prometheus setup despite warnings</div>
                <div className="text-gray-400">[2023-07-05 08:29:30] INFO: Setting up Grafana...</div>
                <div className="text-gray-400">[2023-07-05 08:30:15] INFO: Configuring Grafana dashboards...</div>
                <div className="text-red-400">[2023-07-05 08:30:45] ERROR: Failed to load custom Grafana dashboard</div>
                <div className="text-gray-400">[2023-07-05 08:31:00] INFO: Using default Grafana dashboards</div>
                <div className="text-gray-400">[2023-07-05 08:31:10] INFO: Running initial tests...</div>
                <div className="text-gray-400">[2023-07-05 08:32:20] INFO: Basic health checks passed</div>
                <div className="text-gray-400">[2023-07-05 08:32:25] INFO: Deployment in progress...</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default DeploymentDashboard;
