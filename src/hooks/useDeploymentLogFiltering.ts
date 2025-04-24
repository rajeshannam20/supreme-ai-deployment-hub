
import { useMemo, useState } from 'react';

interface LogCounts {
  ERROR: number;
  WARNING: number;
  SUCCESS: number;
  INFO: number;
  DEBUG: number;
  total: number;
}

export const useDeploymentLogFiltering = (logs: string[]) => {
  const [logFilter, setLogFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Filter by log type
      const typeMatch = logFilter === 'all' || log.includes(logFilter);
      
      // Filter by time range
      let timeMatch = true;
      if (timeRange !== 'all') {
        const logTimestamp = new Date(log.substring(1, 20)).getTime();
        const now = new Date().getTime();
        const rangeMs = parseInt(timeRange) * 60 * 1000; // convert minutes to ms
        timeMatch = now - logTimestamp <= rangeMs;
      }
      
      // Filter by search query
      const searchMatch = !searchQuery || log.toLowerCase().includes(searchQuery.toLowerCase());
      
      return typeMatch && timeMatch && searchMatch;
    });
  }, [logs, logFilter, timeRange, searchQuery]);

  const logCounts: LogCounts = useMemo(() => {
    const counts = {
      ERROR: 0,
      WARNING: 0,
      SUCCESS: 0,
      INFO: 0,
      DEBUG: 0,
      total: logs.length
    };

    logs.forEach(log => {
      if (log.includes('ERROR')) counts.ERROR++;
      else if (log.includes('WARNING')) counts.WARNING++;
      else if (log.includes('SUCCESS')) counts.SUCCESS++;
      else if (log.includes('INFO')) counts.INFO++;
      else if (log.includes('DEBUG')) counts.DEBUG++;
    });

    return counts;
  }, [logs]);

  return {
    logFilter,
    setLogFilter,
    timeRange,
    setTimeRange,
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
    filteredLogs,
    logCounts,
  };
};
