
import React, { useEffect } from 'react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Card, CardContent } from '@/components/ui/card';
import LogFilters from '@/components/deployment/logs/LogFilters';
import LogSearch from '@/components/deployment/logs/LogSearch';
import LogDisplay from '@/components/deployment/logs/LogDisplay';
import { useDeploymentLogFiltering } from '@/hooks/useDeploymentLogFiltering';
import { useLogAutoScroll } from '@/hooks/useLogAutoScroll';
import { LogHeader } from '@/components/deployment/logs/LogHeader';
import { LogFooter } from '@/components/deployment/logs/LogFooter';

const DeploymentLogs = () => {
  const { logs, exportLogs, clearLogs } = useDeployment();
  const [autoScroll, setAutoScroll] = React.useState<boolean>(true);
  
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
    logCounts,
  } = useDeploymentLogFiltering(logs);

  const logsEndRef = useLogAutoScroll(filteredLogs, autoScroll);

  useEffect(() => {
    const savedFilter = localStorage.getItem('logFilter');
    const savedTimeRange = localStorage.getItem('timeRange');
    if (savedFilter) setLogFilter(savedFilter);
    if (savedTimeRange) setTimeRange(savedTimeRange);
  }, []);

  useEffect(() => {
    localStorage.setItem('logFilter', logFilter);
    localStorage.setItem('timeRange', timeRange);
  }, [logFilter, timeRange]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (logs.length > 0) {
        const lastTimestamp = new Date(logs[logs.length - 1].substring(1, 20)).getTime();
        console.log('Checking for new logs since:', new Date(lastTimestamp).toISOString());
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [logs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  return (
    <Card className="shadow-md">
      <LogHeader 
        logCounts={logCounts}
        filteredLogsCount={filteredLogs.length}
        onClear={clearLogs}
      />

      <LogFilters
        logFilter={logFilter}
        onFilterChange={setLogFilter}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        autoScroll={autoScroll}
        onAutoScrollChange={() => setAutoScroll(!autoScroll)}
        logCounts={logCounts}
      />

      <LogSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={isSearching}
        onSubmit={handleSearch}
      />
      
      <CardContent className="p-0">
        <div className="bg-black text-white p-4 rounded-b font-mono text-sm h-80 overflow-y-auto">
          <LogDisplay
            logs={filteredLogs}
            searchQuery={searchQuery}
            logFilter={logFilter}
          />
          <div ref={logsEndRef} />
        </div>
      </CardContent>

      <LogFooter 
        logs={logs}
        errorCount={logCounts.ERROR}
        exportLogs={exportLogs}
        clearLogs={clearLogs}
      />
    </Card>
  );
};

export default DeploymentLogs;
