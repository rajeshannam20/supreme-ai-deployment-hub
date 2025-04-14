
import React, { useRef, useEffect, useState } from 'react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, X, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { saveAs } from 'file-saver';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const DeploymentLogs = () => {
  const { logs, exportLogs, clearLogs } = useDeployment();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Auto-scroll to the bottom when logs update
  useEffect(() => {
    if (logsEndRef.current && autoScroll) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Filter logs based on selected type
  const filteredLogs = logs.filter(log => {
    if (logFilter === 'all') return true;
    return log.toLowerCase().includes(logFilter.toLowerCase());
  });

  // Handle log export
  const handleExportLogs = () => {
    try {
      const exportData = exportLogs ? exportLogs() : JSON.stringify(logs, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(blob, `deployment-logs-${timestamp}.json`);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  // Determine log class based on log content
  const getLogClass = (log: string) => {
    if (log.includes('ERROR')) return 'text-red-400';
    if (log.includes('SUCCESS')) return 'text-green-400';
    if (log.includes('WARNING')) return 'text-yellow-400';
    if (log.includes('DEBUG')) return 'text-blue-300';
    return 'text-gray-400';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle>Deployment Logs</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {filteredLogs.length} logs
          </Badge>
          {clearLogs && (
            <Button variant="ghost" size="icon" onClick={clearLogs} title="Clear logs">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full" onValueChange={setLogFilter}>
          <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
            <TabsList className="bg-background">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ERROR">Errors</TabsTrigger>
              <TabsTrigger value="WARNING">Warnings</TabsTrigger>
              <TabsTrigger value="SUCCESS">Success</TabsTrigger>
              <TabsTrigger value="INFO">Info</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
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
          
          <div className="bg-black text-white p-4 rounded-b font-mono text-sm h-80 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-gray-400 flex items-center justify-center h-full">
                <div className="text-center">
                  <Filter className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No logs available{logFilter !== 'all' ? ' for the selected filter' : '. Start the deployment to see logs'}.</p>
                </div>
              </div>
            ) : (
              <TabsContent value="all" className="mt-0 p-0">
                {filteredLogs.map((log, index) => (
                  <div key={index} className={getLogClass(log)}>
                    <pre className="whitespace-pre-wrap break-words">{log}</pre>
                  </div>
                ))}
              </TabsContent>
            )}
            <div ref={logsEndRef} />
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 py-2 border-t">
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
      </CardFooter>
    </Card>
  );
};

export default DeploymentLogs;
