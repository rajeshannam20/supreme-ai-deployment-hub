
// Define the Log interface if it doesn't exist
export interface Log {
  message: string;
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'success' | 'debug';
}

export type LogFilterType = 'all' | 'info' | 'error' | 'warning' | 'success' | 'debug';
export type TimeRangeType = 'all' | 'recent' | 'hour' | 'day' | 'week';

export interface LogCounts {
  all: number;
  info: number;
  error: number;
  warning: number;
  success: number;
  debug?: number;
}
