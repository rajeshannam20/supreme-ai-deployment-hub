
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Bell, Users } from 'lucide-react';

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
        
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
              alt="Data privacy visualization" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white">Protecting Your Data in the AI Era</h2>
                <p className="text-white/80">Last Updated: August 1, 2023</p>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose dark:prose-invert max-w-none my-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Data Protection</h3>
              <p className="text-muted-foreground text-sm">We implement robust security measures to protect your personal information and AI training data.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <Lock className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Encryption</h3>
              <p className="text-muted-foreground text-sm">All sensitive data is encrypted both in transit and at rest to prevent unauthorized access.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <Eye className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Transparency</h3>
              <p className="text-muted-foreground text-sm">We are committed to being transparent about how we collect and use your data.</p>
            </div>
          </div>
          
          <h2 className="flex items-center gap-2"><FileText className="text-primary" /> Introduction</h2>
          <p>
            DEVONN.AI ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This privacy policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>
          
          <h2 className="flex items-center gap-2"><Users className="text-primary" /> Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our website, including:
          </p>
          <ul>
            <li>Personal information such as name, email address, and contact details when you register for an account or contact us.</li>
            <li>Usage information about your visits to our website, including the pages you view and the features you use.</li>
            <li>Technical information such as your IP address, browser type, and operating system.</li>
            <li>AI-related data, such as model training inputs, model outputs, and feedback provided to improve our services.</li>
          </ul>
          
          <h2 className="flex items-center gap-2"><Shield className="text-primary" /> How We Use Your Information</h2>
          <p>
            We use information that we collect about you or that you provide to us:
          </p>
          <ul>
            <li>To present our website and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
            <li>To improve our website and user experience.</li>
            <li>To enhance and train our AI models, while respecting privacy and confidentiality concerns.</li>
          </ul>
          
          <h2 className="flex items-center gap-2"><Lock className="text-primary" /> Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our website.
          </p>
          
          <h2 className="flex items-center gap-2"><Bell className="text-primary" /> Changes to Our Privacy Policy</h2>
          <p>
            We may update our privacy policy from time to time. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the website home page.
          </p>
          
          <h2 className="flex items-center gap-2"><FileText className="text-primary" /> Contact Information</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at: privacy@devonn.ai
          </p>
        </motion.div>
      </Container>
    </>
  );
};

export default Privacy;
