
import React from 'react';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import DocumentationTabs from '@/components/documentation/DocumentationTabs';
import { motion } from 'framer-motion';

const Documentation: React.FC = () => {
  return (
    <div className="py-16">
      <Container maxWidth="7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading 
            tag="Documentation" 
            subheading="Comprehensive guides and reference materials for DEVONN.AI"
          >
            DEVONN.AI Documentation
          </SectionHeading>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <DocumentationTabs />
        </motion.div>
      </Container>
    </div>
  );
};

export default Documentation;
