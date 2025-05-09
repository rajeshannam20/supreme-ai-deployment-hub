
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { useDeployment } from '@/contexts/DeploymentContext';
import { useDeploymentLogFiltering } from '@/hooks/useDeploymentLogFiltering';
import { Log } from '@/types/logs';

import { 
  LogFilters, 
  LogSearch, 
  LogDisplay, 
  LogHeader, 
  LogFooter 
} from '@/components/deployment/logs';

const DeploymentLogs: React.FC = () => {
  const { logs, clearLogs } = useDeployment();
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Convert string logs to Log objects
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

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <LogHeader logs={filteredLogs} clearLogs={clearLogs} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LogFilters
            logFilter={logFilter}
            setLogFilter={setLogFilter}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
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
