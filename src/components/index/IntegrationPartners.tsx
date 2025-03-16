
import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Brain, Cpu, Database, ServerCog, Network, Boxes, BrainCircuit, Bot, Code, FileCode, Command, Microchip } from 'lucide-react';

const partners = [
  { 
    name: 'Neural Network', 
    icon: BrainCircuit,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    color: "bg-blue-500/10 text-blue-500"
  },
  { 
    name: 'Tensor Processing', 
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    color: "bg-purple-500/10 text-purple-500"
  },
  { 
    name: 'Vector Database', 
    icon: Database,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    color: "bg-green-500/10 text-green-500"
  },
  { 
    name: 'AI Inference', 
    icon: ServerCog,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    color: "bg-amber-500/10 text-amber-500"
  },
  { 
    name: 'Distributed ML', 
    icon: Network,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    color: "bg-red-500/10 text-red-500"
  },
  { 
    name: 'Containerized AI', 
    icon: Boxes,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    color: "bg-indigo-500/10 text-indigo-500"
  },
  { 
    name: 'Chatbot Models', 
    icon: Bot,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    color: "bg-teal-500/10 text-teal-500"
  },
  { 
    name: 'AI Accelerators', 
    icon: Microchip,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    color: "bg-cyan-500/10 text-cyan-500"
  },
  { 
    name: 'AI Embeddings', 
    icon: Database,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    color: "bg-emerald-500/10 text-emerald-500"
  },
  { 
    name: 'Model Serving', 
    icon: Code,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    color: "bg-violet-500/10 text-violet-500"
  },
  { 
    name: 'AI Orchestration', 
    icon: Command,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    color: "bg-pink-500/10 text-pink-500"
  },
  { 
    name: 'LLM Models', 
    icon: Brain,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    color: "bg-blue-500/10 text-blue-500"
  },
];

const IntegrationPartners: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
          alt="AI pattern background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <Container maxWidth="2xl">
        <SectionHeading 
          centered
          animate 
          tag="Ecosystem"
          subheading="DEVONN.AI integrates seamlessly with leading tools and platforms"
        >
          Integration Partners
        </SectionHeading>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, i) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex flex-col items-center justify-center p-4 text-center group hover:scale-105 transition-transform duration-200"
              >
                <div className={`w-16 h-16 ${partner.color} rounded-full shadow-md flex items-center justify-center mb-2 relative overflow-hidden group-hover:shadow-lg transition-all duration-200`}>
                  <div className="absolute inset-0 opacity-10">
                    <img 
                      src={partner.image} 
                      alt={partner.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Icon className="w-8 h-8 relative z-10" />
                </div>
                <span className="text-xs font-medium text-muted-foreground mt-1 group-hover:text-primary transition-colors">{partner.name}</span>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default IntegrationPartners;
