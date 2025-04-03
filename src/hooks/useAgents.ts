
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Task, Agent, AgentResponse } from "../types/agent";
import { AgentService } from "../services/agentService";

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await AgentService.listAgents();
      setAgents(response.agents);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const generateAgent = async (task: Task) => {
    setGenerating(true);
    setLastResponse(null);
    try {
      const response = await AgentService.generateAgent(task);
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
      
      return response;
    } catch (error) {
      console.error("Failed to generate agent:", error);
      toast.error("Failed to generate agent");
      throw error;
    } finally {
      setGenerating(false);
    }
  };

  const runAgent = async (agentId: string, task: Task) => {
    setLoading(true);
    setLastResponse(null);
    try {
      const response = await AgentService.runAgent(agentId, task);
      setLastResponse(response.output);
      return response;
    } catch (error) {
      console.error(`Failed to run agent ${agentId}:`, error);
      toast.error("Failed to run agent");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    agents,
    loading,
    generating,
    selectedAgent,
    lastResponse,
    setSelectedAgent,
    generateAgent,
    runAgent,
    refreshAgents: fetchAgents,
  };
};
