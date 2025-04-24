
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, X, RefreshCw, Clock, Search, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { saveAs } from 'file-saver';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const DeploymentLogs = () => {
  const { logs, exportLogs, clearLogs } = useDeployment();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Auto-scroll to the bottom when logs update
  useEffect(() => {
    if (logsEndRef.current && autoScroll) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Filter logs based on selected type, time range, and search query
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

  // Count logs by severity
  const logCounts = useMemo(() => {
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

  // Handle log export
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

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Artificial delay to simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  // Determine log class based on log content
  const getLogClass = (log: string) => {
    if (log.includes('ERROR')) return 'text-red-500 font-medium';
    if (log.includes('SUCCESS')) return 'text-green-500';
    if (log.includes('WARNING')) return 'text-yellow-500';
    if (log.includes('DEBUG')) return 'text-blue-400';
    return 'text-gray-300';
  };
  
  // Format log entry for display
  const formatLogEntry = (log: string) => {
    // Highlight the search term if present
    if (searchQuery && log.toLowerCase().includes(searchQuery.toLowerCase())) {
      const parts = log.split(new RegExp(`(${searchQuery})`, 'gi'));
      return (
        <span>
          {parts.map((part, i) => 
            part.toLowerCase() === searchQuery.toLowerCase() 
              ? <span key={i} className="bg-yellow-500/20 px-1 rounded">{part}</span> 
              : part
          )}
        </span>
      );
    }
    return log;
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
            <Badge variant="warning" className="ml-2 bg-yellow-500 hover:bg-yellow-600">
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

      <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
        <Tabs defaultValue="all" className="w-full" onValueChange={setLogFilter}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <TabsList className="bg-background">
              <TabsTrigger value="all">
                All
              </TabsTrigger>
              <TabsTrigger value="ERROR" className="text-red-500">
                Errors {logCounts.ERROR > 0 && `(${logCounts.ERROR})`}
              </TabsTrigger>
              <TabsTrigger value="WARNING" className="text-yellow-500">
                Warnings {logCounts.WARNING > 0 && `(${logCounts.WARNING})`}
              </TabsTrigger>
              <TabsTrigger value="SUCCESS" className="text-green-500">
                Success {logCounts.SUCCESS > 0 && `(${logCounts.SUCCESS})`}
              </TabsTrigger>
              <TabsTrigger value="INFO" className="text-blue-500">
                Info {logCounts.INFO > 0 && `(${logCounts.INFO})`}
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="5">Last 5 minutes</SelectItem>
                    <SelectItem value="15">Last 15 minutes</SelectItem>
                    <SelectItem value="60">Last hour</SelectItem>
                    <SelectItem value="1440">Last 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs" 
                onClick={() => setAutoScroll(!autoScroll)}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${autoScroll ? 'animate-spin' : ''}`} />
                {autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      <div className="p-3 bg-muted/10 border-b">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
      
      <CardContent className="p-0">
        <div className="bg-black text-white p-4 rounded-b font-mono text-sm h-80 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-gray-400 flex items-center justify-center h-full">
              <div className="text-center">
                {searchQuery ? (
                  <>
                    <Search className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No logs matching your search criteria.</p>
                  </>
                ) : (
                  <>
                    <Filter className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No logs available{logFilter !== 'all' ? ' for the selected filter' : '. Start the deployment to see logs'}.</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              {filteredLogs.map((log, index) => (
                <div key={index} className={getLogClass(log)}>
                  <pre className="whitespace-pre-wrap break-words">{formatLogEntry(log)}</pre>
                </div>
              ))}
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 py-2 border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleExportLogs} className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            Export Logs
          </Button>
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
