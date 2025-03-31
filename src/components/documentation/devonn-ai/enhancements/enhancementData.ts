
import React from 'react';
import { BrainCircuit, Network, Zap, Workflow, CloudLightning, Rocket } from 'lucide-react';
import { Enhancement } from './EnhancementCard';

export const enhancementData: Enhancement[] = [
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
