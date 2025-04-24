
import { useState, useEffect, useMemo } from 'react';

interface LogCountsType {
  total: number;
  INFO: number;
  WARNING: number;
  ERROR: number;
  DEBUG: number;
}

export const useDeploymentLogFiltering = (logs: string[]) => {
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Filter logs based on log level and time range
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Filter by log level
    if (logFilter !== 'ALL') {
      filtered = filtered.filter(log => log.includes(`[${logFilter}]`));
    }

    // Filter by time range
    if (timeRange !== 'ALL') {
      const now = new Date();
      let timeLimit: Date;

      switch (timeRange) {
        case '1H':
          timeLimit = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '6H':
          timeLimit = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          break;
        case '24H':
          timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7D':
          timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeLimit = new Date(0); // Beginning of time
      }

      filtered = filtered.filter(log => {
        try {
          // Extract timestamp from log (assuming format like "[2023-04-24T12:34:56.789Z]")
          const timestampMatch = log.match(/\[([\d\-T:.Z]+)\]/);
          if (timestampMatch && timestampMatch[1]) {
            const logTime = new Date(timestampMatch[1]);
            return logTime >= timeLimit;
          }
          return true; // If no timestamp found, include the log
        } catch (e) {
          return true; // If parsing fails, include the log
        }
      });
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => log.toLowerCase().includes(query));
    }

    return filtered;
  }, [logs, logFilter, timeRange, searchQuery]);

  // Count logs by type
  const logCounts = useMemo(() => {
    const counts: LogCountsType = {
      total: logs.length,
      INFO: 0,
      WARNING: 0,
      ERROR: 0,
      DEBUG: 0
    };

    logs.forEach(log => {
      if (log.includes('[INFO]')) counts.INFO++;
      else if (log.includes('[WARNING]') || log.includes('[WARN]')) counts.WARNING++;
      else if (log.includes('[ERROR]') || log.includes('[CRITICAL]')) counts.ERROR++;
      else if (log.includes('[DEBUG]')) counts.DEBUG++;
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
    logCounts
  };
};
