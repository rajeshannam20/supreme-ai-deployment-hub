
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { useDeployment } from '@/contexts/deployment';
import { useDeploymentLogFiltering } from '@/hooks/useDeploymentLogFiltering';
import { Log, TimeRangeType, LogFilterType } from '@/types/logs';
import { toast } from 'sonner';

import { 
  LogFilters, 
  LogSearch, 
  LogDisplay, 
  LogHeader, 
  LogFooter 
} from '@/components/deployment/logs';

const DeploymentLogs: React.FC = () => {
  const { logs, clearLogs, addLog } = useDeployment();
  const [autoScroll, setAutoScroll] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamInterval, setStreamInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Parse string logs to Log objects
  const logObjects: Log[] = logs.map(logString => {
    // Parse log string: [YYYY-MM-DD HH:MM:SS] TYPE: Message
    const timestampMatch = logString.match(/\[([\d-]+ [\d:]+)\]/);
    const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString();
    
    let type: 'info' | 'error' | 'warning' | 'success' | 'debug' = 'info';
    if (logString.includes('ERROR')) type = 'error';
    else if (logString.includes('WARNING')) type = 'warning';
    else if (logString.includes('SUCCESS')) type = 'success';
    else if (logString.includes('DEBUG')) type = 'debug';
    
    const messageMatch = logString.match(/\]\s*[A-Z]+:\s*(.*)/);
    const message = messageMatch ? messageMatch[1] : logString;
    
    return { message, timestamp, type };
  });
  
  const {
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
  } = useDeploymentLogFiltering(logObjects);

  // Handle log export with more formats
  const exportLogs = useCallback((format: 'txt' | 'json' | 'csv' = 'txt') => {
    if (filteredLogs.length === 0) {
      toast.error('No logs to export');
      return;
    }
    
    let content = '';
    let filename = `deployment-logs-${new Date().toISOString().slice(0, 10)}`;
    let type = 'text/plain';
    
    if (format === 'txt') {
      content = filteredLogs.map(log => 
        `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
      ).join('\n');
      filename += '.txt';
    } else if (format === 'json') {
      content = JSON.stringify(filteredLogs, null, 2);
      filename += '.json';
      type = 'application/json';
    } else if (format === 'csv') {
      content = 'Timestamp,Type,Message\n';
      content += filteredLogs.map(log => 
        `"${log.timestamp}","${log.type}","${log.message.replace(/"/g, '""')}"`
      ).join('\n');
      filename += '.csv';
      type = 'text/csv';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Logs exported as ${format.toUpperCase()}`);
  }, [filteredLogs]);

  // Clear all log data
  const handleClearLogs = () => {
    clearLogs();
    toast.info('Logs cleared');
  };

  // Toggle real-time log streaming simulation
  const toggleStreaming = useCallback(() => {
    if (isStreaming) {
      if (streamInterval) {
        clearInterval(streamInterval);
        setStreamInterval(null);
      }
      setIsStreaming(false);
      toast.info('Log streaming stopped');
    } else {
      // This is a simulation - in a real app, we'd connect to a websocket or SSE
      const interval = setInterval(() => {
        const types = ['info', 'error', 'warning', 'success', 'debug'] as const;
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomMessage = `Auto-generated log message at ${new Date().toLocaleTimeString()}`;
        
        addLog(randomMessage, randomType);
      }, 3000);
      
      setStreamInterval(interval);
      setIsStreaming(true);
      toast.success('Log streaming started');
    }
  }, [isStreaming, streamInterval, addLog]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamInterval) {
        clearInterval(streamInterval);
      }
    };
  }, [streamInterval]);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <LogHeader 
          logs={filteredLogs} 
          clearLogs={handleClearLogs} 
          exportLogs={exportLogs}
          isStreaming={isStreaming}
          toggleStreaming={toggleStreaming}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LogFilters
            logFilter={logFilter}
            setLogFilter={(filter: LogFilterType) => setLogFilter(filter)}
            timeRange={timeRange}
            setTimeRange={(range: TimeRangeType) => setTimeRange(range)}
            logCounts={logCounts}
          />
          <div className="lg:col-span-2">
            <LogSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
            />
          </div>
        </div>
        
        <LogDisplay 
          logs={filteredLogs} 
          autoScroll={autoScroll} 
          highlightTerm={isSearching ? searchQuery : undefined}
        />
        
        <LogFooter 
          logCount={filteredLogs.length} 
          autoScroll={autoScroll} 
          setAutoScroll={setAutoScroll} 
        />
      </CardContent>
    </Card>
  );
};

export default DeploymentLogs;
