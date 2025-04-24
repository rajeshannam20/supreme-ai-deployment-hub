
import * as k8s from '@kubernetes/client-node';
import { CloudProvider, ServiceStatus, CloudProviderCredentials } from '../../types/deployment';
import { classifyCloudError } from './cloud/errorHandling';

// Define missing types
interface ClusterConnectionOptions {
  kubeConfig?: string;
  provider?: CloudProvider;
  attempt?: number;
}

interface ClusterInfo {
  nodes: number;
  pods: number;
  services: number;
  deployments: number;
  status: string;
  provider?: CloudProvider;
  region?: string;
  version?: string;
  uptime?: string;
}

interface ConnectionResult {
  connected: boolean;
  error?: string;
  clusterInfo: ClusterInfo;
  serviceStatuses: ServiceStatus[];
  providerCredentials?: CloudProviderCredentials;
}

// Connection cache to avoid multiple connections to the same cluster
const clusterConnections = new Map<string, {
  kubeConfig: k8s.KubeConfig;
  coreApi: k8s.CoreV1Api;
  appsApi: k8s.AppsV1Api;
}>();

export const connectToKubernetesCluster = async (options: ClusterConnectionOptions): Promise<ConnectionResult> => {
  const { kubeConfig, provider = 'aws', attempt = 1 } = options;
  
  try {
    console.log('Connecting to Kubernetes cluster:', { provider, kubeConfigProvided: !!kubeConfig });
    
    // Create KubeConfig
    const kc = new k8s.KubeConfig();
    
    if (kubeConfig) {
      // Load from provided kubeconfig content
      try {
        kc.loadFromString(kubeConfig);
      } catch (error) {
        console.error('Failed to parse kubeconfig:', error);
        return {
          connected: false,
          error: 'Invalid kubeconfig format. Please check your YAML syntax.',
          clusterInfo: {
            nodes: 0,
            pods: 0,
            services: 0,
            deployments: 0,
            status: 'Disconnected'
          },
          serviceStatuses: []
        };
      }
    } else {
      // Try to load from default location
      try {
        kc.loadFromDefault();
      } catch (error) {
        console.error('Failed to load default kubeconfig:', error);
        return {
          connected: false,
          error: 'No kubeconfig provided and default config not found.',
          clusterInfo: {
            nodes: 0,
            pods: 0,
            services: 0,
            deployments: 0,
            status: 'Disconnected'
          },
          serviceStatuses: []
        };
      }
    }
    
    // Test connection by creating API clients
    const coreApi = kc.makeApiClient(k8s.CoreV1Api);
    const appsApi = kc.makeApiClient(k8s.AppsV1Api);
    
    // Try to get cluster version
    const versionApi = kc.makeApiClient(k8s.VersionApi);
    const version = await versionApi.getCode();
    
    // Generate a unique connection ID
    const connectionId = `${provider}-${Date.now()}`;
    
    // Store the connection for later use
    clusterConnections.set(connectionId, {
      kubeConfig: kc,
      coreApi,
      appsApi
    });
    
    // Load cluster info
    const clusterInfo = await fetchClusterInfo(coreApi, appsApi);
    
    // Fetch service statuses
    const serviceStatuses = await fetchServiceStatuses(coreApi, appsApi);
    
    // Get provider region from current context
    const currentContext = kc.getCurrentContext();
    const contextObject = kc.getContextObject(currentContext);
    const clusterObject = kc.getCluster(contextObject?.cluster || '');
    
    // Extract region from server URL if possible
    let region = 'unknown';
    if (clusterObject?.server) {
      // Try to extract region from URL patterns like:
      // AWS: https://XYZ.gr7.us-west-2.eks.amazonaws.com
      // Azure: https://name-12345-dns.hcp.westus2.azmk8s.io
      // GCP: https://XX.XX.XX.XX.gke.gcp-region-zone.cloud.goog
      const serverUrl = clusterObject.server;
      
      if (serverUrl.includes('eks.amazonaws.com')) {
        const regionMatch = serverUrl.match(/\.([a-z0-9-]+)\.eks\.amazonaws\.com/);
        region = regionMatch?.[1] || 'unknown';
      } else if (serverUrl.includes('azmk8s.io')) {
        const regionMatch = serverUrl.match(/\.([a-z0-9]+)\.azmk8s\.io/);
        region = regionMatch?.[1] || 'unknown';
      } else if (serverUrl.includes('cloud.goog')) {
        const regionMatch = serverUrl.match(/gke\.([a-z0-9-]+)\.cloud\.goog/);
        region = regionMatch?.[1] || 'unknown';
      }
    }

    // Create an expiration date one hour from now
    const expirationDate = new Date(Date.now() + 3600000);

    return {
      connected: true,
      clusterInfo: {
        ...clusterInfo,
        provider,
        region,
        version: version?.body?.gitVersion || 'unknown',
        uptime: 'N/A' // Kubernetes API doesn't provide uptime directly
      },
      serviceStatuses,
      providerCredentials: {
        provider,
        authenticated: true,
        profileName: provider === 'aws' ? 'default' : undefined,
        region,
        expiresAt: expirationDate, // Fixed: Now using Date object instead of string
      }
    };
  } catch (error) {
    console.error('Error connecting to Kubernetes cluster:', error);
    
    // Classify the error for more useful error messages
    const { errorCode, errorMessage } = classifyCloudError(error, provider);
    
    return {
      connected: false,
      error: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
      clusterInfo: {
        nodes: 0,
        pods: 0,
        services: 0,
        deployments: 0,
        status: 'Disconnected'
      },
      serviceStatuses: []
    };
  }
};

