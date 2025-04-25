
export interface Log {
  message: string;
  timestamp: string;
  type?: 'info' | 'error' | 'warning' | 'success' | 'debug';
}

export type LogFilterType = 'all' | 'info' | 'warning' | 'error' | 'success';
export type TimeRangeType = 'all' | 'recent' | 'hour' | 'day' | 'week';

export interface LogCounts {
  all: number;
  info: number;
  warning: number;
  error: number;
  success: number;
}
