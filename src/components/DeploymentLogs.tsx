import React, { useRef, useEffect, useState } from 'react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { saveAs } from 'file-saver';
import { toast } from '@/hooks/use-toast';
import LogFilters from '@/components/deployment/logs/LogFilters';
import LogSearch from '@/components/deployment/logs/LogSearch';
import LogDisplay from '@/components/deployment/logs/LogDisplay';
import { useDeploymentLogFiltering } from '@/hooks/useDeploymentLogFiltering';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const DeploymentLogs = () => {
  const { logs, exportLogs, clearLogs } = useDeployment();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  
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

  useEffect(() => {
    if (logsEndRef.current && autoScroll) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleExportLogs = () => {
    try {
      const exportData = exportLogs ? exportLogs() : JSON.stringify(logs, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(blob, `deployment-logs-${timestamp}.json`);
      toast({
        title: "Logs Exported",
        description: "Log file has been downloaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to export logs:', error);
      toast({
        title: "Export Failed",
        description: "Could not export log file",
        variant: "destructive",
      });
    }
  };

  const exportLogsAsCSV = () => {
    try {
      const csvContent = logs.map(log => {
        const timestamp = log.substring(1, 20);
        const levelMatch = log.match(/\[(INFO|WARNING|ERROR|DEBUG)\]/);
        const level = levelMatch ? levelMatch[1] : 'UNKNOWN';
        const message = log.substring(log.indexOf(']', log.indexOf(']') + 1) + 2);
        return `"${timestamp}","${level}","${message.replace(/"/g, '""')}"`;
      }).join('\n');
      
      const csvHeader = 'Timestamp,Level,Message\n';
      const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(blob, `deployment-logs-${timestamp}.csv`);
      
      toast({
        title: "Logs Exported",
        description: "Log file has been downloaded as CSV",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to export logs as CSV:', error);
      toast({
        title: "Export Failed",
        description: "Could not export log file",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="flex items-center space-x-2">
          <span>Deployment Logs</span>
          {logCounts.ERROR > 0 && (
            <Badge variant="destructive" className="ml-2">
              {logCounts.ERROR} {logCounts.ERROR === 1 ? 'Error' : 'Errors'}
            </Badge>
          )}
          {logCounts.WARNING > 0 && (
            <Badge variant="outline" className="ml-2 bg-yellow-500 text-white hover:bg-yellow-600">
              {logCounts.WARNING} {logCounts.WARNING === 1 ? 'Warning' : 'Warnings'}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {filteredLogs.length} of {logCounts.total} logs
          </Badge>
          {clearLogs && (
            <Button variant="ghost" size="icon" onClick={clearLogs} title="Clear logs">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

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

      <CardFooter className="flex justify-between bg-muted/30 py-2 border-t">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export Logs
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportLogs}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportLogsAsCSV}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {logs.length > 0 && clearLogs && (
            <Button variant="ghost" size="sm" onClick={clearLogs} className="text-xs text-muted-foreground">
              <X className="h-3 w-3 mr-1" />
              Clear Logs
            </Button>
          )}
        </div>
        {logCounts.ERROR > 0 && (
          <div className="flex items-center text-xs text-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {logCounts.ERROR} {logCounts.ERROR === 1 ? 'error' : 'errors'} detected
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeploymentLogs;
