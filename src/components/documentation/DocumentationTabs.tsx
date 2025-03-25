
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
import { GradientTracingDemo } from '@/components/ui/gradient-tracing-demo';
import { BackgroundPathsDemo } from '@/components/ui/background-paths-demo';
import { GlowingEffectDemo } from '@/components/ui/glowing-effect-demo';

const DocumentationTabs: React.FC = () => {
  return (
    <Tabs defaultValue="getting-started" className="w-full">
      <TabsList className="grid grid-cols-11 mb-4">
        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="api">API Reference</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="structure">Project Structure</TabsTrigger>
        <TabsTrigger value="domain">Domain Setup</TabsTrigger>
        <TabsTrigger value="lamp-demo">Lamp Demo</TabsTrigger>
        <TabsTrigger value="animated-text">Animated Text</TabsTrigger>
        <TabsTrigger value="gradient-tracing">Gradient Tracing</TabsTrigger>
        <TabsTrigger value="background-paths">Background Paths</TabsTrigger>
        <TabsTrigger value="glowing-effect">Glowing Effect</TabsTrigger>
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
      
      <TabsContent value="gradient-tracing">
        <div className="mt-6 bg-slate-950 p-8 rounded-lg">
          <GradientTracingDemo />
        </div>
      </TabsContent>
      
      <TabsContent value="background-paths">
        <div className="mt-6">
          <BackgroundPathsDemo />
        </div>
      </TabsContent>
      
      <TabsContent value="glowing-effect">
        <div className="mt-6 bg-slate-950 p-8 rounded-lg">
          <GlowingEffectDemo />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentationTabs;
