
// YAML code for the Terraform AWS EKS deployment section
export const terraformManifestYaml = `# --- Step 5: AWS EKS Deployment with Terraform ---

# Terraform configuration for setting up AWS infrastructure
# To use this file:
# 1. Install Terraform CLI (https://learn.hashicorp.com/tutorials/terraform/install-cli)
# 2. Configure AWS credentials using AWS CLI:
#    $ aws configure
# 3. Run the following commands in the directory containing these Terraform files:
#    $ terraform init
#    $ terraform plan -out=tfplan -var-file="environments/\${ENV:-prod}.tfvars"
#    $ terraform apply tfplan

# --------------------------------------------
# IMPORTANT DEPLOYMENT CONSIDERATIONS
# --------------------------------------------
#
# REGIONS AND MULTI-REGION STRATEGY:
# - Primary deployment region: us-west-2 (Oregon)
# - For production, consider additional regions for high availability:
#   - us-east-1 (N. Virginia) - for US East coverage
#   - eu-west-1 (Ireland) - for European coverage
#   - ap-southeast-1 (Singapore) - for APAC coverage
# - Use Route53 for global DNS routing and failover between regions
# - Enable cross-region replication for S3 buckets containing static assets
#
# DATABASE BACKUP STRATEGY:
# - RDS automated backups: Enabled with 7-day retention (configurable)
# - Additional recommendations:
#   - Set up AWS Backup to create cross-region backups
#   - Configure point-in-time recovery (PITR)
#   - For critical data, consider read replicas in secondary regions
#   - Export regular snapshots to S3 with lifecycle policies for long-term retention
#
# MONITORING AND ALERTING:
# - Leverage CloudWatch for basic metrics and alerting
# - Consider enhanced monitoring with:
#   - CloudWatch Container Insights for Kubernetes metrics
#   - AWS X-Ray for distributed tracing
#   - Third-party options: Datadog, New Relic, or Prometheus/Grafana stack
# - Set up alerts for:
#   - CPU/Memory thresholds (>80%)
#   - Error rate increases
#   - Latency spikes
#   - Database connection issues
#
# CERTIFICATE MANAGEMENT:
# - For production environments:
#   - Provision certificates through AWS Certificate Manager (ACM)
#   - Set up automatic renewal
#   - For multi-region, create certificates in each region
#   - Use cert-manager in Kubernetes for service mesh certificates
#
# COST OPTIMIZATION:
# - Review and adjust instance sizes based on actual usage patterns
# - Implement auto-scaling for variable workloads
# - Consider Spot Instances for non-critical workloads
# - Enable AWS Cost Explorer and set up budget alerts
# - Regular review of unused/underutilized resources
#
# --------------------------------------------

# Recommended: Use S3 backend for team collaboration
# terraform {
#   backend "s3" {
#     bucket = "devonn-terraform-state"
#     key    = "terraform.tfstate"
#     region = "us-west-2"
#     dynamodb_table = "terraform-locks"
#     encrypt = true
#   }
# }

# Define the AWS provider and region
provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "DevonnAI"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "DevOps"
    }
  }
}

# 1. VPC Configuration
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "devonn-vpc-\${var.environment}"
  cidr = var.vpc_cidr
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"  # Use multiple NAT gateways in production
  enable_dns_hostnames = true
  
  # EKS requires specific tags on subnets for load balancer discovery
  private_subnet_tags = {
    "kubernetes.io/cluster/devonn-eks-\${var.environment}" = "shared"
    "kubernetes.io/role/internal-elb" = "1"
  }
  
  public_subnet_tags = {
    "kubernetes.io/cluster/devonn-eks-\${var.environment}" = "shared"
    "kubernetes.io/role/elb" = "1"
  }
}

# 2. EKS Cluster Configuration
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "devonn-eks-\${var.environment}"
  cluster_version = "1.29"
  subnets         = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  node_groups = {
    dev_nodes = {
      desired_capacity = var.node_desired_capacity
      max_capacity     = var.node_max_capacity
      min_capacity     = var.node_min_capacity
      instance_types   = var.node_instance_types
      disk_size        = var.node_disk_size
    }
  }

  # Enable IAM Roles for Service Accounts (IRSA)
  enable_irsa = true
  
  # CloudWatch Logs for the EKS control plane
  cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
  
  # Security groups
  cluster_security_group_additional_rules = {
    egress_all = {
      description      = "Cluster all egress"
      protocol         = "-1"
      from_port        = 0
      to_port          = 0
      type             = "egress"
      cidr_blocks      = ["0.0.0.0/0"]
    }
  }
  
  # Encryption for EKS secrets
  cluster_encryption_config = [
    {
      provider_key_arn = aws_kms_key.eks.arn
      resources        = ["secrets"]
    }
  ]
}

# KMS key for EKS secrets encryption
resource "aws_kms_key" "eks" {
  description             = "EKS Secret Encryption Key"
  deletion_window_in_days = 7
  enable_key_rotation     = true
}

# 3. RDS PostgreSQL Configuration
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "5.2.2"

  identifier = "devonn-postgres-\${var.environment}"
  engine     = "postgres"
  engine_version = "14.9"
  instance_class = var.db_instance_class

  allocated_storage = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_encrypted = true

  name     = "devonndb"
  username = "admin"
  password = var.db_password
  port     = 5432

  vpc_security_group_ids = [module.vpc.default_security_group_id]
  db_subnet_group_name   = module.vpc.database_subnet_group
  publicly_accessible    = false
  
  # Backup configuration
  backup_retention_period = 7
  backup_window           = "03:00-06:00"
  maintenance_window      = "Mon:00:00-Mon:03:00"

  # Enhanced monitoring
  monitoring_interval = 60
  monitoring_role_name = "devonn-rds-monitoring-role-\${var.environment}"
  
  # Deletion protection in production
  deletion_protection = var.environment == "production"
}

# 4. IAM OIDC Provider for EKS
resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da0afd10df6"]
  url             = module.eks.cluster_oidc_issuer_url
}

# 5. Connect to your EKS cluster after provisioning
# Run: aws eks update-kubeconfig --name devonn-eks-\${var.environment} --region \${var.aws_region}
# This will update your kubeconfig file with the new cluster information

# 6. Kubernetes Secrets and ConfigMaps
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

# 7. Cert-Manager for SSL
# Install cert-manager using Helm after cluster setup
# helm repo add jetstack https://charts.jetstack.io
# helm repo update
# helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true

# 8. GitHub Actions CI/CD Pipeline
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
#           aws-region: \${{ secrets.AWS_REGION }}
#       - name: Build and Push Docker Images
#         run: |
#           aws ecr get-login-password --region \${{ secrets.AWS_REGION }} | docker login --username AWS --password-stdin \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com
#           docker build -t \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/devonn-backend:latest -f Dockerfile.backend .
#           docker build -t \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/devonn-frontend:latest -f Dockerfile.frontend .
#           docker push \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/devonn-backend:latest
#           docker push \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/devonn-frontend:latest
#       - name: Deploy to EKS
#         run: |
#           aws eks update-kubeconfig --name devonn-eks-\${{ secrets.ENVIRONMENT }} --region \${{ secrets.AWS_REGION }}
#           kubectl apply -f k8s/

# 9. Variables and Outputs
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b"]
}

variable "private_subnet_cidrs" {
  description = "List of private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "node_desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "node_max_capacity" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 4
}

variable "node_min_capacity" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "node_instance_types" {
  description = "EC2 instance types for worker nodes"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_disk_size" {
  description = "Disk size for worker nodes in GB"
  type        = number
  default     = 50
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS instance in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS instance in GB"
  type        = number
  default     = 50
}

variable "db_password" {
  description = "Password for the RDS database"
  type        = string
  sensitive   = true
}

output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = module.eks.cluster_security_group_id
}

output "eks_kubectl_config" {
  description = "kubectl config as generated by the module"
  value       = module.eks.kubeconfig
  sensitive   = true
}

output "rds_instance_address" {
  description = "The address of the RDS instance"
  value       = module.rds.db_instance_address
  sensitive   = true
}

output "connection_instructions" {
  description = "Instructions to connect to the cluster"
  value       = "Run: aws eks update-kubeconfig --name devonn-eks-\${var.environment} --region \${var.aws_region}"
}

# Example tfvars file structure (create these in environments/prod.tfvars, environments/staging.tfvars, etc)
# aws_region = "us-west-2"
# environment = "prod"
# vpc_cidr = "10.0.0.0/16"
# availability_zones = ["us-west-2a", "us-west-2b"]
# private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
# public_subnet_cidrs = ["10.0.101.0/24", "10.0.102.0/24"]
# node_desired_capacity = 2
# node_max_capacity = 4
# node_min_capacity = 1
# node_instance_types = ["t3.medium"]
# node_disk_size = 50
# db_instance_class = "db.t3.micro"
# db_allocated_storage = 20
# db_max_allocated_storage = 50
# db_password = "CHANGE_ME_IN_PROD"`;

