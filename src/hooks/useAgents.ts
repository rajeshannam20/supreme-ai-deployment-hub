
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Task, Agent, AgentResponse } from "../types/agent";
import { agentApi } from "../api/agentApi";

export const useAgents = () => {
  // State management
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // Fetch all agents
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await agentApi.listAgents();
      setAgents(response.agents);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate or use an existing agent
  const generateAgent = useCallback(async (task: Task): Promise<void> => {
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
    } catch (error) {
      console.error("Failed to generate agent:", error);
      toast.error("Failed to generate agent");
      throw error;
    } finally {
      setGenerating(false);
    }
  }, [agents, fetchAgents]);

  // Run an existing agent
  const runAgent = useCallback(async (agentId: string, task: Task): Promise<void> => {
    setLoading(true);
    setLastResponse(null);
    try {
      const response = await agentApi.runAgent(agentId, task);
      setLastResponse(response.output);
    } catch (error) {
      console.error(`Failed to run agent ${agentId}:`, error);
      toast.error("Failed to run agent");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    agents,
    loading,
    generating,
    selectedAgent,
    lastResponse,
    
    // Actions
    setSelectedAgent,
    generateAgent,
    runAgent,
    refreshAgents: fetchAgents,
  };
};
