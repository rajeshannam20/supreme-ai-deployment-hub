
// Cloud provider types
export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'custom';

export interface CloudProviderConfig {
  // Common properties
  region?: string;
  
  // AWS specific
  profile?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  
  // Azure specific
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  subscriptionId?: string;
  
  // GCP specific
  projectId?: string;
  keyFilePath?: string;
  credentials?: any;
}

export interface CloudCommandResult {
  success: boolean;
  logs?: string[];
  data?: any;
  output?: string;
  error?: string;
  errorCode?: string;
  errorDetails?: Record<string, any>;
}

export interface ExecuteCommandOptions {
  provider?: CloudProvider;
  region?: string;
  command?: string;
  dryRun?: boolean;
  timeout?: number;
  environment?: string; // Added this field to fix the error
}
