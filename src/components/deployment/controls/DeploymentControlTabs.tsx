
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KubeConfigConnect from './KubeConfigConnect';
import DeploymentCommands from './DeploymentCommands';
import EnvFileSample from './EnvFileSample';
import { deploymentCommandsData } from './deploymentData';

const DeploymentControlTabs = () => {
  return (
    <Tabs defaultValue="kubeconfig">
      <TabsList className="w-full">
        <TabsTrigger value="kubeconfig" className="w-full">Kubeconfig</TabsTrigger>
        <TabsTrigger value="commands" className="w-full">Setup Commands</TabsTrigger>
        <TabsTrigger value="env" className="w-full">Environment</TabsTrigger>
      </TabsList>
      
      <TabsContent value="kubeconfig" className="space-y-4">
        <KubeConfigConnect />
      </TabsContent>
      
      <TabsContent value="commands">
        <DeploymentCommands deploymentCommands={deploymentCommandsData} />
      </TabsContent>
      
      <TabsContent value="env">
        <EnvFileSample />
      </TabsContent>
    </Tabs>
  );
};

export default DeploymentControlTabs;
