
import { toast } from 'sonner';
import { APIPlaygroundState } from './types';

interface UseRequestHandlerProps {
  state: APIPlaygroundState;
  updateState: (newState: Partial<APIPlaygroundState>) => void;
}

export const useRequestHandler = ({ state, updateState }: UseRequestHandlerProps) => {
  const validateRequest = () => {
    // Validate headers JSON
    try {
      JSON.parse(state.headers);
    } catch (e) {
      toast.error('Invalid headers JSON format');
      return false;
    }

    // Validate request body if not GET
    if (state.method !== 'GET' && state.requestBody) {
      try {
        JSON.parse(state.requestBody);
      } catch (e) {
        toast.error('Invalid request body JSON format');
        return false;
      }
    }

    return true;
  };

  const sendRequest = async () => {
    try {
      updateState({ loading: true, response: '', status: '' });

      // Validate request data
      if (!validateRequest()) {
        updateState({ loading: false });
        return;
      }

      const headersObj = JSON.parse(state.headers);

      // Build fetch options
      const options: RequestInit = {
        method: state.method,
        headers: headersObj as HeadersInit,
      };

      if (state.method !== 'GET' && state.requestBody) {
        options.body = JSON.stringify(JSON.parse(state.requestBody));
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

  return {
    sendRequest
  };
};
