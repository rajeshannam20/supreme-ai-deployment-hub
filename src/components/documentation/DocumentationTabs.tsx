
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GettingStartedTab from './GettingStartedTab';
import GuidesTab from './GuidesTab';
import APIReferenceTab from './APIReferenceTab';
import ExamplesTab from './ExamplesTab';
import ProjectStructureTab from './ProjectStructureTab';
import DomainConfigTab from './DomainConfigTab';
import DevonnAIOverviewTab from './DevonnAIOverviewTab';
import { LampDemo } from '@/components/ui/lamp-demo';
import { AnimatedTextDemo } from '@/components/ui/animated-text-demo';
import { GradientTracingDemo } from '@/components/ui/gradient-tracing-demo';
import { BackgroundPathsDemo } from '@/components/ui/background-paths-demo';
import { GlowingEffectDemo } from '@/components/ui/glowing-effect-demo';
import { Badge } from '@/components/ui/badge';

const DocumentationTabs: React.FC = () => {
  return (
    <Tabs defaultValue="devonn-ai" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-4 overflow-x-auto">
        <TabsTrigger value="devonn-ai" className="flex items-center gap-2">
          Devonn.AI
          <Badge variant="outline" className="text-xs font-semibold py-0">New</Badge>
        </TabsTrigger>
        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="api">API Reference</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="structure">Project Structure</TabsTrigger>
        <TabsTrigger value="domain">Domain Setup</TabsTrigger>
      </TabsList>
      
      <TabsContent value="devonn-ai">
        <DevonnAIOverviewTab />
      </TabsContent>
      
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
      
      <Tabs defaultValue="lamp-demo" className="mt-12">
        <h3 className="text-2xl font-bold tracking-tight mb-4">UI Component Demos</h3>
        <TabsList className="mb-4">
          <TabsTrigger value="lamp-demo">Lamp Demo</TabsTrigger>
          <TabsTrigger value="animated-text">Animated Text</TabsTrigger>
          <TabsTrigger value="gradient-tracing">Gradient Tracing</TabsTrigger>
          <TabsTrigger value="background-paths">Background Paths</TabsTrigger>
          <TabsTrigger value="glowing-effect">Glowing Effect</TabsTrigger>
        </TabsList>
        
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
    </Tabs>
  );
};

export default DocumentationTabs;