/**
 * Fetch cluster information including node, pod, and deployment counts
 */
async function fetchClusterInfo(
  coreApi: k8s.CoreV1Api,
  appsApi: k8s.AppsV1Api
): Promise<ClusterInfo> {
  try {
    // Fetch nodes
    const nodesResponse = await coreApi.listNode();
    const nodes = nodesResponse.body.items || [];
    
    // Fetch pods in all namespaces
    const podsResponse = await coreApi.listPodForAllNamespaces();
    const pods = podsResponse.body.items || [];
    
    // Fetch services in all namespaces
    const servicesResponse = await coreApi.listServiceForAllNamespaces();
    const services = servicesResponse.body.items || [];
    
    // Fetch deployments in all namespaces
    const deploymentsResponse = await appsApi.listDeploymentForAllNamespaces();
    const deployments = deploymentsResponse.body.items || [];
    
    // Determine cluster health status
    let status = 'Healthy';
    
    // Check if any nodes are not ready
    const unhealthyNodes = nodes.filter(node => 
      !node.status?.conditions?.some(condition => 
        condition.type === 'Ready' && condition.status === 'True'
      )
    );
    
    if (unhealthyNodes.length > 0) {
      status = 'Degraded';
    }
    
    return {
      nodes: nodes.length,
      pods: pods.length,
      services: services.length,
      deployments: deployments.length,
      status
    };
  } catch (error) {
    console.error('Error fetching cluster info:', error);
    // Return basic info on error
    return {
      nodes: 0,
      pods: 0,
      services: 0,
      deployments: 0,
      status: 'Unknown'
    };
  }
}

/**
 * Fetch service statuses from the cluster
 */
