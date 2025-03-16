
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import CodeDisplay from '@/components/CodeDisplay';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BadgeCheck, Bolt, Clock, Code2, Database, FileText, Globe, Server, Shield } from 'lucide-react';

const yamlCode = `# Supreme AI Framework Deployment Manifest

# --- Step 1: Set Up the Staging Environment ---

# 1. Install Kubernetes Tools (Ensure these are installed on your local machine)
# kubectl: For managing Kubernetes resources.
# Helm: For installing services like Prometheus, Grafana, and Kong.
# Istioctl: For managing Istio configurations.
# Argo Rollouts CLI: For managing canary deployments.

# 2. Deploy Core Services

# a. Istio
# Install Istio in the staging cluster:
istioctl install --set profile=demo -y
kubectl label namespace supreme-ai istio-injection=enabled
# Apply the Istio configurations:
kubectl apply -f istio/virtual-service.yaml
kubectl apply -f istio/destination-rule.yaml
# Implement Istio Authorization Policies:
kubectl apply -f istio/authorization-policy.yaml # Add your policy files.

# b. Kong API Gateway
# Install Kong using Helm:
helm repo add kong https://charts.konghq.com
helm repo update
helm install kong/kong --generate-name --set ingressController.enabled=true
# Apply the Kong configurations:
kubectl apply -f kong/ingress.yaml
kubectl apply -f kong/rate-limiting.yaml
# Implement Kong Plugins:
kubectl apply -f kong/authentication-plugin.yaml # Add your plugin files.

# c. Prometheus and Grafana
# Install Prometheus and Grafana using Helm:
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/prometheus
helm install grafana grafana/grafana
# Configure Prometheus Alerting:
kubectl apply -f prometheus/alerting-rules.yaml # Add your alerting rule files.
# Access Grafana:
kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
kubectl port-forward svc/grafana 3000:80

# d. Jaeger
# Install Jaeger Operator:
kubectl create namespace observability
kubectl apply -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.36.0/jaeger-operator.yaml -n observability
# Apply the Jaeger configuration:
kubectl apply -f jaeger/jaeger.yaml
# Configure Jaeger Sampling:
# Modify jaeger/jaeger.yaml for sampling configuration.

# e. Argo Rollouts
# Install Argo Rollouts:
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
# Apply the rollout configuration:
kubectl apply -f argo/rollout.yaml

# f. Elasticsearch, Fluentd, Kibana (EFK) or Loki (Logging)
# Install and configure a logging stack using Helm or Kubernetes manifests.
# Example: Install EFK stack with Helm
helm repo add elastic https://helm.elastic.co
helm repo update
helm install elasticsearch elastic/elasticsearch
helm install kibana elastic/kibana
helm install fluentd-elasticsearch elastic/fluentd-elasticsearch
# Configure Fluentd to collect logs from all namespaces.
# Create Kibana dashboards for log analysis.

# g. Secrets Management
# Use Kubernetes Secrets, HashiCorp Vault, or AWS Secrets Manager to store sensitive data.
# Example: Create a Kubernetes Secret
kubectl create secret generic my-secret --from-literal=api-key=YOUR_API_KEY

# 3. Deploy Backend and Frontend Services
# Build and push Docker images for your backend and frontend services to a container registry.
# Update the Kubernetes deployment manifests with the image URLs.
# Apply the deployment manifests:
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
# Implement Health Checks: add liveness and readiness probes to deployment manifests.
# Define Resource Requests and Limits: add resource requests and limits to deployment manifests.
# Externalize Environment Variables: use ConfigMaps or environment variables from secrets.

# --- Step 2: Test the Framework ---

# 1. Test Service-to-Service Communication
# Verify mTLS and authorization policies using \`istioctl analyze\`.
istioctl analyze
# Test service communication with appropriate payloads.
# Example: curl http://backend.supreme-ai.com/endpoint

# 2. Test API Gateway
# Test rate limiting, authentication, and other Kong plugins.
# Test all endpoints.
# Example: curl -X GET http://backend.supreme-ai.com/endpoint

# 3. Test Monitoring and Observability
# Verify Prometheus scraping and alerting.
# Check Grafana dashboards for system and application metrics.
# Use Jaeger to trace requests.
# Verify proper log collection and analysis in Kibana/Loki.

# 4. Test Data Drift Detection
# Automate the data drift report generation using a cron job or scheduled task.
# Verify reports are generated and stored correctly.
# Create a process to review drift reports and take action.
# Detail the process of how the AI model data is being pulled.
# Example: python backend/app/generate_drift_report.py

# 5. Test Canary Deployments
# Perform a canary deployment and monitor metrics.
# Test rollback functionality.
# Document the entire canary process.
# Example: kubectl argo rollouts promote backend-rollout

# 6. CI/CD Pipeline Testing
# Test the entire CI/CD pipeline from code commit to deployment.
# Include unit, integration, and end-to-end tests.
# Include security scanning tools (Trivy, Clair).
# Test the AI agent itself.

# 7. Security Scanning
# Add security scanning to the CI/CD pipeline.

# --- Step 3: Deploy to Production ---

# 1. Set Up the Production Cluster
# Ensure the production cluster is secured and configured.
# Configure DNS and domain name.

# 2. Apply Configurations
# Apply the tested configurations from the staging environment.
# Use IaC tools (Terraform, Pulumi) for infrastructure management.
# Example: terraform apply

# 3. Monitor the Deployment
# Monitor metrics, logs, and traces.
# Set up alerts for critical issues.

# 4. Enable Disaster Recovery
# Configure Velero for backups.
# Test restore procedures.
# Create a rollback plan.
# Example: velero backup create backup-name

# 5. Cost Optimization
# Monitor cost and optimize resource usage.
# Utilize autoscaling.

# --- Step 4: Documentation ---

# 1. Generate Documentation
# mkdocs build

# 2. Deploy Documentation
# Deploy to a static site hosting platform.

# 3. Document Infrastructure as Code
# Document your IaC configurations.

# 4. Document the testing procedures
# Document all testing procedures, and results.

# 5. Document the AI Agent
# Document how the AI agent works, and how to use it.
`;

