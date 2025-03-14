
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIConnectionsTab from '@/components/api/APIConnectionsTab';
import APIDocumentationTab from '@/components/api/APIDocumentationTab';
import APIPlaygroundTab from '@/components/api/APIPlaygroundTab';
import SavedResponsesTab from '@/components/api/SavedResponsesTab';
import { SavedAPIResponse } from '@/types/api';
import { v4 as uuidv4 } from 'uuid';

const API: React.FC = () => {
  const [savedResponses, setSavedResponses] = useState<SavedAPIResponse[]>([]);

  const saveResponse = (
    apiName: string,
    method: string,
    endpoint: string,
    status: string,
    response: string
  ) => {
    const newSavedResponse: SavedAPIResponse = {
      id: uuidv4(),
      timestamp: new Date(),
      apiName,
      method,
      endpoint,
      status,
      response
    };
    
    setSavedResponses(prev => [newSavedResponse, ...prev]);
  };

  const deleteResponse = (id: string) => {
    setSavedResponses(prev => prev.filter(response => response.id !== id));
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="connections">API Connections</TabsTrigger>
              <TabsTrigger value="documentation">API Documentation</TabsTrigger>
              <TabsTrigger value="playground">API Playground</TabsTrigger>
              <TabsTrigger value="saved">Saved Responses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections" className="mt-6">
              <APIConnectionsTab />
            </TabsContent>
            
            <TabsContent value="documentation" className="mt-6">
              <APIDocumentationTab />
            </TabsContent>
            
            <TabsContent value="playground" className="mt-6">
              <APIPlaygroundTab onSaveResponse={saveResponse} />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              <SavedResponsesTab 
                savedResponses={savedResponses} 
                onDeleteResponse={deleteResponse} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default API;