async function fetchServiceStatuses(
  coreApi: k8s.CoreV1Api,
  appsApi: k8s.AppsV1Api
): Promise<ServiceStatus[]> {
  try {
    // Get deployments
    const deploymentsResponse = await appsApi.listDeploymentForAllNamespaces();
    const deployments = deploymentsResponse.body.items || [];
    
    // Get services
    const servicesResponse = await coreApi.listServiceForAllNamespaces();
    const services = servicesResponse.body.items || [];
    
    // Get pods
    const podsResponse = await coreApi.listPodForAllNamespaces();
    const pods = podsResponse.body.items || [];
    
    // Map services to our ServiceStatus model
    return services.slice(0, 10).map(service => {
      // Find related deployment
      const relatedDeployment = deployments.find(deployment => 
        deployment.metadata?.name === service.metadata?.name
      );
      
      // Find pods for this service
      const servicePods = pods.filter(pod => {
        // Match pods by service selectors
        if (!service.spec?.selector) return false;
        
        for (const [key, value] of Object.entries(service.spec.selector)) {
          if (pod.metadata?.labels?.[key] !== value) {
            return false;
          }
        }
        return true;
      });
      
      // Count ready vs total pods
      let readyPods = 0;
      servicePods.forEach(pod => {
        if (pod.status?.containerStatuses?.every(container => container.ready)) {
          readyPods++;
        }
      });
      
      // Calculate CPU and memory usage (mock values for now)
      // In a real implementation, you would use the metrics API
      const cpuPercentage = Math.floor(Math.random() * 100);
      const memoryUsage = `${Math.floor(Math.random() * 512)}Mi`;
      
      // Service status
      const status = servicePods.length > 0 && readyPods === servicePods.length 
        ? 'Running' 
        : readyPods > 0 
          ? 'Degraded' 
          : 'Pending';
      
      // Service endpoints
      const endpoints = service.spec?.type === 'LoadBalancer' && service.status?.loadBalancer?.ingress
        ? service.status.loadBalancer.ingress.map(ingress => ingress.hostname || ingress.ip || '')
        : servicePods.map(pod => `${pod.status?.podIP || ''}:${service.spec?.ports?.[0]?.port || ''}`);
      
      return {
        name: service.metadata?.name || 'unknown',
        namespace: service.metadata?.namespace || 'default',
        status,
        pods: `${readyPods}/${servicePods.length}`,
        cpu: `${cpuPercentage}%`,
        memory: memoryUsage,
        type: service.spec?.type || 'ClusterIP',
        endpoints: endpoints.filter(Boolean),
        age: getAge(service.metadata?.creationTimestamp || '') // Fixed: Now passing string as expected
      };
    });
  } catch (error) {
    console.error('Error fetching service statuses:', error);
    return [];
  }
}

/**
 * Calculate age from creation timestamp
 */
function getAge(timestamp: string): string {
  if (!timestamp) return 'unknown';
  
  const created = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d${hours}h`;
  }
  return `${hours}h`;
}

export const getClusterDetails = async (kubeConfig?: string) => {
  // TODO: Implement actual Kubernetes API call using the connection logic above
  const connection = await connectToKubernetesCluster({ kubeConfig });
  return connection.clusterInfo;
};

export const getServiceStatuses = async (kubeConfig?: string, namespace?: string) => {
  // TODO: Implement actual Kubernetes API call using the connection logic above
  const connection = await connectToKubernetesCluster({ kubeConfig });
  return connection.serviceStatuses;
};

export const deployToCluster = async (kubeConfig?: string, manifests?: string[]) => {
  if (!kubeConfig || !manifests || manifests.length === 0) {
    return {
      success: false,
      message: 'Missing kubeconfig or manifests'
    };
  }
  
  try {
    // Create KubeConfig
    const kc = new k8s.KubeConfig();
    kc.loadFromString(kubeConfig);
    
    // Create client for applying manifests
    const client = k8s.KubernetesObjectApi.makeApiClient(kc);
    
    const results = [];
    
    // Apply each manifest
    for (const manifestStr of manifests) {
      try {
        // Parse manifest
        const manifest = JSON.parse(manifestStr);
        
        // Apply manifest
        const { body } = await client.create(manifest);
        
        results.push({
          success: true,
          resource: `${manifest.kind}/${manifest.metadata?.name}`,
          details: body
        });
      } catch (error) {
        results.push({
          success: false,
          resource: 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return {
      success: results.every(r => r.success),
      results,
      message: results.every(r => r.success) 
        ? 'All resources deployed successfully' 
        : 'Some resources failed to deploy'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred during deployment'
    };
  }
};
