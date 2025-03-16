
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - DEVONN.AI</title>
      </Helmet>
      <Container>
        <SectionHeading>
          Terms of Service
        </SectionHeading>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose dark:prose-invert max-w-none my-8"
        >
          <p>
            Last Updated: August 1, 2023
          </p>
          
          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using DEVONN.AI's website, services, or products, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on DEVONN.AI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose;</li>
            <li>Attempt to decompile or reverse engineer any software contained on DEVONN.AI's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          
          <h2>Disclaimer</h2>
          <p>
            The materials on DEVONN.AI's website are provided "as is". DEVONN.AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2>Limitations</h2>
          <p>
            In no event shall DEVONN.AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use DEVONN.AI's materials, even if DEVONN.AI or a DEVONN.AI authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          
          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
          
          <h2>Changes to Terms</h2>
          <p>
            DEVONN.AI may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the current version of these Terms of Service.
          </p>
        </motion.div>
      </Container>
    </>
  );
};

export default Terms;
