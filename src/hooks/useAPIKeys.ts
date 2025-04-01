
import { useAPI } from '@/contexts/APIContext';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, ClipboardCopy } from 'lucide-react';

/**
 * Custom hook for easily accessing and managing API keys
 */
export const useAPIKeys = () => {
  const { getSecureAPIKey, apiConfigs, updateAPIKey } = useAPI();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [lastUsed, setLastUsed] = useState<Record<string, Date>>({});

  // Load last used timestamps from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('devonn_api_last_used');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        const dates: Record<string, Date> = {};
        Object.keys(parsed).forEach(key => {
          dates[key] = new Date(parsed[key]);
        });
        setLastUsed(dates);
      }
    } catch (error) {
      console.error('Failed to load API usage history:', error);
    }
  }, []);

  // Update last used timestamp when an API is used
  const updateLastUsed = useCallback((apiName: string) => {
    const now = new Date();
    setLastUsed(prev => {
      const updated = { ...prev, [apiName]: now };
      try {
        localStorage.setItem('devonn_api_last_used', JSON.stringify(
          Object.entries(updated).reduce((acc, [key, value]) => {
            acc[key] = value.toISOString();
            return acc;
          }, {} as Record<string, string>)
        ));
      } catch (error) {
        console.error('Failed to save API usage history:', error);
      }
      return updated;
    });
  }, []);

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

  // Toggle visibility of an API key
  const toggleKeyVisibility = useCallback((name: string) => {
    setVisibleKeys(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  // Copy API key to clipboard
  const copyAPIKeyToClipboard = useCallback((name: string) => {
    const key = getSecureAPIKey(name);
    if (key) {
      navigator.clipboard.writeText(key)
        .then(() => toast.success(`API key for ${name} copied to clipboard`))
        .catch(() => toast.error('Failed to copy API key'));
    } else {
      toast.error(`No API key found for ${name}`);
    }
  }, [getSecureAPIKey]);

  // Get masked API key for display
  const getMaskedAPIKey = useCallback((name: string): string => {
    if (visibleKeys[name]) {
      return getSecureAPIKey(name) || '';
    }
    
    const key = getSecureAPIKey(name);
    if (!key) return '';
    
    // Show first 4 and last 4 characters, mask the rest
    if (key.length <= 8) {
      return '••••••••';
    }
    
    return `${key.substring(0, 4)}${'•'.repeat(Math.min(key.length - 8, 20))}${key.substring(key.length - 4)}`;
  }, [getSecureAPIKey, visibleKeys]);

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
      
      // Update last used timestamp
      updateLastUsed(apiName);
      
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
  }, [getSecureAPIKey, updateLastUsed]);

  // Get loading state for specific API
  const isLoading = (apiName: string): boolean => {
    return !!loading[apiName];
  };

  // Get last used timestamp for an API
  const getLastUsed = (apiName: string): Date | undefined => {
    return lastUsed[apiName];
  };

  // Check if key is currently visible
  const isKeyVisible = (apiName: string): boolean => {
    return !!visibleKeys[apiName];
  };

  return {
    getAPIKey,
    hasAPIKey,
    setAPIKey,
    makeAPIRequest,
    isLoading,
    getAPICredentials,
    availableAPIs: apiConfigs.map(c => c.name),
    toggleKeyVisibility,
    isKeyVisible,
    getMaskedAPIKey,
    copyAPIKeyToClipboard,
    getLastUsed
  };
};
