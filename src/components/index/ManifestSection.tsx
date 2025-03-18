
import React from 'react';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import CodeDisplay from '@/components/CodeDisplay';
import { Button } from '@/components/ui/button';

// YAML code for the manifest
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

// File list for the deployment manifest
const deploymentFiles = `
# DEVONN.AI Framework - Deployment File Manifest

## Frontend Assets
- /dist/index.html
- /dist/assets/**/*

## Kubernetes Configuration Files
- /k8s/backend-deployment.yaml
- /k8s/frontend-deployment.yaml
- /k8s/database-statefulset.yaml
- /k8s/redis-statefulset.yaml
- /k8s/ingress.yaml
- /k8s/services.yaml
- /k8s/configmaps.yaml
- /k8s/secrets.yaml

## Istio Service Mesh
- /istio/virtual-service.yaml
- /istio/destination-rule.yaml
- /istio/authorization-policy.yaml
- /istio/gateway.yaml

## Kong API Gateway
- /kong/ingress.yaml
- /kong/rate-limiting.yaml
- /kong/authentication-plugin.yaml
- /kong/cors-plugin.yaml

## Monitoring & Observability
- /prometheus/prometheus.yaml
- /prometheus/alerting-rules.yaml
- /grafana/dashboards/devonn-ai-dashboard.json
- /grafana/datasources/prometheus-datasource.yaml
- /jaeger/jaeger.yaml
- /loki/loki.yaml
- /loki/promtail.yaml

## Argo Rollouts (Canary Deployments)
- /argo/rollout.yaml
- /argo/analysis-template.yaml

## Elasticsearch, Fluentd, Kibana (Logging)
- /efk/elasticsearch.yaml
- /efk/fluentd-configmap.yaml
- /efk/fluentd-daemonset.yaml
- /efk/kibana.yaml

## CI/CD Pipeline
- /.github/workflows/build-and-deploy.yaml
- /.gitlab-ci.yml
- /Jenkinsfile

## Documentation
- /docs/**/*
- /README.md
- /DEPLOYMENT.md
- /TROUBLESHOOTING.md

## Docker Files
- /Dockerfile.backend
- /Dockerfile.frontend
- /docker-compose.yaml
- /.dockerignore

## Miscellaneous
- /.gitignore
- /package.json
- /tsconfig.json
- /vite.config.ts
`;

const ManifestSection: React.FC = () => {
  // Function to download the manifest as a YAML file
  const downloadManifest = () => {
    const blob = new Blob([yamlCode], { type: 'text/yaml;charset=utf-8' });
    saveAs(blob, 'devonn-ai-manifest.yaml');
    toast.success('Manifest downloaded successfully');
  };
  
  // Function to download the file list
  const downloadFileList = () => {
    const blob = new Blob([deploymentFiles], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'devonn-ai-deployment-files.txt');
    toast.success('Deployment file list downloaded successfully');
  };
  
  // Function to copy the manifest to clipboard
  const copyManifest = () => {
    navigator.clipboard.writeText(yamlCode)
      .then(() => toast.success('Manifest copied to clipboard'))
      .catch(err => toast.error('Failed to copy: ' + err));
  };

  return (
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
        
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={downloadManifest}
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Manifest
          </Button>
          
          <Button
            onClick={copyManifest}
            variant="outline"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-xl font-semibold mb-4 text-center">Deployment File Manifest</h3>
          <div className="bg-slate-950 text-slate-200 p-6 rounded-lg shadow-xl overflow-auto max-h-96">
            <pre className="text-sm whitespace-pre-wrap">{deploymentFiles}</pre>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={downloadFileList}
              variant="secondary"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="mr-2 h-4 w-4" />
              Download File List
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ManifestSection;
