
// Log filter types
export type LogFilterType = 'all' | 'info' | 'error' | 'warning' | 'success' | 'debug';
export type TimeRangeType = 'all' | 'recent' | 'hour' | 'day' | 'week';

// Log entry interface
export interface Log {
  message: string;
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'success' | 'debug';
  context?: Record<string, unknown>;
}

// Log counts interface for filter badges
export interface LogCounts {
  all: number;
  info: number;
  error: number;
  warning: number;
  success: number;
  debug?: number;
}
