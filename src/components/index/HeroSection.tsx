
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import { AnimatedText } from '@/components/ui/animated-shiny-text';
import { MatrixRain } from '@/components/ui/matrix-rain';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Code, Sparkles } from 'lucide-react';
import TypewriterEffect from '@/components/ui/typewriter-effect';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Matrix Rain Effect */}
      <MatrixRain 
        speed={1} 
        density={0.7} 
        color="#00FF41" 
        size={16} 
        opacity={0.7} 
      />
      
      {/* Dark overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      <Container maxWidth="2xl" animate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          {/* Content section - Moved up */}
          <motion.div
            className="lg:col-span-7 mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block mb-3 px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">
              AI Framework
            </span>
            
            <div className="mb-4">
              <AnimatedText 
                text="devonn.ai"
                gradientColors="linear-gradient(90deg, #00FF41, #39FF14, #00FF41)"
                gradientAnimationDuration={3}
                hoverEffect={true}
                className="py-0 justify-start"
                textClassName="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight"
              />
            </div>
            
            <p className="text-xl text-[#00FF41]/90 font-mono mb-2 max-w-md">
              Here at an opportune time.
            </p>
            
            <p className="text-white/80 mb-8 max-w-md">
              A minimalist, elegant framework for deploying AI systems with precision and scalability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Enhanced primary CTA button with download icon and animation */}
              <Button 
                size="lg"
                className="bg-[#00FF41] hover:bg-[#00FF41]/90 text-black shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <Download className="mr-2 h-4 w-4 opacity-70" />
                <span className="group-hover:mr-2 transition-all">Download Framework</span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-[#00FF41]/50 text-[#00FF41] hover:bg-[#00FF41]/10 backdrop-blur-sm"
              >
                <Code className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
            </div>
          </motion.div>
          
          {/* Terminal window component - Moved down with larger gap */}
          <div className="lg:col-span-5 relative lg:mt-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10"
            >
              <div className="rounded-xl p-1 bg-gradient-to-br from-[#00FF41]/20 via-[#00FF41]/10 to-[#00FF41]/20 shadow-xl shadow-[#00FF41]/10 overflow-hidden backdrop-blur-sm border border-[#00FF41]/20">
                <div className="bg-black/90 rounded-lg p-5">
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-3 text-xs font-mono text-[#00FF41]">devonn.ai Framework</div>
                  </div>
                  
                  <div className="rounded bg-black/70 p-4 backdrop-blur-sm border border-[#00FF41]/10">
                    <pre className="text-xs text-[#00FF41] font-mono overflow-x-auto">
                      <code>
                        <TypewriterEffect 
                          text={[
                            "$ kubectl apply -f devonn-ai-manifest.yaml",
                            "service/devonn-ai created",
                            "deployment.apps/devonn-ai created",
                            "ingress.networking/devonn-ai created",
                            "✓ Framework successfully deployed"
                          ]}
                          speed={80}
                          delay={1000}
                          cursorClassName="text-[#00FF41]"
                        />
                      </code>
                    </pre>
                  </div>
                  
                  {/* Logo display */}
                  <div className="mt-4 flex justify-center">
                    <img 
                      src="/lovable-uploads/afc0efdb-ca08-430e-a93b-ac0379ffd4f2.png" 
                      alt="DEVONN.AI Logo" 
                      className="h-16 object-contain" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="absolute -z-10 w-full h-full top-0 left-0 translate-x-5 translate-y-5">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FF41]/30 to-[#39FF14]/30 rounded-xl blur-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
