
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { DeploymentEnvironment, CloudProvider } from '../types/deployment';
import { DeploymentLogger, createLogger, LogEntry } from '../services/deployment/loggingService';

export const useDeploymentLogs = (
  environment: DeploymentEnvironment = 'development',
  provider: CloudProvider = 'aws'
) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [detailedLogs, setDetailedLogs] = useState<LogEntry[]>([]);
  const loggerRef = useRef<DeploymentLogger>(createLogger(environment, provider));
  
  // Track if the component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Update logger when environment or provider changes
  useEffect(() => {
    const logger = loggerRef.current;
    logger.setEnvironment(environment);
    logger.setProvider(provider);
  }, [environment, provider]);
  
  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Add a log entry with timestamp
  const addLog = useCallback((
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' | 'debug' = 'info', 
    context?: Record<string, any>,
    showToast: boolean = true
  ) => {
    if (!isMountedRef.current) return;
    
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    // Add formatted log to the UI log list
    setLogs(prevLogs => [...prevLogs, logEntry]);
    
    // Use the advanced logger to log with more details
    const logger = loggerRef.current;
    switch (type) {
      case 'info':
        logger.info(message, context);
        break;
      case 'success':
        logger.success(message, context);
        // Show toast for success messages
        if (showToast) toast.success(message);
        break;
      case 'warning':
        logger.warning(message, context);
        // Show toast for warning messages
        if (showToast) toast.warning(message);
        break;
      case 'error':
        logger.error(message, context);
        // Show toast for error messages
        if (showToast) toast.error(message);
        break;
      case 'debug':
        logger.debug(message, context);
        break;
    }
  }, []);

  // Get detailed logs from the logger
  const getDetailedLogs = useCallback(() => {
    if (!isMountedRef.current) return [];
    
    const recentLogs = loggerRef.current.getRecentLogs();
    setDetailedLogs(recentLogs);
    return recentLogs;
  }, []);

  // Get logs filtered by level
  const getLogsByLevel = useCallback((level: 'info' | 'success' | 'warning' | 'error' | 'debug', count: number = 50) => {
    return loggerRef.current.getLogsByLevel(level, count);
  }, []);

  // Export logs to JSON for troubleshooting
  const exportLogs = useCallback(() => {
    return loggerRef.current.exportLogs();
  }, []);

  // Clear logs
  const clearLogs = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setLogs([]);
    setDetailedLogs([]);
    loggerRef.current.clearLogs();
  }, []);
  
  // Search logs
  const searchLogs = useCallback((searchTerm: string, caseSensitive: boolean = false): string[] => {
    if (!searchTerm.trim()) return logs;
    
    return logs.filter(log => {
      if (caseSensitive) {
        return log.includes(searchTerm);
      } else {
        return log.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }, [logs]);
  
  // Add multiple logs at once
  const addBatchLogs = useCallback((messages: {message: string, type?: 'info' | 'success' | 'warning' | 'error' | 'debug'}[]) => {
    if (!isMountedRef.current) return;
    
    const newLogs = messages.map(item => {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const type = item.type || 'info';
      return `[${timestamp}] ${type.toUpperCase()}: ${item.message}`;
    });
    
    // Add all logs at once to minimize renders
    setLogs(prevLogs => [...prevLogs, ...newLogs]);
    
    // Log each message with the logger
    messages.forEach(item => {
      const type = item.type || 'info';
      const logger = loggerRef.current;
      
      switch (type) {
        case 'info':
          logger.info(item.message);
          break;
        case 'success':
          logger.success(item.message);
          break;
        case 'warning':
          logger.warning(item.message);
          break;
        case 'error':
          logger.error(item.message);
          break;
        case 'debug':
          logger.debug(item.message);
          break;
      }
    });
  }, []);

  return {
    logs,
    detailedLogs,
    addLog,
    addBatchLogs,
    getDetailedLogs,
    getLogsByLevel,
    exportLogs,
    clearLogs,
    searchLogs
  };
};
