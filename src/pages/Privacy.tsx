
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - DEVONN.AI</title>
      </Helmet>
      <Container>
        <SectionHeading>
          Privacy Policy
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
          
          <h2>Introduction</h2>
          <p>
            DEVONN.AI ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This privacy policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our website, including:
          </p>
          <ul>
            <li>Personal information such as name, email address, and contact details when you register for an account or contact us.</li>
            <li>Usage information about your visits to our website, including the pages you view and the features you use.</li>
            <li>Technical information such as your IP address, browser type, and operating system.</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>
            We use information that we collect about you or that you provide to us:
          </p>
          <ul>
            <li>To present our website and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
            <li>To improve our website and user experience.</li>
          </ul>
          
          <h2>Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our website.
          </p>
          
          <h2>Changes to Our Privacy Policy</h2>
          <p>
            We may update our privacy policy from time to time. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the website home page.
          </p>
          
          <h2>Contact Information</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at: privacy@devonn.ai
          </p>
        </motion.div>
      </Container>
    </>
  );
};

export default Privacy;
