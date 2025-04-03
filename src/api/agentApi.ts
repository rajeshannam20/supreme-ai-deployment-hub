
import axios from "axios";
import { Task, Agent, AgentResponse, AgentsListResponse, AgentRunResponse } from "@/types/agent";

// Set base URL for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Configure axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Error handler helper
const handleApiError = (error: unknown, customMessage: string): never => {
  if (axios.isAxiosError(error)) {
    console.error(`${customMessage}: ${error.message}`, error.response?.data);
  } else {
    console.error(`${customMessage}:`, error);
  }
  throw error;
};

// Agent-related API calls
export const agentApi = {
  // Get list of all agents
  listAgents: async (): Promise<AgentsListResponse> => {
    try {
      const response = await apiClient.get("/agents");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error fetching agents");
    }
  },
  
  // Generate a new agent or use existing one
  generateAgent: async (task: Task): Promise<AgentResponse> => {
    try {
      const response = await apiClient.post("/generate-agent", task);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error generating agent");
    }
  },
  
  // Run an existing agent with a task
  runAgent: async (agentId: string, task: Task): Promise<AgentResponse> => {
    try {
      const response = await apiClient.post(`/run-agent/${agentId}`, task);
      // Convert AgentRunResponse to AgentResponse format by adding required fields
      const data: AgentResponse = {
        ...response.data,
        agent_id: agentId,
        existing: true
      };
      return data;
    } catch (error) {
      return handleApiError(error, "Error running agent ${agentId}");
    }
  },
  
  // Submit a DAG workflow
  submitDAG: async (dag: any): Promise<any> => {
    try {
      const response = await apiClient.post("/dag-builder", dag);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error submitting DAG");
    }
  },
  
  // Upload a task file
  uploadTaskFile: async (file: File, token: string): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await apiClient.post("/upload-task-file", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error uploading task file");
    }
  },
  
  // Get UI button configuration
  getButtonConfig: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/ui/button");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error fetching button config");
    }
  },
};
