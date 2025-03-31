
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, BrainCircuit, Network, Zap, CloudLightning, Workflow } from 'lucide-react';

const OptionalEnhancementsSection: React.FC = () => {
  const enhancements = [
    {
      title: "Neural Network Extension",
      description: "Expand capabilities with advanced neural network architectures for complex reasoning tasks.",
      icon: <BrainCircuit className="w-5 h-5 text-primary" />,
      tag: "Advanced AI",
      status: "Recommended"
    },
    {
      title: "Vector Database Integration",
      description: "Connect to vector databases for semantic search and similarity matching across data sources.",
      icon: <Network className="w-5 h-5 text-primary" />,
      tag: "Data Storage",
      status: "Optional"
    },
    {
      title: "Edge Deployment Package",
      description: "Optimize for edge devices with compressed models and efficient runtime environments.",
      icon: <Zap className="w-5 h-5 text-primary" />,
      tag: "Deployment",
      status: "Recommended"
    },
    {
      title: "AutoML Pipeline",
      description: "Implement automated model training and hyperparameter optimization for custom use cases.",
      icon: <Workflow className="w-5 h-5 text-primary" />,
      tag: "Workflow",
      status: "Optional"
    },
    {
      title: "Cloud Provider Connectors",
      description: "Seamlessly deploy to AWS, Azure, GCP, and other major cloud platforms with pre-built templates.",
      icon: <CloudLightning className="w-5 h-5 text-primary" />,
      tag: "Infrastructure",
      status: "Recommended"
    },
    {
      title: "Accelerated Compute Support",
      description: "Utilize GPUs, TPUs, and other specialized hardware for faster inference and training.",
      icon: <Rocket className="w-5 h-5 text-primary" />,
      tag: "Performance",
      status: "Optional"
    },
  ];

  return (
    <section>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Optional Enhancements</h3>
        <p className="text-muted-foreground">
          Extend Devonn.AI's capabilities with these powerful add-on modules and integrations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enhancements.map((enhancement, index) => (
          <Card key={index} className="border border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-md bg-primary/10 mb-2">
                  {enhancement.icon}
                </div>
                <Badge variant={enhancement.status === "Recommended" ? "default" : "outline"}>
                  {enhancement.status}
                </Badge>
              </div>
              <CardTitle className="text-base">{enhancement.title}</CardTitle>
              <Badge variant="outline" className="w-fit mt-1">{enhancement.tag}</Badge>
            </CardHeader>
            <CardContent>
              <CardDescription>{enhancement.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default OptionalEnhancementsSection;
