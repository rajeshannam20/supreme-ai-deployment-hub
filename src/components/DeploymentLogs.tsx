
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { useDeployment } from '@/contexts/DeploymentContext';
import { useDeploymentLogFiltering } from '@/hooks/useDeploymentLogFiltering';

import { LogFilters } from '@/components/deployment/logs/LogFilters';
import { LogSearch } from '@/components/deployment/logs/LogSearch';
import { LogDisplay } from '@/components/deployment/logs/LogDisplay';
import { LogHeader } from '@/components/deployment/logs/LogHeader';
import { LogFooter } from '@/components/deployment/logs/LogFooter';

const DeploymentLogs: React.FC = () => {
  const { logs, clearLogs } = useDeployment();
  const [autoScroll, setAutoScroll] = useState(true);
  
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
  } = useDeploymentLogFiltering(logs);

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
