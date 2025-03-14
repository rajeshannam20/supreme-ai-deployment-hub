import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import CodeDisplay from '@/components/CodeDisplay';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

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
                  href="#"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Learn More
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
