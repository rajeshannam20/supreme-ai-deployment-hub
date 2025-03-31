
import React from 'react';
import { 
  Gauge,
  Brain,
  Layers,
  Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type EnhancementItem = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export const optionalEnhancements: EnhancementItem[] = [
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

const OptionalEnhancementsSection: React.FC = () => {
  return (
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
  );
};

export default OptionalEnhancementsSection;
