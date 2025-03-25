
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GettingStartedTab from './GettingStartedTab';
import GuidesTab from './GuidesTab';
import APIReferenceTab from './APIReferenceTab';
import ExamplesTab from './ExamplesTab';
import ProjectStructureTab from './ProjectStructureTab';
import DomainConfigTab from './DomainConfigTab';
import { LampDemo } from '@/components/ui/lamp-demo';
import { AnimatedTextDemo } from '@/components/ui/animated-text-demo';

const DocumentationTabs: React.FC = () => {
  return (
    <Tabs defaultValue="getting-started" className="w-full">
      <TabsList className="grid grid-cols-8 mb-4">
        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="api">API Reference</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="structure">Project Structure</TabsTrigger>
        <TabsTrigger value="domain">Domain Setup</TabsTrigger>
        <TabsTrigger value="lamp-demo">Lamp Demo</TabsTrigger>
        <TabsTrigger value="animated-text">Animated Text</TabsTrigger>
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
      
      <TabsContent value="lamp-demo">
        <div className="mt-6">
          <LampDemo />
        </div>
      </TabsContent>

      <TabsContent value="animated-text">
        <div className="mt-6 bg-slate-950 p-8 rounded-lg">
          <AnimatedTextDemo />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentationTabs;
