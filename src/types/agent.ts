
export interface Task {
  user_id: string;
  task_description: string;
  context?: string;
}

export interface Agent {
  id: string;
  name: string;
  desc: string;
}

export interface AgentResponse {
  agent_id: string;
  existing: boolean;
  output: string;
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
