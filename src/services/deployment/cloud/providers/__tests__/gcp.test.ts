import { 
  getGcpProviderClient, 
  executeGcpCommand, 
  listGkeCluster, 
  describeGkeCluster, 
  listComputeInstances 
} from '../gcp';

describe('GCP Provider', () => {
  describe('getGcpProviderClient', () => {
    it('should return a simulated GCP client with all services', async () => {
      const client = await getGcpProviderClient();
      
      expect(client).toBeDefined();
      expect(client.compute).toBeDefined();
      expect(client.container).toBeDefined();
      expect(client.auth).toBeDefined();
    });

    it('should provide working compute client methods', async () => {
      const client = await getGcpProviderClient();
      
      const instances = await client.compute!.instances.list();
      expect(instances.items).toHaveLength(2);
      expect(instances.items[0]).toHaveProperty('name', 'instance-1');
      expect(instances.items[0]).toHaveProperty('status', 'RUNNING');
    });

    it('should provide working container client methods', async () => {
      const client = await getGcpProviderClient();
      
      const clusters = await client.container!.projects.zones.clusters.list();
      expect(clusters.clusters).toHaveLength(2);
      expect(clusters.clusters[0]).toHaveProperty('name', 'dev-cluster');
      expect(clusters.clusters[0]).toHaveProperty('status', 'RUNNING');
    });
  });

  describe('executeGcpCommand', () => {
    it('should handle cluster describe command', async () => {
      const result = await executeGcpCommand(
        'gcloud container clusters describe test-cluster --zone us-central1-a',
        { provider: 'gcp' }
      );
      
      expect(result.success).toBe(true);
      expect(result.data?.cluster).toBeDefined();
      expect(result.data.cluster.name).toBe('test-cluster');
      expect(result.data.cluster.status).toBe('RUNNING');
    });

    it('should handle cluster list command', async () => {
      const result = await executeGcpCommand(
        'gcloud container clusters list',
        { provider: 'gcp' }
      );
      
      expect(result.success).toBe(true);
      expect(result.data?.clusters).toBeDefined();
      expect(result.data.clusters).toHaveLength(2);
    });

    it('should handle compute instances list command', async () => {
      const result = await executeGcpCommand(
        'gcloud compute instances list --zone us-central1-a',
        { provider: 'gcp' }
      );
      
      expect(result.success).toBe(true);
      expect(result.data?.instances).toBeDefined();
      expect(result.data.instances).toHaveLength(2);
    });

    it('should fall back to simulation for unknown commands', async () => {
      const result = await executeGcpCommand(
        'gcloud some unknown command',
        { provider: 'gcp' }
      );
      
      // Should either succeed or fail based on simulation logic
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('logs');
    });
  });

  describe('listGkeCluster', () => {
    it('should return list of GKE clusters', async () => {
      const clusters = await listGkeCluster();
      
      expect(clusters).toHaveLength(2);
      expect(clusters[0]).toHaveProperty('name', 'dev-cluster');
      expect(clusters[0]).toHaveProperty('location', 'us-central1-a');
      expect(clusters[0]).toHaveProperty('status', 'RUNNING');
    });
  });

  describe('describeGkeCluster', () => {
    it('should return detailed cluster information', async () => {
      const cluster = await describeGkeCluster('test-cluster', 'us-central1-a');
      
      expect(cluster.name).toBe('test-cluster');
      expect(cluster.location).toBe('us-central1-a');
      expect(cluster.status).toBe('RUNNING');
      expect(cluster.nodeConfig).toBeDefined();
      expect(cluster.endpoint).toContain('test-cluster.googleapis.com');
    });
  });

  describe('listComputeInstances', () => {
    it('should return list of compute instances', async () => {
      const instances = await listComputeInstances();
      
      expect(instances).toHaveLength(2);
      expect(instances[0]).toHaveProperty('name', 'instance-1');
      expect(instances[0]).toHaveProperty('status', 'RUNNING');
      expect(instances[1]).toHaveProperty('name', 'instance-2');
      expect(instances[1]).toHaveProperty('status', 'STOPPED');
    });

    it('should respect zone parameter', async () => {
      const instances = await listComputeInstances('us-west1-a');
      
      expect(instances).toHaveLength(2);
      expect(instances[0].zone).toBe('us-west1-a');
    });
  });
});