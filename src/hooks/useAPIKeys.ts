
import { useAPI } from '@/contexts/APIContext';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for easily accessing and managing API keys
 */
export const useAPIKeys = () => {
  const { getSecureAPIKey, apiConfigs, updateAPIKey } = useAPI();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Get a specific API key by name
  const getAPIKey = (name: string): string | undefined => {
    return getSecureAPIKey(name);
  };

  // Get a specific API key and endpoint for easy API requests
  const getAPICredentials = (name: string): { apiKey?: string; endpoint?: string } => {
    const config = apiConfigs.find(c => c.name === name);
    return {
      apiKey: config?.apiKey,
      endpoint: config?.endpoint
    };
  };

  // Check if API key is available
  const hasAPIKey = (name: string): boolean => {
    const key = getSecureAPIKey(name);
    return !!key && key.length > 0;
  };

  // Update an API key
  const setAPIKey = useCallback((name: string, key: string) => {
    updateAPIKey(name, key);
  }, [updateAPIKey]);

  // Use an API key to make a request with proper headers
  const makeAPIRequest = useCallback(async (
    apiName: string, 
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const apiKey = getSecureAPIKey(apiName);
    
    if (!apiKey) {
      toast.error(`No API key found for ${apiName}`);
      return null;
    }
    
    setLoading(prev => ({ ...prev, [apiName]: true }));
    
    try {
      // Add authorization header
      const headers = new Headers(options.headers || {});
      headers.set('Authorization', `Bearer ${apiKey}`);
      
      const response = await fetch(endpoint, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error making API request to ${apiName}:`, error);
      toast.error(`API request to ${apiName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [apiName]: false }));
    }
  }, [getSecureAPIKey]);

  // Get loading state for specific API
  const isLoading = (apiName: string): boolean => {
    return !!loading[apiName];
  };

  return {
    getAPIKey,
    hasAPIKey,
    setAPIKey,
    makeAPIRequest,
    isLoading,
    getAPICredentials,
    availableAPIs: apiConfigs.map(c => c.name)
  };
};
