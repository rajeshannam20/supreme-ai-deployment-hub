
import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';

const componentsData = [
  {
    title: "Istio Service Mesh",
    description: "Advanced traffic management with mTLS encryption and robust authorization policies.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  },
  {
    title: "Kong API Gateway",
    description: "Secure and efficient API management with rate limiting and authentication plugins.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    title: "Observability Stack",
    description: "Comprehensive monitoring with Prometheus, Grafana, and Jaeger for complete system visibility.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 9L13 15L9 11L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
];

const KeyComponents: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/50">
      <Container maxWidth="2xl">
        <SectionHeading 
          centered 
          animate 
          tag="Architecture"
          subheading="Built with precision and simplicity in mind, our framework offers a comprehensive solution for AI deployment."
        >
          Key Components
        </SectionHeading>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {componentsData.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default KeyComponents;
