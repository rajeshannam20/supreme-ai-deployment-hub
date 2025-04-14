
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DeploymentEnvironment, CloudProvider } from '../types/deployment';
import { DeploymentLogger, createLogger, LogEntry } from '../services/deployment/loggingService';

export const useDeploymentLogs = (
  environment: DeploymentEnvironment = 'development',
  provider: CloudProvider = 'aws'
) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [detailedLogs, setDetailedLogs] = useState<LogEntry[]>([]);
  const [logger, setLogger] = useState<DeploymentLogger>(
    createLogger(environment, provider)
  );

  // Update logger when environment or provider changes
  useEffect(() => {
    logger.setEnvironment(environment);
    logger.setProvider(provider);
  }, [environment, provider, logger]);

  // Add a log entry with timestamp
  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' | 'debug' = 'info', context?: Record<string, any>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    // Add formatted log to the UI log list
    setLogs(prevLogs => [...prevLogs, logEntry]);
    
    // Use the advanced logger to log with more details
    switch (type) {
      case 'info':
        logger.info(message, context);
        break;
      case 'success':
        logger.success(message, context);
        // Show toast for success messages
        toast.success(message);
        break;
      case 'warning':
        logger.warning(message, context);
        // Show toast for warning messages
        toast.warning(message);
        break;
      case 'error':
        logger.error(message, context);
        // Show toast for error messages
        toast.error(message);
        break;
      case 'debug':
        logger.debug(message, context);
        break;
    }
  }, [logger]);

  // Get detailed logs from the logger
  const getDetailedLogs = useCallback(() => {
    const recentLogs = logger.getRecentLogs();
    setDetailedLogs(recentLogs);
    return recentLogs;
  }, [logger]);

  // Export logs to JSON for troubleshooting
  const exportLogs = useCallback(() => {
    return logger.exportLogs();
  }, [logger]);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
    logger.clearLogs();
  }, [logger]);

  return {
    logs,
    detailedLogs,
    addLog,
    getDetailedLogs,
    exportLogs,
    clearLogs
  };
};
