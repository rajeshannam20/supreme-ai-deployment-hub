
import React from 'react';
import Container from '@/components/Container';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, Bot, ZapIcon, NetworkIcon, DatabaseIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { fadeIn, slideUp } from '@/lib/animations';

const CTASection: React.FC = () => {
  // Particle effect for enhanced neural network visualization
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 3 + Math.random() * 7,
    delay: Math.random() * 2
  }));

  return (
    <section className="py-20 bg-secondary">
      <Container maxWidth="2xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="rounded-2xl bg-gradient-to-br from-primary/80 to-blue-600/80 p-8 md:p-12 shadow-xl relative overflow-hidden"
        >
          {/* Enhanced neural network background with 3D effect */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
              alt="Neural network visualization" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-600/90"></div>
            
            {/* Neural network nodes and connections */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              
              {/* Random connections */}
              {Array.from({ length: 15 }, (_, i) => {
                const x1 = Math.random() * 100;
                const y1 = Math.random() * 100;
                const x2 = Math.random() * 100;
                const y2 = Math.random() * 100;
                
                return (
                  <motion.line 
                    key={`line-${i}`}
                    x1={`${x1}%`} 
                    y1={`${y1}%`} 
                    x2={`${x2}%`} 
                    y2={`${y2}%`} 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 2, ease: "easeInOut" }}
                  />
                );
              })}
              
              {/* Nodes */}
              {Array.from({ length: 20 }, (_, i) => {
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = 3 + Math.random() * 5;
                
                return (
                  <motion.circle 
                    key={`node-${i}`}
                    cx={`${x}%`} 
                    cy={`${y}%`} 
                    r={size} 
                    fill="url(#nodeGradient)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 1, 0.8, 1], 
                      opacity: [0, 0.5, 0.8, 0.5, 0.7] 
                    }}
                    transition={{ 
                      duration: 4 + Math.random() * 5, 
                      repeat: Infinity, 
                      delay: Math.random() * 2,
                      repeatType: "reverse" 
                    }}
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Floating AI elements with enhanced animations */}
          <motion.div 
            className="absolute top-10 left-10 text-white"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <BrainCircuit size={40} className="drop-shadow-lg" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 right-10 text-white"
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0, 5, 0],
              scale: [1, 1.05, 1] 
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          >
            <Cpu size={40} className="drop-shadow-lg" />
          </motion.div>
          
          <motion.div 
            className="absolute top-1/2 right-20 text-white"
            animate={{ 
              x: [0, 10, 0, -10, 0],
              rotate: [0, 10, 0, -10, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          >
            <Bot size={40} className="drop-shadow-lg" />
          </motion.div>
          
          {/* Additional AI-themed floating icons */}
          <motion.div 
            className="absolute top-1/4 left-20 text-white"
            animate={{ 
              x: [0, -15, 0],
              y: [0, 10, 0],
              rotate: [0, -15, 0] 
            }}
            transition={{ 
              duration: 9, 
              repeat: Infinity,
              delay: 2.5
            }}
          >
            <ZapIcon size={30} className="drop-shadow-lg opacity-60" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 left-1/3 text-white"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              delay: 1.5
            }}
          >
            <NetworkIcon size={35} className="drop-shadow-lg opacity-50" />
          </motion.div>
          
          <motion.div 
            className="absolute top-1/3 right-1/4 text-white"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <DatabaseIcon size={25} className="drop-shadow-lg opacity-40" />
          </motion.div>
          
          {/* Animated particles */}
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay
              }}
            />
          ))}
          
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <motion.h2 
              variants={fadeIn}
              className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold tracking-tight text-white mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Ready to Deploy Your AI Framework?
            </motion.h2>
            
            <motion.p 
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/90 mb-8 text-lg"
            >
              Start with our comprehensive deployment framework and take your AI applications to production with confidence.
            </motion.p>
            
            <motion.div 
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-transform shadow-lg group"
              >
                <Link to="/deployment">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    Get Started
                  </span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-primary/20 text-white hover:bg-primary/30 border border-white/20 hover:scale-105 transition-transform shadow-md backdrop-blur-sm group"
              >
                <Link to="/documentation">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    View Documentation
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
          
          {/* Pulsing highlight circles */}
          <div className="absolute left-1/4 bottom-1/4 w-32 h-32 rounded-full bg-blue-400/5 blur-2xl"></div>
          <motion.div 
            className="absolute right-1/4 top-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          ></motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTASection;
