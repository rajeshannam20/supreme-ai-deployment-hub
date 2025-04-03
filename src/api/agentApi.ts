
import axios from "axios";
import { 
  Task, 
  Agent, 
  AgentResponse, 
  AgentsListResponse, 
  AgentRunResponse,
  AgentType,
  AgentMemory,
  AgentMemorySearchParams,
  Tool,
  Skill,
  DAGWorkflow,
  DAGResponse
} from "@/types/agent";

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
  
  // Get agents by type
  listAgentsByType: async (type: AgentType): Promise<AgentsListResponse> => {
    try {
      const response = await apiClient.get(`/agents/type/${type}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Error fetching ${type} agents`);
    }
  },
  
  // Get agent details
  getAgentDetails: async (agentId: string): Promise<Agent> => {
    try {
      const response = await apiClient.get(`/agents/${agentId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Error fetching agent ${agentId}`);
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
      return handleApiError(error, `Error running agent ${agentId}`);
    }
  },
  
  // Submit a DAG workflow
  submitDAG: async (dag: DAGWorkflow): Promise<DAGResponse> => {
    try {
      const response = await apiClient.post("/dag-builder", dag);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error submitting DAG");
    }
  },
  
  // Get workflow status
  getWorkflowStatus: async (workflowId: string): Promise<DAGResponse> => {
    try {
      const response = await apiClient.get(`/workflow/${workflowId}/status`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Error fetching workflow status for ${workflowId}`);
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
  
  // Get available agent tools
  getAgentTools: async (): Promise<{ tools: Tool[] }> => {
    try {
      const response = await apiClient.get("/tools");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error fetching tools");
    }
  },
  
  // Get agent-specific tools
  getAgentSpecificTools: async (agentId: string): Promise<{ tools: Tool[] }> => {
    try {
      const response = await apiClient.get(`/agents/${agentId}/tools`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Error fetching tools for agent ${agentId}`);
    }
  },
  
  // Save agent memory
  saveAgentMemory: async (agentId: string, memory: Omit<AgentMemory, 'id'>): Promise<{ memory_id: string }> => {
    try {
      const response = await apiClient.post(`/agents/${agentId}/memory`, memory);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Error saving memory for agent ${agentId}`);
    }
  },
  
  // Retrieve agent memories
  getAgentMemories: async (agentId: string, params?: AgentMemorySearchParams): Promise<{ memories: AgentMemory[] }> => {
    try {
      const response = await apiClient.get(`/agents/${agentId}/memory`, { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, `Error fetching memories for agent ${agentId}`);
    }
  },
  
  // Search agent memory
  searchAgentMemory: async (params: AgentMemorySearchParams): Promise<{ memories: AgentMemory[] }> => {
    try {
      const response = await apiClient.get('/memory/search', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error searching agent memory");
    }
  },
  
  // Extract skills from text
  extractSkills: async (text: string): Promise<{ skills: Skill[] }> => {
    try {
      const response = await apiClient.post('/skills/extract', { text });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error extracting skills");
    }
  },
  
  // Create an agent with specific type and capabilities
  createTypedAgent: async (agent: Omit<Agent, 'id'>): Promise<Agent> => {
    try {
      const response = await apiClient.post('/agents/create', agent);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Error creating typed agent");
    }
  }
};
