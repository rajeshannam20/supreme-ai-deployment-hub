
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAPI } from '@/contexts/APIContext';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import APICardList from '@/components/api/APICardList';
import AddAPIDialog from '@/components/api/AddAPIDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewAPIConfig } from '@/types/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API: React.FC = () => {
  const { apiConfigs, addAPIConfig, removeAPIConfig, testConnection } = useAPI();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState<NewAPIConfig>({
    name: '',
    endpoint: '',
    apiKey: '',
    description: ''
  });

  const handleAddAPI = () => {
    addAPIConfig(newConfig);
    setNewConfig({
      name: '',
      endpoint: '',
      apiKey: '',
      description: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleTestConnection = async (name: string) => {
    setTestingConnection(name);
    await testConnection(name);
    setTestingConnection(null);
  };

  return (
    <>
      <Helmet>
        <title>API Management - DEVONN.AI</title>
      </Helmet>
      <Container>
        <SectionHeading
          subheading="Connect DEVONN.AI to external services and APIs to extend its capabilities."
        >
          API Management
        </SectionHeading>
        
        <div className="mt-8">
          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connections">API Connections</TabsTrigger>
              <TabsTrigger value="documentation">API Documentation</TabsTrigger>
              <TabsTrigger value="playground">API Playground</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections" className="mt-6">
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl">API Connections</CardTitle>
                    <CardDescription>Manage your external API connections</CardDescription>
                  </div>
                  <AddAPIDialog
                    isOpen={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    newConfig={newConfig}
                    onConfigChange={setNewConfig}
                    onAddAPI={handleAddAPI}
                  />
                </CardHeader>
                <CardContent>
                  <APICardList
                    apiConfigs={apiConfigs}
                    testingConnection={testingConnection}
                    onRemove={removeAPIConfig}
                    onTest={handleTestConnection}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documentation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>DEVONN.AI API Reference</CardTitle>
                  <CardDescription>Complete documentation for the DEVONN.AI API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Authentication</h3>
                    <p>All API requests require authentication using an API key. Include your API key in the request headers:</p>
                    <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                      <code>{"Authorization: Bearer YOUR_API_KEY"}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Base URL</h3>
                    <p>All API endpoints are relative to the following base URL:</p>
                    <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                      <code>{"https://api.devonn.ai/v1"}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Core Endpoints</h3>
                    
                    <div className="border-b pb-4">
                      <h4 className="font-medium">Generate Code</h4>
                      <p className="text-sm text-muted-foreground mb-2">POST /generate</p>
                      <p className="text-sm mb-2">Generates code based on a natural language prompt.</p>
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Request Body:</h5>
                        <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-xs">
                          <code>{`
{
  "prompt": "Create a React component for a user profile",
  "framework": "react",
  "language": "typescript",
  "includeTests": true,
  "styleFormat": "tailwind"
}
                          `}</code>
                        </pre>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h4 className="font-medium">Enhance Code</h4>
                      <p className="text-sm text-muted-foreground mb-2">POST /enhance</p>
                      <p className="text-sm mb-2">Improves existing code based on specific instructions.</p>
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Request Body:</h5>
                        <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-xs">
                          <code>{`
{
  "code": "// Your existing code here",
  "instruction": "Add form validation",
  "options": {
    "strictTyping": true
  }
}
                          `}</code>
                        </pre>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h4 className="font-medium">Explain Code</h4>
                      <p className="text-sm text-muted-foreground mb-2">POST /explain</p>
                      <p className="text-sm mb-2">Analyzes and explains code functionality.</p>
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Request Body:</h5>
                        <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-xs">
                          <code>{`
{
  "code": "// Code to explain",
  "detailLevel": "intermediate",
  "format": "markdown"
}
                          `}</code>
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Debug Code</h4>
                      <p className="text-sm text-muted-foreground mb-2">POST /debug</p>
                      <p className="text-sm mb-2">Identifies and fixes issues in code.</p>
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Request Body:</h5>
                        <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-xs">
                          <code>{`
{
  "code": "// Code with issues",
  "error": "TypeError: Cannot read property 'map' of undefined",
  "suggestions": true
}
                          `}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="playground" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Playground</CardTitle>
                  <CardDescription>Test API endpoints interactively</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">API Playground coming soon!</p>
                    <p className="text-sm">This feature will allow you to test API calls directly from the browser.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default API;
