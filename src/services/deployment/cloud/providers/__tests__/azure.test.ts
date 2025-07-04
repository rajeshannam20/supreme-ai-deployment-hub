import { 
  getAzureProviderClient, 
  executeAzureCommand, 
  listAksClusters, 
  describeAksCluster, 
  listVirtualMachines,
  listResourceGroups 
} from '../azure';

describe('Azure Provider', () => {
  describe('getAzureProviderClient', () => {
    it('should return a simulated Azure client with all services', async () => {
      const client = await getAzureProviderClient();
      
      expect(client).toBeDefined();
      expect(client.resourceManagement).toBeDefined();
      expect(client.containerService).toBeDefined();
      expect(client.compute).toBeDefined();
      expect(client.auth).toBeDefined();
    });

    it('should provide working resource management client methods', async () => {
      const client = await getAzureProviderClient();
      
      const resourceGroups = await client.resourceManagement!.resourceGroups.list();
      expect(resourceGroups.value).toHaveLength(2);
      expect(resourceGroups.value[0]).toHaveProperty('name', 'rg-dev');
      expect(resourceGroups.value[0]).toHaveProperty('location', 'eastus');
    });

    it('should provide working container service client methods', async () => {
      const client = await getAzureProviderClient();
      
      const clusters = await client.containerService!.managedClusters.list();
      expect(clusters.value).toHaveLength(2);
      expect(clusters.value[0]).toHaveProperty('name', 'aks-dev');
      expect(clusters.value[0].properties).toHaveProperty('kubernetesVersion', '1.25.6');
    });

    it('should provide working compute client methods', async () => {
      const client = await getAzureProviderClient();
      
      const vms = await client.compute!.virtualMachines.list();
      expect(vms.value).toHaveLength(2);
      expect(vms.value[0]).toHaveProperty('name', 'vm-web-01');
      expect(vms.value[0].properties).toHaveProperty('provisioningState', 'Succeeded');
    });
  });

  describe('executeAzureCommand', () => {
    it('should handle AKS cluster show command', async () => {
      const result = await executeAzureCommand(
        'az aks show --name test-cluster --resource-group test-rg',
        { provider: 'azure' }
      );
      
      expect(result.success).toBe(true);
      expect(result.data?.cluster).toBeDefined();
      expect(result.data.cluster.name).toBe('test-cluster');
      expect(result.data.cluster.resourceGroup).toBe('test-rg');
      expect(result.data.cluster.kubernetesVersion).toBe('1.25.6');
    });

    it('should handle AKS cluster list command', async () => {
      const result = await executeAzureCommand(
        'az aks list',
        { provider: 'azure' }
      );
      
      expect(result.success).toBe(true);
      expect(result.data?.clusters).toBeDefined();
      expect(result.data.clusters).toHaveLength(2);
    });

    it('should handle VM list command', async () => {
      const result = await executeAzureCommand(
        'az vm list --resource-group test-rg',
        { provider: 'azure' }
      );
      
      expect(result.success).toBe(true);
      expect(result.data?.virtualMachines).toBeDefined();
      expect(result.data.virtualMachines).toHaveLength(2);
    });

    it('should handle resource group list command', async () => {
      const result = await executeAzureCommand(
        'az group list',
        { provider: 'azure' }
      );
      
      expect(result.success).toBe(true);
      expect(result.data?.resourceGroups).toBeDefined();
      expect(result.data.resourceGroups).toHaveLength(2);
    });

    it('should fall back to simulation for unknown commands', async () => {
      const result = await executeAzureCommand(
        'az some unknown command',
        { provider: 'azure' }
      );
      
      // Should either succeed or fail based on simulation logic
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('logs');
    });
  });

  describe('listAksClusters', () => {
    it('should return list of AKS clusters', async () => {
      const clusters = await listAksClusters();
      
      expect(clusters).toHaveLength(2);
      expect(clusters[0]).toHaveProperty('name', 'aks-dev');
      expect(clusters[0]).toHaveProperty('resourceGroup', 'rg-dev');
      expect(clusters[0]).toHaveProperty('location', 'eastus');
      expect(clusters[0]).toHaveProperty('kubernetesVersion', '1.25.6');
    });
  });

  describe('describeAksCluster', () => {
    it('should return detailed cluster information', async () => {
      const cluster = await describeAksCluster('test-rg', 'test-cluster');
      
      expect(cluster.name).toBe('test-cluster');
      expect(cluster.resourceGroup).toBe('test-rg');
      expect(cluster.location).toBe('eastus');
      expect(cluster.kubernetesVersion).toBe('1.25.6');
      expect(cluster.fqdn).toContain('test-cluster-dns');
      expect(cluster.agentPoolProfiles).toHaveLength(1);
      expect(cluster.networkProfile).toBeDefined();
    });
  });

  describe('listVirtualMachines', () => {
    it('should return list of virtual machines', async () => {
      const vms = await listVirtualMachines();
      
      expect(vms).toHaveLength(2);
      expect(vms[0]).toHaveProperty('name', 'vm-web-01');
      expect(vms[0]).toHaveProperty('vmSize', 'Standard_DS1_v2');
      expect(vms[0]).toHaveProperty('provisioningState', 'Succeeded');
      expect(vms[1]).toHaveProperty('name', 'vm-api-01');
      expect(vms[1]).toHaveProperty('vmSize', 'Standard_DS2_v2');
    });

    it('should respect resource group parameter', async () => {
      const vms = await listVirtualMachines('custom-rg');
      
      expect(vms).toHaveLength(2);
      expect(vms[0].resourceGroup).toBe('custom-rg');
      expect(vms[1].resourceGroup).toBe('custom-rg');
    });
  });

  describe('listResourceGroups', () => {
    it('should return list of resource groups', async () => {
      const resourceGroups = await listResourceGroups();
      
      expect(resourceGroups).toHaveLength(2);
      expect(resourceGroups[0]).toHaveProperty('name', 'rg-dev');
      expect(resourceGroups[0]).toHaveProperty('location', 'eastus');
      expect(resourceGroups[0]).toHaveProperty('provisioningState', 'Succeeded');
      expect(resourceGroups[0].tags).toHaveProperty('environment', 'development');
      expect(resourceGroups[1]).toHaveProperty('name', 'rg-prod');
      expect(resourceGroups[1]).toHaveProperty('location', 'westus2');
    });
  });
});