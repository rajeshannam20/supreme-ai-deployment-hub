
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Shield, Server, LineChart } from 'lucide-react';

import GettingStartedTab from './GettingStartedTab';
import GuidesTab from './GuidesTab';
import ProjectStructureTab from './ProjectStructureTab';
import APIReferenceTab from './APIReferenceTab';
import ExamplesTab from './ExamplesTab';

const DocumentationTabs: React.FC = () => {
  const navigate = useNavigate();
  
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
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Key Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate('/documentation/istio-service-mesh')}>
              <div className="flex items-start mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-4">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Istio Service Mesh</h3>
                  <p className="text-sm text-muted-foreground">Advanced traffic management with mTLS encryption and authorization policies</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-between mt-2">
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate('/documentation/kong-api-gateway')}>
              <div className="flex items-start mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-4">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Kong API Gateway</h3>
                  <p className="text-sm text-muted-foreground">Secure and efficient API management with rate limiting and authentication plugins</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-between mt-2">
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate('/documentation/observability-stack')}>
              <div className="flex items-start mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-4">
                  <LineChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Observability Stack</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive monitoring with Prometheus, Grafana, and Jaeger</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-between mt-2">
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
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