// Sample data for charts
const deploymentData = [
  { name: 'Jan', deployments: 4 },
  { name: 'Feb', deployments: 3 },
  { name: 'Mar', deployments: 7 },
  { name: 'Apr', deployments: 5 },
  { name: 'May', deployments: 8 },
  { name: 'Jun', deployments: 12 },
  { name: 'Jul', deployments: 9 },
];

const metricsData = [
  { name: 'Mon', cpu: 45, memory: 60 },
  { name: 'Tue', cpu: 55, memory: 65 },
  { name: 'Wed', cpu: 65, memory: 70 },
  { name: 'Thu', cpu: 70, memory: 75 },
  { name: 'Fri', cpu: 60, memory: 68 },
  { name: 'Sat', cpu: 50, memory: 62 },
  { name: 'Sun', cpu: 48, memory: 60 },
];

const Index = () => {
  useEffect(() => {
    // Show welcome toast
    toast('Welcome to DEVONN.AI', {
      description: 'Explore the deployment manifest for AI systems',
      position: 'bottom-right',
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <Container maxWidth="2xl" animate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block mb-3 px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary">
                Deployment Framework
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight mb-4">
                DEVONN<span className="text-primary">.AI</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-md">
                A minimalist, elegant framework for deploying AI systems with precision and scalability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#manifest"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  View Manifest
                </a>
                <a
                  href="#dashboard-preview"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  See Dashboard
                </a>
              </div>
            </motion.div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10"
              >
                <div className="rounded-xl p-1 bg-gradient-to-br from-gray-200 via-white to-gray-100 shadow-xl overflow-hidden">
                  <div className="bg-black/90 rounded-lg p-3">
                    <div className="flex items-center mb-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="ml-3 text-xs font-mono text-gray-400">DEVONN.AI Framework</div>
                    </div>
                    <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                      <code>
                        $ kubectl apply -f supreme-ai-manifest.yaml<br />
                        service/supreme-ai created<br />
                        deployment.apps/supreme-ai created<br />
                        ingress.networking/supreme-ai created<br />
                        <span className="text-blue-400">✓</span> Framework successfully deployed
                      </code>
                    </pre>
                  </div>
                </div>
              </motion.div>
              
              <div className="absolute -z-10 w-full h-full top-0 left-0 translate-x-5 translate-y-5">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-xl blur-2xl opacity-30"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Dashboard Statistics Preview */}
      <section id="dashboard-preview" className="py-20 bg-gradient-to-b from-background/50 to-secondary/20">
        <Container maxWidth="2xl">
          <SectionHeading 
            centered 
            animate 
            tag="Analytics"
            subheading="Real-time metrics from your AI deployment environment"
          >
            Dashboard Preview
          </SectionHeading>
          
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-1"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Deployment Status</CardTitle>
                  <CardDescription>Current system health and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-primary">68%</span>
                        <div className="w-24 h-2 ml-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "68%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-blue-500">72%</span>
                        <div className="w-24 h-2 ml-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-500">45%</span>
                        <div className="w-24 h-2 ml-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-amber-500">86%</span>
                        <div className="w-24 h-2 ml-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "86%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="dashboard-stat bg-green-50 dark:bg-green-900/20">
                      <span className="dashboard-stat-value text-green-600 dark:text-green-400">18</span>
                      <span className="dashboard-stat-label">Services Online</span>
                    </div>
                    <div className="dashboard-stat bg-red-50 dark:bg-red-900/20">
                      <span className="dashboard-stat-value text-red-600 dark:text-red-400">2</span>
                      <span className="dashboard-stat-label">Alerts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>7-day resource utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metricsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)" opacity={0.2} />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip />
                        <Line type="monotone" dataKey="cpu" stroke="var(--primary)" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Getting Started Steps */}
      <section className="py-20">
        <Container maxWidth="2xl">
          <SectionHeading 
            centered 
            animate 
            tag="Quick Start"
            subheading="Follow these steps to get started with DEVONN.AI Framework"
          >
            Getting Started
          </SectionHeading>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Install Tools",
                description: "Set up the required CLI tools for Kubernetes, Helm, and Istio",
                icon: <Code2 className="w-6 h-6" />
              },
              {
                step: 2,
                title: "Deploy Core Services",
                description: "Install and configure the service mesh, API gateway, and observability stack",
                icon: <Server className="w-6 h-6" />
              },
              {
                step: 3,
                title: "Configure Security",
                description: "Set up mTLS, authentication, and authorization policies",
                icon: <Shield className="w-6 h-6" />
              },
              {
                step: 4,
                title: "Deploy AI Services",
                description: "Deploy your AI models and supporting services",
                icon: <Database className="w-6 h-6" />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="relative"
              >
                <Card className="h-full border-2 border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="absolute -top-5 -left-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                    <a href="#" className="inline-block mt-4 text-primary hover:underline">Learn more →</a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <a 
              href="#"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Complete Installation Guide
            </a>
          </div>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/50">
        <Container maxWidth="2xl">
          <SectionHeading 
            centered 
            animate 
            tag="Architecture"
            subheading="Built with precision and simplicity in mind, our framework offers a comprehensive solution for AI deployment."
          >
            Key Components
          </SectionHeading>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Istio Service Mesh",
                description: "Advanced traffic management with mTLS encryption and robust authorization policies.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: "Kong API Gateway",
                description: "Secure and efficient API management with rate limiting and authentication plugins.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: "Observability Stack",
                description: "Comprehensive monitoring with Prometheus, Grafana, and Jaeger for complete system visibility.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 9L13 15L9 11L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Latest Updates Section */}
      <section className="py-20">
        <Container maxWidth="2xl">
          <SectionHeading 
            animate 
            tag="Updates"
            subheading="Stay informed about the latest improvements and changes to the framework"
          >
            Latest News
          </SectionHeading>
          
          <div className="mt-8 space-y-6">
            {[
              {
                date: "June 15, 2023",
                title: "Version 2.3.0 Released",
                description: "Major improvements to the observability stack and enhanced security features",
                badge: "Release"
              },
              {
                date: "May 28, 2023",
                title: "Kong API Gateway Integration Improved",
                description: "Added support for custom plugins and enhanced rate limiting capabilities",
                badge: "Feature"
              },
              {
                date: "May 12, 2023",
                title: "Security Vulnerability Patched",
                description: "Critical security update for Istio components, all users should update immediately",
                badge: "Security"
              }
            ].map((update, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="flex gap-4 p-6 border rounded-xl hover:bg-secondary/10 transition-colors"
              >
                <div className="hidden sm:flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="w-px h-full bg-gray-200 dark:bg-gray-700 my-2"></div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      update.badge === 'Release' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                      update.badge === 'Feature' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                      {update.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{update.title}</h3>
                  <p className="text-muted-foreground">{update.description}</p>
                  <a href="#" className="inline-block mt-2 text-primary hover:underline">Read more →</a>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              View All Updates
            </a>
          </div>
        </Container>
      </section>
      
      {/* Architecture Diagram Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <Container maxWidth="2xl">
          <SectionHeading 
            centered
            animate 
            tag="Architecture"
            subheading="Visual representation of the DEVONN.AI framework components and their interactions"
          >
            Technical Architecture
          </SectionHeading>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
          >
            <div className="w-full overflow-hidden rounded-lg">
              {/* Architecture Diagram */}
              <div className="w-full h-[400px] bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 flex items-center justify-center">
                <div className="relative w-full max-w-4xl h-full">
                  {/* User Layer */}
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md">
                      Client Applications
                    </div>
                  </div>
                  
                  {/* API Gateway Layer */}
                  <div className="absolute top-[20%] left-0 right-0 flex justify-center">
                    <div className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md w-64 text-center">
                      Kong API Gateway
                    </div>
                  </div>
                  
                  {/* Service Mesh Layer */}
                  <div className="absolute top-[40%] left-0 right-0 flex justify-center">
                    <div className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md w-72 text-center">
                      Istio Service Mesh
                    </div>
                  </div>
                  
                  {/* Microservices Layer */}
                  <div className="absolute top-[60%] left-0 right-0 flex justify-around px-12">
                    <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">
                      AI Model Service
                    </div>
                    <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">
                      Data Processing
                    </div>
                    <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">
                      Authentication
                    </div>
                    <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">
                      Storage Service
                    </div>
                  </div>
                  
                  {/* Infrastructure Layer */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md w-80 text-center">
                      Kubernetes Infrastructure
                    </div>
                  </div>
                  
                  {/* Observability sidebar */}
                  <div className="absolute top-[30%] right-0 flex flex-col gap-2">
                    <div className="px-3 py-2 bg-amber-500 text-white rounded-lg shadow-md text-sm">
                      Prometheus
                    </div>
                    <div className="px-3 py-2 bg-teal-500 text-white rounded-lg shadow-md text-sm">
                      Grafana
                    </div>
                    <div className="px-3 py-2 bg-blue-400 text-white rounded-lg shadow-md text-sm">
                      Jaeger
                    </div>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* User to API Gateway */}
                    <line x1="50%" y1="32" x2="50%" y2="80" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    {/* API Gateway to Service Mesh */}
                    <line x1="50%" y1="112" x2="50%" y2="160" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    {/* Service Mesh to Microservices */}
                    <line x1="50%" y1="192" x2="25%" y2="240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <line x1="50%" y1="192" x2="40%" y2="240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <line x1="50%" y1="192" x2="60%" y2="240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <line x1="50%" y1="192" x2="75%" y2="240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    {/* Microservices to Infrastructure */}
                    <line x1="25%" y1="272" x2="50%" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <line x1="40%" y1="272" x2="50%" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <line x1="60%" y1="272" x2="50%" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <line x1="75%" y1="272" x2="50%" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                View Full Architecture Documentation
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
      
      {/* Case Studies Section */}
      <section className="py-20">
        <Container maxWidth="2xl">
          <SectionHeading 
            animate 
            tag="Success Stories"
            subheading="Real-world applications of the DEVONN.AI Framework in production environments"
          >
            Case Studies
          </SectionHeading>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                company: "NeuroLeap AI",
                title: "Scaling to 10M Predictions Per Day",
                description: "How NeuroLeap deployed their NLP model to handle 10 million daily predictions with 99.99% availability",
                icon: <Database className="w-5 h-5" />
              },
              {
                company: "VisionCraft",
                title: "Secure Multi-tenant Deployment",
                description: "Implementing strict isolation and security for a computer vision platform serving multiple enterprise clients",
                icon: <Shield className="w-5 h-5" />
              },
              {
                company: "PredictSphere",
                title: "Cost Optimization Journey",
                description: "Reducing cloud costs by 68% while improving performance through efficient architecture design",
                icon: <Bolt className="w-5 h-5" />
              }
            ].map((study, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="relative group"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500"></div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                        {study.icon}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{study.company}</span>
                    </div>
                    <CardTitle>{study.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{study.description}</p>
                    <a href="#" className="inline-block mt-4 text-primary font-medium hover:underline">
                      Read case study →
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-secondary/20">
        <Container maxWidth="2xl">
          <SectionHeading 
            centered
            animate 
            tag="FAQ"
            subheading="Common questions about the DEVONN.AI Framework"
          >
            Frequently Asked Questions
          </SectionHeading>
          
          <div className="mt-12 max-w-3xl mx-auto">
            {[
              {
                question: "What are the minimum system requirements?",
                answer: "For local development, we recommend at least 16GB RAM, 4-core CPU, and 50GB storage. For production, a Kubernetes cluster with at least 3 nodes is recommended, each with 8 CPU cores and 32GB RAM."
              },
              {
                question: "Does DEVONN.AI work with any cloud provider?",
                answer: "Yes, DEVONN.AI is cloud-agnostic and works with all major cloud providers including AWS, GCP, Azure, and others. It can also be deployed on on-premises Kubernetes clusters."
              },
              {
                question: "How does the framework handle model versioning?",
                answer: "DEVONN.AI includes built-in support for model versioning through its integration with MLflow. It tracks model versions, parameters, and metrics, and provides tools for model promotion through environments."
              },
              {
                question: "Is there support for A/B testing AI models?",
                answer: "Yes, the framework supports A/B testing through the Argo Rollouts component, which allows for canary deployments and traffic splitting between different model versions."
              },
              {
                question: "How is security handled in DEVONN.AI?",
                answer: "Security is implemented at multiple layers including network policies, Istio authorization policies, mTLS encryption, API authentication through Kong, and RBAC for Kubernetes resources."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="mb-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-primary" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Integration Partners */}
      <section className="py-20">
        <Container maxWidth="2xl">
          <SectionHeading 
            centered
            animate 
            tag="Ecosystem"
            subheading="DEVONN.AI integrates seamlessly with leading tools and platforms"
          >
            Integration Partners
          </SectionHeading>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex items-center justify-center p-4"
              >
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary/70" />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <Container maxWidth="2xl">
          <SectionHeading 
            centered
            animate 
            tag="Testimonials"
            subheading="What our users say about DEVONN.AI Framework"
          >
            User Feedback
          </SectionHeading>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "DEVONN.AI transformed how we deploy machine learning models. We reduced our deployment time from days to minutes.",
                name: "Sarah Johnson",
                role: "CTO, DataStream AI"
              },
              {
                quote: "The observability stack integration saved us countless hours of troubleshooting and helped us identify performance bottlenecks immediately.",
                name: "Michael Chen",
                role: "Lead DevOps Engineer, TechFusion"
              },
              {
                quote: "The security features of DEVONN.AI gave us the confidence to deploy sensitive financial models in production environments.",
                name: "Elena Rodriguez",
                role: "Head of AI, FinTech Solutions"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <Card className="h-full border-2 border-primary/5 hover:border-primary/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className="mb-4 text-4xl text-primary/20">"</div>
                    <p className="italic text-muted-foreground mb-6">{testimonial.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="font-semibold text-secondary-foreground">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Manifest Section */}
      <section id="manifest" className="py-20">
        <Container maxWidth="2xl">
          <SectionHeading 
            animate 
            tag="Documentation"
            subheading="Complete Kubernetes deployment manifest for the DEVONN.AI Framework."
          >
            Deployment Manifest
          </SectionHeading>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <CodeDisplay 
              code={yamlCode}
              language="yaml"
              title="supreme-ai-manifest.yaml"
              showLineNumbers={true}
              className="shadow-xl"
            />
          </motion.div>
          
          <div className="mt-8 flex justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Download Manifest
            </a>
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <Container maxWidth="2xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary/80 to-blue-600/80 p-8 md:p-12 shadow-lg">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white mb-4">
                Ready to Deploy Your AI Framework?
              </h2>
              <p className="text-white/80 mb-8">
                Start with our comprehensive deployment framework and take your AI applications to production with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-white text-primary hover:bg-white/90"
                >
                  Get Started
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary/20 text-white hover:bg-primary/30 border border-white/20"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
