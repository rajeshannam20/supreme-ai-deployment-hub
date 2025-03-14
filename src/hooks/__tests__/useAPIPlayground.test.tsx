
import { renderHook, act } from '@testing-library/react-hooks';
import { useAPIPlayground } from '../useAPIPlayground';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('useAPIPlayground hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    expect(result.current.state).toEqual({
      selectedAPI: '',
      method: 'GET',
      endpoint: '',
      requestBody: '',
      headers: '{\n  "Content-Type": "application/json"\n}',
      response: '',
      status: '',
      loading: false,
    });
  });

  it('should update state when selecting an API', () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.handleSelectAPI('Test API', 'https://api.test.com', 'test-api-key');
    });
    
    expect(result.current.state.selectedAPI).toBe('Test API');
    expect(result.current.state.endpoint).toBe('https://api.test.com');
    expect(result.current.state.headers).toContain('test-api-key');
  });

  it('should update method state', () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setMethod('POST');
    });
    
    expect(result.current.state.method).toBe('POST');
  });

  it('should update endpoint state', () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setEndpoint('https://new-endpoint.com');
    });
    
    expect(result.current.state.endpoint).toBe('https://new-endpoint.com');
  });

  it('should update request body', () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setRequestBody('{"test": "value"}');
    });
    
    expect(result.current.state.requestBody).toBe('{"test": "value"}');
  });

  it('should update headers', () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setHeaders('{"Authorization": "Bearer token"}');
    });
    
    expect(result.current.state.headers).toBe('{"Authorization": "Bearer token"}');
  });

  it('should handle response saving', () => {
    const saveResponseMock = jest.fn();
    const { result } = renderHook(() => useAPIPlayground({ 
      onSaveResponse: saveResponseMock 
    }));
    
    // Setup state for a valid response
    act(() => {
      result.current.handleSelectAPI('Test API', 'https://api.test.com');
      result.current.setMethod('GET');
      // Manually update the response and status
      result.current.state.response = '{"data": "test"}';
      result.current.state.status = '200 OK';
    });
    
    act(() => {
      result.current.handleSaveResponse();
    });
    
    expect(saveResponseMock).toHaveBeenCalledWith(
      'Test API',
      'GET',
      'https://api.test.com',
      '200 OK',
      '{"data": "test"}'
    );
    expect(toast.success).toHaveBeenCalled();
  });

  it('should show error toast when trying to save without a response', () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.handleSaveResponse();
    });
    
    expect(toast.error).toHaveBeenCalledWith('No response to save');
  });

  it('should send a GET request successfully', async () => {
    const mockResponse = {
      json: jest.fn().resolves({ success: true }),
      ok: true,
      status: 200,
      statusText: 'OK'
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    const { result, waitForNextUpdate } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setEndpoint('https://api.test.com');
    });
    
    act(() => {
      result.current.sendRequest();
    });
    
    await waitForNextUpdate();
    
    expect(global.fetch).toHaveBeenCalledWith('https://api.test.com', expect.any(Object));
    expect(result.current.state.response).toContain('success');
    expect(result.current.state.status).toContain('200');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setEndpoint('https://api.test.com');
    });
    
    act(() => {
      result.current.sendRequest();
    });
    
    await waitForNextUpdate();
    
    expect(result.current.state.status).toBe('Request failed');
    expect(result.current.state.response).toContain('Network error');
    expect(toast.error).toHaveBeenCalled();
  });

  it('should validate request body JSON for non-GET requests', async () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setMethod('POST');
      result.current.setEndpoint('https://api.test.com');
      result.current.setRequestBody('invalid json');
    });
    
    act(() => {
      result.current.sendRequest();
    });
    
    expect(toast.error).toHaveBeenCalledWith('Invalid request body JSON format');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should validate headers JSON', async () => {
    const { result } = renderHook(() => useAPIPlayground());
    
    act(() => {
      result.current.setEndpoint('https://api.test.com');
      result.current.setHeaders('invalid json');
    });
    
    act(() => {
      result.current.sendRequest();
    });
    
    expect(toast.error).toHaveBeenCalledWith('Invalid headers JSON format');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
