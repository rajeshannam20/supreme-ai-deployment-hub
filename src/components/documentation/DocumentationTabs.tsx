
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GettingStartedTab from './GettingStartedTab';
import GuidesTab from './GuidesTab';
import APIReferenceTab from './APIReferenceTab';
import ExamplesTab from './ExamplesTab';
import ProjectStructureTab from './ProjectStructureTab';
import DomainConfigTab from './DomainConfigTab';

const DocumentationTabs: React.FC = () => {
  return (
    <Tabs defaultValue="getting-started" className="w-full">
      <TabsList className="grid grid-cols-6 mb-4">
        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="api">API Reference</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="structure">Project Structure</TabsTrigger>
        <TabsTrigger value="domain">Domain Setup</TabsTrigger>
      </TabsList>
      
      <TabsContent value="getting-started">
        <GettingStartedTab />
      </TabsContent>
      
      <TabsContent value="guides">
        <GuidesTab />
      </TabsContent>
      
      <TabsContent value="api">
        <APIReferenceTab />
      </TabsContent>
      
      <TabsContent value="examples">
        <ExamplesTab />
      </TabsContent>
      
      <TabsContent value="structure">
        <ProjectStructureTab />
      </TabsContent>
      
      <TabsContent value="domain">
        <DomainConfigTab />
      </TabsContent>
    </Tabs>
  );
};

export default DocumentationTabs;
