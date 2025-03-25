
import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import { AnimatedText } from '@/components/ui/animated-shiny-text';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32">
      <Container maxWidth="2xl" animate>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block mb-3 px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary">
              Deployment Framework
            </span>
            <AnimatedText 
              text="devonn.ai"
              gradientColors="linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)"
              gradientAnimationDuration={3}
              hoverEffect={true}
              className="py-0 justify-start mb-4"
              textClassName="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight"
            />
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
              A minimalist, elegant framework for deploying AI systems with precision and scalability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#manifest"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90"
              >
                View Manifest
              </a>
              <a
                href="#dashboard-preview"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                See Dashboard
              </a>
            </div>
          </motion.div>
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10"
            >
              <div className="rounded-xl p-1 bg-gradient-to-br from-gray-200 via-white to-gray-100 shadow-xl overflow-hidden">
                <div className="bg-black/90 rounded-lg p-3">
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-3 text-xs font-mono text-gray-400">devonn.ai Framework</div>
                  </div>
                  <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                    <code>
                      $ kubectl apply -f devonn-ai-manifest.yaml<br />
                      service/devonn-ai created<br />
                      deployment.apps/devonn-ai created<br />
                      ingress.networking/devonn-ai created<br />
                      <span className="text-blue-400">✓</span> Framework successfully deployed
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>
            
            <div className="absolute -z-10 w-full h-full top-0 left-0 translate-x-5 translate-y-5">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-xl blur-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
