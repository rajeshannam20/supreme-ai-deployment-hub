
import { Task, Agent, AgentResponse, AgentsListResponse, AgentRunResponse, ButtonConfigResponse } from "../types/agent";

const API_BASE_URL = "http://localhost:8000"; // Change this to your FastAPI server URL

export const AgentService = {
  generateAgent: async (task: Task): Promise<AgentResponse> => {
    const response = await fetch(`${API_BASE_URL}/generate-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`Error generating agent: ${response.statusText}`);
    }

    return await response.json();
  },

  listAgents: async (): Promise<AgentsListResponse> => {
    const response = await fetch(`${API_BASE_URL}/agents`);

    if (!response.ok) {
      throw new Error(`Error listing agents: ${response.statusText}`);
    }

    return await response.json();
  },

  runAgent: async (agentId: string, task: Task): Promise<AgentRunResponse> => {
    const response = await fetch(`${API_BASE_URL}/run-agent/${agentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`Error running agent: ${response.statusText}`);
    }

    return await response.json();
  },

  getButtonConfig: async (): Promise<ButtonConfigResponse> => {
    const response = await fetch(`${API_BASE_URL}/ui/button`);

    if (!response.ok) {
      throw new Error(`Error getting button config: ${response.statusText}`);
    }

    return await response.json();
  },
};
