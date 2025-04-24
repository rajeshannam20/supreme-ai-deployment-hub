
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
import { Shield, Book, AlertTriangle, BarChart } from 'lucide-react';

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
              subheading="Deploy, monitor, and manage your Supreme AI Deployment Hub."
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
                    <TabsTrigger value="metrics">
                      <BarChart className="h-4 w-4 mr-1" />
                      Metrics
                    </TabsTrigger>
                    <TabsTrigger value="security">
                      <Shield className="h-4 w-4 mr-1" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="steps">
                    <DeploymentStepsOverview />
                  </TabsContent>
                  
                  <TabsContent value="logs">
                    <DeploymentLogs />
                  </TabsContent>
                  
                  <TabsContent value="metrics">
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <BarChart className="h-5 w-5 mr-2" />
                        Deployment Metrics
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Deployment metrics will appear here after you run deployments. Monitor performance trends, resource usage, and anomaly detection here.</p>
                      </div>
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center text-yellow-700">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <p>No metrics data available yet. Complete a deployment to populate metrics.</p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security Status
                      </h3>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>View security scans, compliance status, and vulnerability reports for your deployments.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Security Scans</h4>
                          <p className="text-sm">No recent security scans. Click "Run Security Scan" button to check for vulnerabilities.</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Compliance Status</h4>
                          <p className="text-sm">Compliance checks not yet configured. Set up compliance monitoring in settings.</p>
                        </div>
                      </div>
                    </Card>
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
                  <div className="flex items-center mb-2">
                    <Book className="h-5 w-5 mr-2" />
                    <h4 className="font-medium">Documentation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Detailed deployment guides and reference</p>
                </a>
                <a 
                  href="#" 
                  className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <h4 className="font-medium">Troubleshooting</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Common issues and solutions</p>
                </a>
                <a 
                  href="#" 
                  className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2" />
                    <h4 className="font-medium">Security Resources</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Security best practices and standards</p>
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
