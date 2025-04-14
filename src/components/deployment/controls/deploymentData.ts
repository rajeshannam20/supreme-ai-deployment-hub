
export const deploymentCommandsData = [
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
