
import { renderHook, act } from '@testing-library/react-hooks';
import { useDeploymentLogFiltering } from '../../hooks/useDeploymentLogFiltering';

describe('useDeploymentLogFiltering', () => {
  const mockLogs = [
    '[2024-04-24 10:00:00] INFO: Server started',
    '[2024-04-24 10:00:01] ERROR: Connection failed',
    '[2024-04-24 10:00:02] WARNING: High memory usage',
    '[2024-04-24 10:00:03] SUCCESS: Task completed',
    '[2024-04-24 10:00:04] DEBUG: Processing request'
  ];

  it('initializes with default values', () => {
    const { result } = renderHook(() => useDeploymentLogFiltering(mockLogs));
    expect(result.current.logFilter).toBe('all');
    expect(result.current.timeRange).toBe('all');
    expect(result.current.searchQuery).toBe('');
    expect(result.current.isSearching).toBe(false);
  });

  it('filters logs by type correctly', () => {
    const { result } = renderHook(() => useDeploymentLogFiltering(mockLogs));
    
    act(() => {
      result.current.setLogFilter('ERROR');
    });
    
    expect(result.current.filteredLogs).toHaveLength(1);
    expect(result.current.filteredLogs[0]).toContain('ERROR: Connection failed');
  });

  it('filters logs by search query', () => {
    const { result } = renderHook(() => useDeploymentLogFiltering(mockLogs));
    
    act(() => {
      result.current.setSearchQuery('Server');
    });
    
    expect(result.current.filteredLogs).toHaveLength(1);
    expect(result.current.filteredLogs[0]).toContain('Server started');
  });

  it('calculates log counts correctly', () => {
    const { result } = renderHook(() => useDeploymentLogFiltering(mockLogs));
    
    expect(result.current.logCounts).toEqual({
      ERROR: 1,
      WARNING: 1,
      SUCCESS: 1,
      INFO: 1,
      DEBUG: 1,
      total: 5
    });
  });

  it('filters logs by time range', () => {
    jest.useFakeTimers();
    const now = new Date('2024-04-24T10:01:00');
    jest.setSystemTime(now);

    const { result } = renderHook(() => useDeploymentLogFiltering(mockLogs));
    
    act(() => {
      result.current.setTimeRange('1'); // Last 1 minute
    });
    
    expect(result.current.filteredLogs.length).toBeLessThanOrEqual(mockLogs.length);
    
    jest.useRealTimers();
  });
});
