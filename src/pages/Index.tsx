
import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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
// New components
import AIFeatureShowcase from '@/components/index/AIFeatureShowcase';
import AIVisualization from '@/components/index/AIVisualization';
import VoiceEnabledAI from '@/components/index/VoiceEnabledAI';
import MultiCloudDeployment from '@/components/index/MultiCloudDeployment';

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Show welcome toast with improved message
    toast('Welcome to DEVONN.AI', {
      description: 'Explore our voice-enabled AI deployment framework with multi-cloud capabilities',
      position: 'bottom-right',
      duration: 5000,
    });

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col overflow-hidden"
    >
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <HeroSection />
      <AIVisualization />
      <VoiceEnabledAI />
      <DashboardPreview />
      <MultiCloudDeployment />
      <GettingStartedSteps />
      <KeyComponents />
      <AIFeatureShowcase />
      <LatestUpdates />
      <ArchitectureDiagram />
      <CaseStudies />
      <IntegrationPartners />
      <Testimonials />
      <FAQSection />
      <ManifestSection />
      <CTASection />
      
      <Footer />
      
      {/* Fixed floating action button for quick navigation */}
      <motion.button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default Index;
