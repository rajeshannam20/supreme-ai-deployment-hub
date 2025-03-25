
// YAML code for the Terraform AWS EKS deployment section
export const terraformManifestYaml = `# --- Step 5: AWS EKS Deployment with Terraform ---

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
#           aws-region: us-west-2`;
