
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

// Import all the component sections
import HeroSection from '@/components/index/HeroSection';
import DashboardPreview from '@/components/index/DashboardPreview';
import GettingStartedSteps from '@/components/index/GettingStartedSteps';
import KeyComponents from '@/components/index/KeyComponents';
import LatestUpdates from '@/components/index/LatestUpdates';
import ArchitectureDiagram from '@/components/index/ArchitectureDiagram';
import CaseStudies from '@/components/index/CaseStudies';
import FAQSection from '@/components/index/FAQSection';
import IntegrationPartners from '@/components/index/IntegrationPartners';
import Testimonials from '@/components/index/Testimonials';
import ManifestSection from '@/components/index/ManifestSection';
import CTASection from '@/components/index/CTASection';

const Index = () => {
  useEffect(() => {
    // Show welcome toast
    toast('Welcome to DEVONN.AI', {
      description: 'Explore the deployment manifest for AI systems',
      position: 'bottom-right',
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      
      <HeroSection />
      <DashboardPreview />
      <GettingStartedSteps />
      <KeyComponents />
      <LatestUpdates />
      <ArchitectureDiagram />
      <CaseStudies />
      <FAQSection />
      <IntegrationPartners />
      <Testimonials />
      <ManifestSection />
      <CTASection />
      
      <Footer />
    </motion.div>
  );
};

export default Index;
