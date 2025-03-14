
export type DeploymentStatus = 'success' | 'warning' | 'error' | 'pending' | 'in-progress';

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: DeploymentStatus;
  icon: string;
  progress: number;
}

export interface ServiceStatus {
  name: string;
  status: string;
  pods: string;
  cpu: string;
  memory: string;
}

export interface ClusterStatus {
  nodes: number;
  pods: number;
  services: number;
  deployments: number;
  status: string;
}
