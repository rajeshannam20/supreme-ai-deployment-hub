
import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Globe } from 'lucide-react';

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
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-center justify-center p-4"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center">
                <Globe className="w-8 h-8 text-primary/70" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default IntegrationPartners;
