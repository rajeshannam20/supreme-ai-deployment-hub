
import { useCallback } from "react";
import { AgentMemory, AgentMemorySearchParams } from "@/types/agent";
import { agentApi } from "@/api/agentApi";

/**
 * Hook for agent memory operations
 */
export const useAgentMemory = (
  stateProps: {
    setAgentMemories: (memories: AgentMemory[]) => void;
    setMemoryLoading: (loading: boolean) => void;
  }
) => {
  const { setAgentMemories, setMemoryLoading } = stateProps;
  
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
  }, [setAgentMemories, setMemoryLoading]);
  
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
  }, [setMemoryLoading]);

  return {
    fetchAgentMemories,
    searchAgentMemory
  };
};
