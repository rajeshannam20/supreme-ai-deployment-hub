
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { 
  EKSClient, 
  DescribeClusterCommand,
  ListClustersCommand
} from '@aws-sdk/client-eks';
import type { CloudCommandResult, ExecuteCommandOptions } from '../types';
import { classifyCloudError } from '../errorHandling';
import { simulateCommandExecution } from '../simulator';

// AWS Client implementation
export const getAwsProviderClient = async (): Promise<{ 
  sts: STSClient,
  eks?: EKSClient
}> => {
  try {
    // Initialize STS client
    const stsClient = new STSClient();
    // Test authentication
    await stsClient.send(new GetCallerIdentityCommand({}));
    
    // Initialize EKS client if STS authentication succeeded
    const eksClient = new EKSClient();
    
    return {
      sts: stsClient,
      eks: eksClient
    };
  } catch (error) {
    console.error("Failed to initialize AWS client:", error);
    throw new Error("AWS authentication failed. Please check your credentials.");
  }
};

// Execute AWS commands
export const executeAwsCommand = async (
  command: string, 
  options: ExecuteCommandOptions
): Promise<CloudCommandResult> => {
  try {
    const client = await getAwsProviderClient();
    
    if (command.includes('describe-cluster')) {
      // Extract cluster name from command
      const clusterName = command.match(/--name\s+([^\s]+)/)?.[1];
      if (!clusterName) {
        return {
          success: false,
          logs: ['Failed to parse cluster name from command'],
          error: 'Invalid command format'
        };
      }
      
      console.log(`Executing real EKS describe-cluster command for ${clusterName}`);
      
      try {
        const eksClient = client.eks;
        if (!eksClient) {
          return {
            success: false,
            logs: ['EKS client not initialized'],
            error: 'AWS EKS client not available'
          };
        }
        
        const command = new DescribeClusterCommand({
          name: clusterName
        });
        
        const response = await eksClient.send(command);
        
        return {
          success: true,
          logs: [`Successfully retrieved information for cluster ${clusterName}`],
          data: response.cluster
        };
      } catch (error) {
        console.error("EKS describe-cluster error:", error);
        const { errorCode, errorMessage } = classifyCloudError(error, 'aws');
        
        return {
          success: false,
          logs: [`[ERROR] ${errorMessage}`],
          error: errorMessage,
          errorCode
        };
      }
    }
    
    else if (command.includes('list-clusters')) {
      console.log('Executing real EKS list-clusters command');
      
      try {
        const eksClient = client.eks;
        if (!eksClient) {
          return {
            success: false,
            logs: ['EKS client not initialized'],
            error: 'AWS EKS client not available'
          };
        }
        
        const command = new ListClustersCommand({});
        const response = await eksClient.send(command);
        
        return {
          success: true,
          logs: [`Successfully listed clusters. Found ${response.clusters?.length || 0} clusters.`],
          data: response
        };
      } catch (error) {
        console.error("EKS list-clusters error:", error);
        const { errorCode, errorMessage } = classifyCloudError(error, 'aws');
        
        return {
          success: false,
          logs: [`[ERROR] ${errorMessage}`],
          error: errorMessage,
          errorCode
        };
      }
    }
    
    // For other commands fall back to simulation
    console.log(`Command not implemented yet: ${command}. Using simulation.`);
    return simulateCommandExecution(options);
  } catch (error) {
    const { errorCode, errorMessage, errorDetails } = classifyCloudError(error, 'aws');
    return {
      success: false,
      logs: [`[ERROR] ${errorMessage}`],
      error: errorMessage,
      errorCode,
      errorDetails
    };
  }
};

// Helper functions for specific AWS operations
export const listEksClusters = async (): Promise<string[]> => {
  try {
    const client = await getAwsProviderClient();
    
    if (!client.eks) {
      throw new Error('EKS client not initialized');
    }
    
    const command = new ListClustersCommand({});
    const response = await client.eks.send(command);
    
    return response.clusters || [];
  } catch (error) {
    console.error("Failed to list EKS clusters:", error);
    throw error;
  }
};

export const describeEksCluster = async (clusterName: string): Promise<any> => {
  try {
    const client = await getAwsProviderClient();
    
    if (!client.eks) {
      throw new Error('EKS client not initialized');
    }
    
    const command = new DescribeClusterCommand({
      name: clusterName
    });
    
    const response = await client.eks.send(command);
    return response.cluster;
  } catch (error) {
    console.error(`Failed to describe EKS cluster ${clusterName}:`, error);
    throw error;
  }
};
