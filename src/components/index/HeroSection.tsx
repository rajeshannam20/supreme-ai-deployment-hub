
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Container from '@/components/Container';
import { AnimatedText } from '@/components/ui/animated-shiny-text';
import { MatrixRain } from '@/components/ui/matrix-rain';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Code } from 'lucide-react';
import InteractiveTerminal from './InteractiveTerminal';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const isMobile = useIsMobile();
  const [stats, setStats] = useState({
    deployments: 0,
    efficiency: 0,
    uptime: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        deployments: Math.min(prev.deployments + 1, 1000),
        efficiency: Math.min(prev.efficiency + 1, 99),
        uptime: Math.min(prev.uptime + 0.1, 99.99)
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <MatrixRain 
        speed={1} 
        density={0.7} 
        color="#00FF41" 
        size={16} 
        opacity={0.7} 
      />
      
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      <Container maxWidth="2xl" animate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          <motion.div
            style={{ y, opacity }}
            className="lg:col-span-7 space-y-6 py-12 lg:py-0"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">
                AI Framework
              </span>
              
              <AnimatedText 
                text="devonn.ai"
                gradientColors="linear-gradient(90deg, #00FF41, #39FF14, #00FF41)"
                gradientAnimationDuration={3}
                hoverEffect={true}
                className="py-0 justify-start"
                textClassName={`${isMobile ? 'text-4xl sm:text-5xl' : 'text-5xl lg:text-6xl xl:text-7xl'} font-display font-semibold tracking-tight`}
              />
              
              <p className="text-xl text-[#00FF41]/90 font-mono mb-2 max-w-md">
                Here at an opportune time.
              </p>
              
              <p className="text-white/80 text-lg max-w-md">
                A minimalist, elegant framework for deploying AI systems with precision and scalability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  className="bg-[#00FF41] hover:bg-[#00FF41]/90 text-black shadow-[0_0_15px_rgba(0,255,65,0.5)] 
                           transition-all duration-300 group relative overflow-hidden w-full sm:w-auto"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={false}
                    animate={{ x: ["0%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <Download className="mr-2 h-4 w-4 opacity-70" />
                  <span className="relative z-10">Download Framework</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#00FF41]/50 text-[#00FF41] hover:bg-[#00FF41]/10 backdrop-blur-sm
                           w-full sm:w-auto"
                >
                  <Code className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { label: 'Deployments', value: stats.deployments.toLocaleString() },
                  { label: 'Efficiency', value: `${stats.efficiency}%` },
                  { label: 'Uptime', value: `${stats.uptime.toFixed(2)}%` }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-[#00FF41]/20"
                  >
                    <div className="text-lg sm:text-xl font-bold text-[#00FF41]">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <InteractiveTerminal />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;

