
import { useState, useEffect, useMemo } from 'react';

interface LogCounts {
  INFO: number;
  WARNING: number;
  ERROR: number;
  DEBUG: number;
}

export const useDeploymentLogFiltering = (logs: string[]) => {
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Count logs by type
  const logCounts = useMemo(() => {
    return logs.reduce((counts, log) => {
      if (log.includes('[INFO]')) counts.INFO++;
      else if (log.includes('[WARNING]')) counts.WARNING++;
      else if (log.includes('[ERROR]')) counts.ERROR++;
      else if (log.includes('[DEBUG]')) counts.DEBUG++;
      return counts;
    }, { INFO: 0, WARNING: 0, ERROR: 0, DEBUG: 0 } as LogCounts);
  }, [logs]);

  // Filter logs by type and time
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Filter by log level
    if (logFilter !== 'ALL') {
      filtered = filtered.filter(log => log.includes(`[${logFilter}]`));
    }

    // Filter by time range
    if (timeRange !== 'all' && filtered.length > 0) {
      const now = new Date();
      let cutoffTime: Date;

      switch (timeRange) {
        case 'hour':
          cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case 'day':
          cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          return filtered;
      }

      filtered = filtered.filter(log => {
        try {
          // Extract timestamp assuming format like: "[2025-04-24T12:34:56.789Z]"
          const timestamp = log.match(/\[([\d\-T:.Z]+)\]/)?.[1];
          if (timestamp) {
            const logDate = new Date(timestamp);
            return logDate >= cutoffTime;
          }
          return true;
        } catch (e) {
          return true;
        }
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [logs, logFilter, timeRange, searchQuery]);

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
    logCounts
  };
};

export default useDeploymentLogFiltering;
