
import axios from 'axios';
import { Task, Agent, AgentResponse, AgentsListResponse, AgentRunResponse } from '@/types/agent';

// Set base URL for API endpoints
const API_BASE_URL = 'http://localhost:8000'; // Update this with your actual API URL

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
  submitDAG: async (dag: any) => {
    try {
      const response = await api.post('/dag-builder', dag);
      return response.data;
    } catch (error) {
      console.error('Error submitting DAG:', error);
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
  }
};
