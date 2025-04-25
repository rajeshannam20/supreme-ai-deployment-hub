
import { useState, useMemo } from 'react';
import { LogCounts, LogFilterType, TimeRangeType } from '@/types/logs';

export const useDeploymentLogFiltering = (logs: string[]) => {
  const [logFilter, setLogFilter] = useState<LogFilterType>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Filter logs based on type and time range
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Type filtering
      if (logFilter !== 'all') {
        const logType = logFilter.toUpperCase();
        if (!log.includes(logType)) {
          return false;
        }
      }

      // Time range filtering
      if (timeRange !== 'all') {
        // Extract timestamp from log entry [YYYY-MM-DD HH:MM:SS]
        const timestampMatch = log.match(/\[([\d-]+ [\d:]+)\]/);
        if (timestampMatch) {
          const now = new Date();
          const logTime = new Date(timestampMatch[1]);
          const diffMs = now.getTime() - logTime.getTime();
          
          if (timeRange === 'recent' && diffMs > 10 * 60 * 1000) return false;
          if (timeRange === 'hour' && diffMs > 60 * 60 * 1000) return false;
          if (timeRange === 'day' && diffMs > 24 * 60 * 60 * 1000) return false;
          if (timeRange === 'week' && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
        }
      }

      // Search filtering
      if (isSearching && searchQuery && !log.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [logs, logFilter, timeRange, searchQuery, isSearching]);

  // Calculate log counts for the badges
  const logCounts: LogCounts = useMemo(() => {
    return {
      all: logs.length,
      info: logs.filter(log => log.includes('INFO')).length,
      warning: logs.filter(log => log.includes('WARNING')).length,
      error: logs.filter(log => log.includes('ERROR')).length,
      success: logs.filter(log => log.includes('SUCCESS')).length
    };
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
