
import React, { useRef, useEffect } from 'react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DeploymentLogs = () => {
  const { logs } = useDeployment();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when logs update
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black text-white p-4 rounded font-mono text-sm h-80 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-400">No logs available. Start the deployment to see logs.</div>
          ) : (
            logs.map((log, index) => {
              const logClass = log.includes('ERROR') 
                ? 'text-red-400' 
                : log.includes('SUCCESS') 
                  ? 'text-green-400' 
                  : log.includes('WARNING') 
                    ? 'text-yellow-400' 
                    : 'text-gray-400';
              
              return <div key={index} className={logClass}>{log}</div>;
            })
          )}
          <div ref={logsEndRef} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentLogs;
