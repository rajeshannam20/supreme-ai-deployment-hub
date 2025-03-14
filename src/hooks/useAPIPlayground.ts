
import { useState } from 'react';
import { toast } from 'sonner';

export interface APIPlaygroundState {
  selectedAPI: string;
  method: string;
  endpoint: string;
  requestBody: string;
  headers: string;
  response: string;
  status: string;
  loading: boolean;
}

interface UseAPIPlaygroundProps {
  onSaveResponse?: (
    apiName: string,
    method: string,
    endpoint: string,
    status: string,
    response: string
  ) => void;
}

export const useAPIPlayground = ({ onSaveResponse }: UseAPIPlaygroundProps = {}) => {
  const [state, setState] = useState<APIPlaygroundState>({
    selectedAPI: '',
    method: 'GET',
    endpoint: '',
    requestBody: '',
    headers: '{\n  "Content-Type": "application/json"\n}',
    response: '',
    status: '',
    loading: false,
  });

  const updateState = (newState: Partial<APIPlaygroundState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const handleSelectAPI = (apiName: string, apiEndpoint: string, apiKey?: string) => {
    updateState({ 
      selectedAPI: apiName,
      endpoint: apiEndpoint
    });
    
    // If the API has an API key, add it to the headers
    if (apiKey) {
      setHeaders(prev => {
        try {
          const headersObj = JSON.parse(prev);
          return JSON.stringify({
            ...headersObj,
            "Authorization": `Bearer ${apiKey}`
          }, null, 2);
        } catch (e) {
          // If the headers aren't valid JSON, start fresh
          return `{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer ${apiKey}"\n}`;
        }
      });
    }
  };

  const setMethod = (value: string) => updateState({ method: value });
  const setEndpoint = (value: string) => updateState({ endpoint: value });
  const setRequestBody = (value: string) => updateState({ requestBody: value });
  const setHeaders = (value: string | ((prev: string) => string)) => {
    if (typeof value === 'function') {
      setState(prev => ({
        ...prev,
        headers: value(prev.headers)
      }));
    } else {
      updateState({ headers: value });
    }
  };

  const sendRequest = async () => {
    try {
      updateState({ loading: true, response: '', status: '' });

      // Validate headers JSON
      let headersObj = {};
      try {
        headersObj = JSON.parse(state.headers);
      } catch (e) {
        toast.error('Invalid headers JSON format');
        updateState({ loading: false });
        return;
      }

      // Validate request body if not GET
      let bodyData = undefined;
      if (state.method !== 'GET' && state.requestBody) {
        try {
          bodyData = JSON.parse(state.requestBody);
        } catch (e) {
          toast.error('Invalid request body JSON format');
          updateState({ loading: false });
          return;
        }
      }

      // Build fetch options
      const options: RequestInit = {
        method: state.method,
        headers: headersObj as HeadersInit,
      };

      if (state.method !== 'GET' && bodyData) {
        options.body = JSON.stringify(bodyData);
      }

      // Send the request
      const fetchResponse = await fetch(state.endpoint, options);
      const statusText = `${fetchResponse.status} ${fetchResponse.statusText}`;
      
      // Try to parse as JSON first
      try {
        const data = await fetchResponse.json();
        updateState({ 
          status: statusText,
          response: JSON.stringify(data, null, 2)
        });
      } catch (e) {
        // If not JSON, get as text
        const text = await fetchResponse.text();
        updateState({ status: statusText, response: text });
      }

      if (fetchResponse.ok) {
        toast.success(`Request successful: ${statusText}`);
      } else {
        toast.error(`Request failed: ${statusText}`);
      }
    } catch (error) {
      console.error('API request error:', error);
      updateState({ 
        status: 'Request failed',
        response: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      toast.error('Request failed. Check console for details.');
    } finally {
      updateState({ loading: false });
    }
  };

  const handleSaveResponse = () => {
    if (!state.response || !state.status || !state.selectedAPI) {
      toast.error('No response to save');
      return;
    }
    
    if (onSaveResponse) {
      onSaveResponse(
        state.selectedAPI, 
        state.method, 
        state.endpoint, 
        state.status, 
        state.response
      );
      toast.success('Response saved successfully');
    }
  };

  return {
    state,
    handleSelectAPI,
    setMethod,
    setEndpoint,
    setRequestBody,
    setHeaders,
    sendRequest,
    handleSaveResponse
  };
};
