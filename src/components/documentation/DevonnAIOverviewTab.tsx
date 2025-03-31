
import React from 'react';
import { 
  Brain, 
  Cpu, 
  Server, 
  GitBranch, 
  Rocket, 
  Bot, 
  Shield, 
  BarChart, 
  Layers, 
  Workflow,
  Gauge,
  Code,
  Terminal,
  Lock,
  Globe,
  AlertCircle,
  Download,
  ExternalLink,
  Download as DownloadIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DevonnAIOverviewTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Devonn.AI Project Overview
            </h2>
            <p className="text-muted-foreground max-w-3xl">
              An intelligent, modular AI agent factory that builds other AIs, with all the components you need to launch, run, and expand.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-2 border-primary/50 self-start md:self-auto">
              Production Ready
            </Badge>
            <Badge variant="default" className="px-4 py-2 text-sm font-medium self-start md:self-auto">
              AI-Powered
            </Badge>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-lg border border-border p-1 my-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 animate-pulse [animation-duration:5s]" />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-6 flex flex-col gap-2 items-center justify-center text-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">AI-Powered</h3>
              <p className="text-muted-foreground text-sm">LangChain agents with multi-agent orchestration</p>
            </div>
            <div className="p-6 flex flex-col gap-2 items-center justify-center text-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Full-Stack</h3>
              <p className="text-muted-foreground text-sm">FastAPI, PostgreSQL, React, Zustand</p>
            </div>
            <div className="p-6 flex flex-col gap-2 items-center justify-center text-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Production-Ready</h3>
              <p className="text-muted-foreground text-sm">Docker, CI/CD, HTTPS, JWT Auth</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-border overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Core Capabilities</CardTitle>
                <CardDescription>Everything you need to build and deploy AI agents</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                {capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <capability.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{capability.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-border overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Project Components</CardTitle>
                <CardDescription>Modular architecture for scalability</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {components.map((component, index) => (
                  <div key={index}>
                    <h4 className="font-semibold flex items-center gap-2">
                      <component.icon className="h-4 w-4 text-primary" />
                      {component.title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-1 text-sm">
                      {component.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="py-6 rounded-lg border bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 my-8">
        <div className="px-6">
          <h3 className="text-xl font-bold mb-2">Download Everything</h3>
          <p className="text-muted-foreground mb-4">Get all the components you need to build your AI agent factory</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6">
          <Card className="bg-background/80 backdrop-blur hover:bg-background transition-colors">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Backend (FastAPI)</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur hover:bg-background transition-colors">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Frontend (React)</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur hover:bg-background transition-colors">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Environment + Docker</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Files
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      <Separator className="my-8" />
      
      <section>
        <h3 className="text-2xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">What You Can Do Next</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nextSteps.map((step, index) => (
            <Card key={index} className="overflow-hidden border-border hover:shadow-md transition-shadow duration-300">
              <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{step.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full mt-2 group">
                  Learn More
                  <ExternalLink className="ml-2 h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      <Separator className="my-8" />
      
      <section>
        <h3 className="text-2xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Optional Enhancements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {optionalEnhancements.map((enhancement, index) => (
            <div key={index} className="flex gap-4 p-5 border rounded-lg hover:border-primary/40 transition-colors duration-300 hover:bg-blue-50/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <enhancement.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-2">{enhancement.title}</p>
                <p className="text-sm text-muted-foreground">{enhancement.description}</p>
                <Button variant="link" className="mt-2 h-auto p-0 text-primary/80 hover:text-primary" size="sm">
                  Request Example
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-block p-8 rounded-lg border border-border bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5">
            <p className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              You've built a self-aware agent creation system
            </p>
            <p className="text-muted-foreground mb-4">The factory is online. Ready for deployment.</p>
            <Button className="mt-4">
              <Rocket className="mr-2 h-4 w-4" />
              Launch Your First Agent
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const capabilities = [
  { 
    icon: Brain, 
    text: "Create and manage AI agents (LangChain-powered)" 
  },
  { 
    icon: BarChart, 
    text: "Real-time tracking of agent usage (via Boost.Space)" 
  },
  { 
    icon: AlertCircle, 
    text: "Slack alert integration for errors and lifecycle events" 
  },
  { 
    icon: Lock, 
    text: "FastAPI backend with JWT auth, PostgreSQL, Alembic" 
  },
  { 
    icon: Code, 
    text: "React frontend with TailwindCSS, Zustand, and Agent UI" 
  },
  { 
    icon: Terminal, 
    text: "Docker + GitHub CI/CD, NGINX + HTTPS setup" 
  },
  { 
    icon: Workflow, 
    text: "Multi-agent orchestration-ready" 
  }
];

const components = [
  {
    icon: Server,
    title: "Backend",
    items: [
      "main.py, routes/, schemas/, services/",
      "API endpoints: /auth/, /secure/, /agents/new, /tasks/, /metrics/",
      "LangChain agent factory module",
      "Boost.Space event tracking",
      "JWT-auth protected APIs"
    ]
  },
  {
    icon: Code,
    title: "Frontend",
    items: [
      "Login/Register/Dashboard/Agent creation views",
      "Zustand token store",
      "TailwindCSS UI",
      "Axios API layer"
    ]
  },
  {
    icon: Globe,
    title: "DevOps",
    items: [
      "Dockerized with PostgreSQL, Redis, FastAPI, React",
      "GitHub Actions for CI/CD",
      "SSL-ready via NGINX + Certbot",
      "Environment templates + API key handling"
    ]
  }
];

const nextSteps = [
  {
    icon: Bot,
    title: "Test your agents",
    description: "Use the /agents/new UI to create LangChain agent configurations and test their capabilities."
  },
  {
    icon: Cpu,
    title: "Add memory/tools",
    description: "Hook up memory, Google Search, OpenAI tools via LangChain to enhance agent capabilities."
  },
  {
    icon: BarChart,
    title: "Visualize everything",
    description: "Use Boost.Space to monitor usage + Slack alerts for status updates and metrics."
  },
  {
    icon: GitBranch,
    title: "Add fine-tuned models",
    description: "Load Hugging Face or OpenAI fine-tuned models for specialized tasks and industries."
  },
  {
    icon: Rocket,
    title: "Deploy to cloud",
    description: "Launch to Render, Railway, or AWS for global scale with high availability."
  }
];

const optionalEnhancements = [
  {
    icon: Gauge,
    title: "Sync agent activity to Google Sheets/Airtable",
    description: "Track agent performance and activities in real-time spreadsheets for analysis."
  },
  {
    icon: Brain,
    title: "Add self-training or prompt optimization routines",
    description: "Implement automatic optimization of prompts based on performance metrics."
  },
  {
    icon: Layers,
    title: "Visualize LangChain tool decisions in real time",
    description: "See which tools agents are selecting and why for debugging and improvement."
  },
  {
    icon: Workflow,
    title: "Add a DAG builder for multi-agent orchestration",
    description: "Visual interface for designing complex workflows between multiple AI agents."
  }
];

export default DevonnAIOverviewTab;
