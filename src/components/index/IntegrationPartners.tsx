
import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Brain, Cpu, Database, ServerCog, Network, Boxes } from 'lucide-react';

const partners = [
  { name: 'Neural Network', icon: Brain },
  { name: 'Processor', icon: Cpu },
  { name: 'Database', icon: Database },
  { name: 'Server', icon: ServerCog },
  { name: 'Network', icon: Network },
  { name: 'Containers', icon: Boxes },
  { name: 'Neural Network', icon: Brain },
  { name: 'Processor', icon: Cpu },
  { name: 'Database', icon: Database },
  { name: 'Server', icon: ServerCog },
  { name: 'Network', icon: Network },
  { name: 'Containers', icon: Boxes },
];

const IntegrationPartners: React.FC = () => {
  return (
    <section className="py-20">
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
                className="flex flex-col items-center justify-center p-4 text-center"
              >
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center mb-2">
                  <Icon className="w-8 h-8 text-primary/70" />
                </div>
                <span className="text-xs text-muted-foreground mt-1">{partner.name}</span>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default IntegrationPartners;
