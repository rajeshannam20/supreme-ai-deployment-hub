
import React from 'react';
import Container from "@/components/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionHeading from '@/components/SectionHeading';
import DeploymentTimeline from '@/components/DeploymentTimeline';
import DeploymentLogs from '@/components/DeploymentLogs';
import DeploymentStepsOverview from '@/components/deployment/DeploymentStepsOverview';
import DeploymentActions from '@/components/deployment/DeploymentActions';
import DeploymentSummary from '@/components/deployment/DeploymentSummary';
import { DeploymentProvider } from '@/contexts/DeploymentContext';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const DeploymentPage: React.FC = () => {
  return (
    <DeploymentProvider>
      <div className="min-h-screen">
        <Container maxWidth="2xl" className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              tag="Deployment"
              subheading="Deploy, monitor, and manage your DEVONN.AI Framework."
            >
              Deployment Dashboard
            </SectionHeading>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Summary & Actions */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <DeploymentSummary />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DeploymentActions />
              </motion.div>
            </div>
            
            {/* Right Column - Timeline & Detailed View */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <DeploymentTimeline />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Tabs defaultValue="steps">
                  <TabsList className="mb-4">
                    <TabsTrigger value="steps">Steps Overview</TabsTrigger>
                    <TabsTrigger value="logs">Deployment Logs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="steps">
                    <DeploymentStepsOverview />
                  </TabsContent>
                  
                  <TabsContent value="logs">
                    <DeploymentLogs />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Deployment Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="#" 
                  className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-sm text-muted-foreground">Detailed deployment guides and reference</p>
                </a>
                <a 
                  href="#" 
                  className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <h4 className="font-medium">Troubleshooting</h4>
                  <p className="text-sm text-muted-foreground">Common issues and solutions</p>
                </a>
                <a 
                  href="#" 
                  className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <h4 className="font-medium">Community Forums</h4>
                  <p className="text-sm text-muted-foreground">Get help from the community</p>
                </a>
              </div>
            </Card>
          </motion.div>
        </Container>
      </div>
    </DeploymentProvider>
  );
};

export default DeploymentPage;
