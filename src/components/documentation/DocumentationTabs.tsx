
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

import GettingStartedTab from './GettingStartedTab';
import GuidesTab from './GuidesTab';
import ProjectStructureTab from './ProjectStructureTab';
import APIReferenceTab from './APIReferenceTab';
import ExamplesTab from './ExamplesTab';

const DocumentationTabs: React.FC = () => {
  return (
    <Tabs defaultValue="getting-started" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="structure">Project Structure</TabsTrigger>
        <TabsTrigger value="reference">API Reference</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
      </TabsList>
      
      <TabsContent value="getting-started">
        <GettingStartedTab />
      </TabsContent>
      
      <TabsContent value="guides">
        <GuidesTab />
      </TabsContent>
      
      <TabsContent value="structure">
        <ProjectStructureTab />
      </TabsContent>
      
      <TabsContent value="reference">
        <APIReferenceTab />
      </TabsContent>
      
      <TabsContent value="examples">
        <ExamplesTab />
      </TabsContent>
    </Tabs>
  );
};

export default DocumentationTabs;
