
import axios from 'axios';
import { 
  Task, 
  Agent, 
  AgentResponse, 
  AgentsListResponse, 
  AgentRunResponse, 
  DAGWorkflow, 
  DAGResponse, 
  AgentType,
  AgentMemory,
  AgentMemorySearchParams,
  Tool,
  Skill,
  AgentToolsResponse
} from '@/types/agent';

// Set base URL for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AgentService = {
  // Get list of all agents
  listAgents: async (): Promise<AgentsListResponse> => {
    try {
      const response = await api.get('/agents');
      return response.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  },
  
  // Get agents by type
  listAgentsByType: async (type: AgentType): Promise<AgentsListResponse> => {
    try {
      const response = await api.get(`/agents/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} agents:`, error);
      throw error;
    }
  },
  
  // Get agent details
  getAgentDetails: async (agentId: string): Promise<Agent> => {
    try {
      const response = await api.get(`/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching agent ${agentId}:`, error);
      throw error;
    }
  },
  
  // Generate a new agent or use existing one
  generateAgent: async (task: Task): Promise<AgentResponse> => {
    try {
      const response = await api.post('/generate-agent', task);
      return response.data;
    } catch (error) {
      console.error('Error generating agent:', error);
      throw error;
    }
  },
  
  // Run an existing agent with a task
  runAgent: async (agentId: string, task: Task): Promise<AgentRunResponse> => {
    try {
      const response = await api.post(`/run-agent/${agentId}`, task);
      return response.data;
    } catch (error) {
      console.error(`Error running agent ${agentId}:`, error);
      throw error;
    }
  },
  
  // Get UI button configuration
  getButtonConfig: async () => {
    try {
      const response = await api.get('/ui/button');
      return response.data;
    } catch (error) {
      console.error('Error fetching button config:', error);
      throw error;
    }
  },
  
  // Submit a DAG workflow
  submitDAG: async (dag: DAGWorkflow): Promise<DAGResponse> => {
    try {
      const response = await api.post('/dag-builder', dag);
      return response.data;
    } catch (error) {
      console.error('Error submitting DAG:', error);
      throw error;
    }
  },
  
  // Get workflow status
  getWorkflowStatus: async (workflowId: string): Promise<DAGResponse> => {
    try {
      const response = await api.get(`/workflow/${workflowId}/status`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow status for ${workflowId}:`, error);
      throw error;
    }
  },
  
  // Upload a task file
  uploadTaskFile: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/upload-task-file', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading task file:', error);
      throw error;
    }
  },
  
  // Get available agent tools
  getAgentTools: async (): Promise<AgentToolsResponse> => {
    try {
      const response = await api.get('/tools');
      return response.data;
    } catch (error) {
      console.error('Error fetching tools:', error);
      throw error;
    }
  },
  
  // Get agent-specific tools
  getAgentSpecificTools: async (agentId: string): Promise<AgentToolsResponse> => {
    try {
      const response = await api.get(`/agents/${agentId}/tools`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tools for agent ${agentId}:`, error);
      throw error;
    }
  },
  
  // Save agent memory
  saveAgentMemory: async (agentId: string, memory: Omit<AgentMemory, 'id'>): Promise<{ memory_id: string }> => {
    try {
      const response = await api.post(`/agents/${agentId}/memory`, memory);
      return response.data;
    } catch (error) {
      console.error(`Error saving memory for agent ${agentId}:`, error);
      throw error;
    }
  },
  
  // Retrieve agent memories
  getAgentMemories: async (agentId: string, params?: AgentMemorySearchParams): Promise<AgentMemory[]> => {
    try {
      const response = await api.get(`/agents/${agentId}/memory`, { params });
      return response.data.memories;
    } catch (error) {
      console.error(`Error fetching memories for agent ${agentId}:`, error);
      throw error;
    }
  },
  
  // Search agent memory
  searchAgentMemory: async (params: AgentMemorySearchParams): Promise<AgentMemory[]> => {
    try {
      const response = await api.get('/memory/search', { params });
      return response.data.memories;
    } catch (error) {
      console.error('Error searching agent memory:', error);
      throw error;
    }
  },
  
  // Extract skills from text
  extractSkills: async (text: string): Promise<Skill[]> => {
    try {
      const response = await api.post('/skills/extract', { text });
      return response.data.skills;
    } catch (error) {
      console.error('Error extracting skills:', error);
      throw error;
    }
  },
  
  // Create an agent with specific type and capabilities
  createTypedAgent: async (agent: Omit<Agent, 'id'>): Promise<Agent> => {
    try {
      const response = await api.post('/agents/create', agent);
      return response.data;
    } catch (error) {
      console.error('Error creating typed agent:', error);
      throw error;
    }
  }
};
