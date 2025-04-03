
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  Task, 
  Agent, 
  AgentResponse, 
  AgentType, 
  AgentMemory, 
  Tool, 
  Skill 
} from "../types/agent";
import { agentApi } from "../api/agentApi";

export const useAgents = () => {
  // State management
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsByType, setAgentsByType] = useState<Record<AgentType, Agent[]>>({} as Record<AgentType, Agent[]>);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [agentMemories, setAgentMemories] = useState<AgentMemory[]>([]);
  const [memoryLoading, setMemoryLoading] = useState<boolean>(false);
  const [extractedSkills, setExtractedSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState<boolean>(false);

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
    fetchTools();
  }, []);

  // Fetch all agents
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await agentApi.listAgents();
      setAgents(response.agents);
      
      // Organize agents by type
      const byType: Record<AgentType, Agent[]> = {} as Record<AgentType, Agent[]>;
      response.agents.forEach(agent => {
        const type = agent.type || 'custom';
        if (!byType[type]) {
          byType[type] = [];
        }
        byType[type].push(agent);
      });
      setAgentsByType(byType);
      
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch agents by type
  const fetchAgentsByType = useCallback(async (type: AgentType) => {
    setLoading(true);
    try {
      const response = await agentApi.listAgentsByType(type);
      return response.agents;
    } catch (error) {
      console.error(`Failed to fetch ${type} agents:`, error);
      toast.error(`Failed to fetch ${type} agents`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch all available tools
  const fetchTools = useCallback(async () => {
    try {
      const response = await agentApi.getAgentTools();
      setAvailableTools(response.tools);
    } catch (error) {
      console.error("Failed to fetch tools:", error);
    }
  }, []);
  
  // Fetch agent-specific tools
  const fetchAgentTools = useCallback(async (agentId: string) => {
    try {
      const response = await agentApi.getAgentSpecificTools(agentId);
      return response.tools;
    } catch (error) {
      console.error(`Failed to fetch tools for agent ${agentId}:`, error);
      return [];
    }
  }, []);

  // Generate or use an existing agent
  const generateAgent = useCallback(async (task: Task): Promise<AgentResponse> => {
    setGenerating(true);
    setLastResponse(null);
    try {
      const response = await agentApi.generateAgent(task);
      setLastResponse(response.output);
      
      // If agent was newly created, refresh the agents list
      if (!response.existing) {
        await fetchAgents();
        
        // Find and select the newly created agent
        const newAgent = agents.find(agent => agent.id === response.agent_id);
        if (newAgent) {
          setSelectedAgent(newAgent);
        }
      }
      
      // If memory was created, update memory state
      if (response.memory_id && selectedAgent) {
        fetchAgentMemories(selectedAgent.id);
      }
      
      return response;
    } catch (error) {
      console.error("Failed to generate agent:", error);
      toast.error("Failed to generate agent");
      throw error;
    } finally {
      setGenerating(false);
    }
  }, [agents, fetchAgents, selectedAgent]);

  // Run an existing agent
  const runAgent = useCallback(async (agentId: string, task: Task): Promise<AgentResponse> => {
    setLoading(true);
    setLastResponse(null);
    try {
      const response = await agentApi.runAgent(agentId, task);
      setLastResponse(response.output);
      
      // If memory was created, update memory state
      if (response.memory_id) {
        await fetchAgentMemories(agentId);
      }
      
      return response;
    } catch (error) {
      console.error(`Failed to run agent ${agentId}:`, error);
      toast.error("Failed to run agent");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch agent memories
  const fetchAgentMemories = useCallback(async (agentId: string) => {
    setMemoryLoading(true);
    try {
      const response = await agentApi.getAgentMemories(agentId);
      setAgentMemories(response.memories);
      return response.memories;
    } catch (error) {
      console.error(`Failed to fetch memories for agent ${agentId}:`, error);
      return [];
    } finally {
      setMemoryLoading(false);
    }
  }, []);
  
  // Search agent memories
  const searchAgentMemory = useCallback(async (query: string, agentId?: string) => {
    setMemoryLoading(true);
    try {
      const response = await agentApi.searchAgentMemory({ query, agent_id: agentId });
      return response.memories;
    } catch (error) {
      console.error("Failed to search agent memory:", error);
      return [];
    } finally {
      setMemoryLoading(false);
    }
  }, []);
  
  // Extract skills from text
  const extractSkills = useCallback(async (text: string) => {
    setSkillsLoading(true);
    try {
      const response = await agentApi.extractSkills(text);
      setExtractedSkills(response.skills);
      return response.skills;
    } catch (error) {
      console.error("Failed to extract skills:", error);
      toast.error("Failed to extract skills");
      return [];
    } finally {
      setSkillsLoading(false);
    }
  }, []);
  
  // Create a typed agent
  const createTypedAgent = useCallback(async (agent: Omit<Agent, 'id'>) => {
    setLoading(true);
    try {
      const createdAgent = await agentApi.createTypedAgent(agent);
      
      // Refresh agent list
      await fetchAgents();
      
      toast.success(`Agent "${createdAgent.name}" created successfully`);
      return createdAgent;
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast.error("Failed to create agent");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchAgents]);

  return {
    // State
    agents,
    agentsByType,
    loading,
    generating,
    selectedAgent,
    lastResponse,
    availableTools,
    agentMemories,
    memoryLoading,
    extractedSkills,
    skillsLoading,
    
    // Actions
    setSelectedAgent,
    generateAgent,
    runAgent,
    refreshAgents: fetchAgents,
    fetchAgentsByType,
    fetchTools,
    fetchAgentTools,
    fetchAgentMemories,
    searchAgentMemory,
    extractSkills,
    createTypedAgent
  };
};
