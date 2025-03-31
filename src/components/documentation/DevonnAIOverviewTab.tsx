
import React from 'react';
import { Brain, Cpu, Server, GitBranch, Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const DevonnAIOverviewTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Devonn.AI Project Overview</h2>
        <p className="text-muted-foreground mb-6">
          An intelligent, modular AI agent factory that builds other AIs, with all the components you need to launch, run, and expand.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Capabilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create and manage AI agents (LangChain-powered)</li>
                <li>Real-time tracking of agent usage (via Boost.Space)</li>
                <li>Slack alert integration for errors and lifecycle events</li>
                <li>FastAPI backend with JWT auth, PostgreSQL, Alembic</li>
                <li>React frontend with TailwindCSS, Zustand, and Agent UI</li>
                <li>Docker + GitHub CI/CD, NGINX + HTTPS setup</li>
                <li>Multi-agent orchestration-ready</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Project Components</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Backend</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><code>main.py</code>, <code>routes/</code>, <code>schemas/</code>, <code>services/</code></li>
                    <li>API endpoints: <code>/auth/</code>, <code>/secure/</code>, <code>/agents/new</code>, <code>/tasks/</code>, <code>/metrics/</code></li>
                    <li>LangChain agent factory module</li>
                    <li>Boost.Space event tracking</li>
                    <li>JWT-auth protected APIs</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Frontend</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Login/Register/Dashboard/Agent creation views</li>
                    <li>Zustand token store</li>
                    <li>TailwindCSS UI</li>
                    <li>Axios API layer</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">DevOps</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Dockerized with PostgreSQL, Redis, FastAPI, React</li>
                    <li>GitHub Actions for CI/CD</li>
                    <li>SSL-ready via NGINX + Certbot</li>
                    <li>Environment templates + API key handling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Separator />
      
      <section>
        <h3 className="text-2xl font-bold tracking-tight mb-4">What You Can Do Next</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nextSteps.map((step) => (
            <Card key={step.title} className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <Separator />
      
      <section>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Optional Enhancements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optionalEnhancements.map((enhancement, index) => (
            <div key={index} className="flex gap-3 p-4 border rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <enhancement.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{enhancement.title}</p>
              </div>
            </div>
          ))}
        </div>
        
        <p className="mt-8 text-center text-lg font-medium text-primary">
          You've built a self-aware agent creation system. The factory is online.
        </p>
      </section>
    </div>
  );
};

const nextSteps = [
  {
    icon: Brain,
    title: "Test your agents",
    description: "Use the /agents/new UI to create LangChain agent configurations"
  },
  {
    icon: Cpu,
    title: "Add memory/tools",
    description: "Hook up memory, Google Search, OpenAI tools via LangChain"
  },
  {
    icon: Server,
    title: "Visualize everything",
    description: "Use Boost.Space to monitor usage + Slack alerts for status"
  },
  {
    icon: GitBranch,
    title: "Add fine-tuned models",
    description: "Load Hugging Face or OpenAI fine-tuned models"
  },
  {
    icon: Rocket,
    title: "Deploy to cloud",
    description: "Launch to Render, Railway, or AWS for global scale"
  }
];

const optionalEnhancements = [
  {
    icon: Brain,
    title: "Sync agent activity to Google Sheets/Airtable"
  },
  {
    icon: Cpu,
    title: "Add self-training or prompt optimization routines"
  },
  {
    icon: Server,
    title: "Visualize LangChain tool decisions in real time"
  },
  {
    icon: GitBranch,
    title: "Add a DAG builder for multi-agent orchestration"
  }
];

export default DevonnAIOverviewTab;
