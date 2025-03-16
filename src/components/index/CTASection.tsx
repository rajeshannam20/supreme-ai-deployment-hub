
import React from 'react';
import Container from '@/components/Container';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, Bot } from 'lucide-react';
import { Button } from '../ui/button';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-secondary">
      <Container maxWidth="2xl">
        <div className="rounded-2xl bg-gradient-to-br from-primary/80 to-blue-600/80 p-8 md:p-12 shadow-lg relative overflow-hidden">
          {/* Abstract neural network background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
              alt="Neural network visualization" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-600/90"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 opacity-20 animate-pulse">
            <BrainCircuit size={40} className="text-white" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>
            <Cpu size={40} className="text-white" />
          </div>
          <div className="absolute top-1/2 right-20 opacity-20 animate-pulse" style={{ animationDelay: "0.5s" }}>
            <Bot size={40} className="text-white" />
          </div>
          
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white mb-4"
            >
              Ready to Deploy Your AI Framework?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/80 mb-8"
            >
              Start with our comprehensive deployment framework and take your AI applications to production with confidence.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/deployment">
                  Get Started
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-primary/20 text-white hover:bg-primary/30 border border-white/20"
              >
                <Link to="/documentation">
                  View Documentation
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
