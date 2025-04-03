
export interface Task {
  user_id: string;
  task_description: string;
  context?: string;
}

export interface Agent {
  id: string;
  name: string;
  desc: string;
  skills?: string[];
}

export interface AgentResponse {
  agent_id: string;
  existing: boolean;
  output: string;
  skills?: string[];
}

export interface AgentsListResponse {
  agents: Agent[];
}

export interface AgentRunResponse {
  output: string;
}

export interface ButtonConfigResponse {
  message: string;
  action: string;
  method: string;
  params: string[];
}

export interface DAGStep {
  agent: string;
  input?: string;
  depends_on?: string;
}

export interface DAGWorkflow {
  workflow_name: string;
  steps: DAGStep[];
}

export interface DAGResponse {
  workflow_id: string;
  status: string;
  results?: Record<string, string>;
  error?: string;
}
