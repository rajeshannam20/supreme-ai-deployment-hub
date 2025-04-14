
import { CloudProvider } from '../../../types/deployment';

export interface CloudCommandResult {
  success: boolean;
  logs: string[];
  error?: string;
  progress?: number;
  errorCode?: string;
  errorDetails?: Record<string, any>;
  operationId?: string;
}

export interface ExecuteCommandOptions {
  command: string;
  provider: CloudProvider;
  timeout?: number;
  onProgress?: (progress: number) => void;
  retryCount?: number;
  environment?: 'development' | 'staging' | 'production';
}
