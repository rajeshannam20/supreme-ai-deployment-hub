
import React from 'react';
import Container from '@/components/Container';
import { motion } from 'framer-motion';
import MatrixBackground from './cta/MatrixBackground';
import FloatingIcons from './cta/FloatingIcons';
import CTAContent from './cta/CTAContent';

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
          {/* Matrix background with neural network visualization */}
          <MatrixBackground particles={particles} />
          
          {/* Floating AI-themed icons */}
          <FloatingIcons />
          
          {/* CTA content with heading and buttons */}
          <CTAContent />
        </motion.div>
      </Container>
    </section>
  );
};

export default CTASection;
