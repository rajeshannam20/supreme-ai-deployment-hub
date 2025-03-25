
// YAML code for the manifest
export const yamlCode = `# Supreme AI Framework Deployment Manifest

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

# --- Step 5: AWS EKS Deployment with Terraform ---

# Terraform configuration for setting up AWS infrastructure

# 1. VPC Configuration
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "devonn-vpc"
  cidr = "10.0.0.0/16"
  azs             = ["us-west-2a", "us-west-2b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_dns_hostnames = true
  tags = {
    Project = "DevonnAI"
  }
}

# 2. EKS Cluster Configuration
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "devonn-eks"
  cluster_version = "1.29"
  subnets         = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  node_groups = {
    dev_nodes = {
      desired_capacity = 2
      max_capacity     = 4
      min_capacity     = 1
      instance_types = ["t3.medium"]
    }
  }

  enable_irsa = true
  tags = {
    Project = "DevonnAI"
  }
}

# 3. RDS PostgreSQL Configuration
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "5.2.2"

  identifier = "devonn-postgres"
  engine     = "postgres"
  engine_version = "14.9"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  max_allocated_storage = 50

  name     = "devonndb"
  username = "admin"
  password = var.db_password
  port     = 5432

  vpc_security_group_ids = [module.vpc.default_security_group_id]
  db_subnet_group_name   = module.vpc.database_subnet_group
  publicly_accessible    = false

  tags = {
    Project = "DevonnAI"
  }
}

# 4. IAM OIDC Provider for EKS
resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da0afd10df6"]
  url             = module.eks.cluster_oidc_issuer_url
}

# 5. Kubernetes Secrets and ConfigMaps
# Apply these after the cluster is provisioned
# apiVersion: v1
# kind: ConfigMap
# metadata:
#   name: flask-config
#   namespace: devonn
#   labels:
#     app: flask-backend
# data:
#   FLASK_ENV: production
#   DATABASE_HOST: external-postgres

# 6. Cert-Manager for SSL
# Install cert-manager using Helm after cluster setup
# helm repo add jetstack https://charts.jetstack.io
# helm repo update
# helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true

# 7. GitHub Actions CI/CD Pipeline
# Store this in .github/workflows/deploy.yml
# name: Deploy Devonn.AI to EKS
# on:
#   push:
#     branches:
#       - main
# jobs:
#   deploy:
#     runs-on: ubuntu-latest
#     steps:
#       - name: Checkout Code
#         uses: actions/checkout@v3
#       - name: Configure AWS Credentials
#         uses: aws-actions/configure-aws-credentials@v2
#         with:
#           aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
#           aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
#           aws-region: us-west-2
`;

// File list for the deployment manifest
export const deploymentFiles = `
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

## Terraform AWS Infrastructure
- /terraform/main.tf
- /terraform/variables.tf
- /terraform/outputs.tf
- /terraform/providers.tf
- /terraform/vpc.tf
- /terraform/eks.tf
- /terraform/rds.tf
- /terraform/iam.tf
`;

