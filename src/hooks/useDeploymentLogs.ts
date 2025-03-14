
import { useState } from 'react';

export const useDeploymentLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);

  // Add a log entry with timestamp
  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logEntry]);
  };

  return {
    logs,
    addLog
  };
};
