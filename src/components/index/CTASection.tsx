
import React from 'react';
import Container from '@/components/Container';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-secondary">
      <Container maxWidth="2xl">
        <div className="rounded-2xl bg-gradient-to-br from-primary/80 to-blue-600/80 p-8 md:p-12 shadow-lg relative overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
              alt="Neural network visualization" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-600/90"></div>
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
              <Link 
                to="/deployment"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-white text-primary hover:bg-white/90"
              >
                Get Started
              </Link>
              <Link
                to="/documentation"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary/20 text-white hover:bg-primary/30 border border-white/20"
              >
                View Documentation
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
