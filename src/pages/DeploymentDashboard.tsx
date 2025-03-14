
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import DeploymentLogs from '@/components/DeploymentLogs';
import DeploymentTimeline from '@/components/DeploymentTimeline';
import DeploymentSummary from '@/components/deployment/DeploymentSummary';
import DeploymentStepsOverview from '@/components/deployment/DeploymentStepsOverview';
import DeploymentActions from '@/components/deployment/DeploymentActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DeploymentDashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Deployment Dashboard - DEVONN.AI</title>
      </Helmet>
      <Container>
        <SectionHeading
          subheading="Monitor and control your deployment process"
        >
          Deployment Dashboard
        </SectionHeading>
        
        <div className="mt-8 grid grid-cols-1 gap-6">
          <DeploymentSummary />
          
          <DeploymentActions />
          
          <Tabs defaultValue="steps" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="steps" className="mt-4">
              <DeploymentStepsOverview />
            </TabsContent>
            <TabsContent value="timeline" className="mt-4">
              <DeploymentTimeline />
            </TabsContent>
            <TabsContent value="logs" className="mt-4">
              <DeploymentLogs />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default DeploymentDashboard;
