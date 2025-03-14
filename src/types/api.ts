
export interface APIConfig {
  name: string;
  endpoint: string;
  apiKey?: string;
  description: string;
  isConnected: boolean;
  lastConnected?: Date;
}

export type NewAPIConfig = Omit<APIConfig, 'isConnected' | 'lastConnected'>;
