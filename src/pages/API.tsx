
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIConnectionsTab from '@/components/api/APIConnectionsTab';
import APIDocumentationTab from '@/components/api/APIDocumentationTab';
import APIPlaygroundTab from '@/components/api/APIPlaygroundTab';

const API: React.FC = () => {
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
              <APIConnectionsTab />
            </TabsContent>
            
            <TabsContent value="documentation" className="mt-6">
              <APIDocumentationTab />
            </TabsContent>
            
            <TabsContent value="playground" className="mt-6">
              <APIPlaygroundTab />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default API;
