
import React from 'react';
import DeploymentPage from '@/components/deployment/DeploymentPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const DeploymentDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />
      <DeploymentPage />
      <Footer />
    </motion.div>
  );
};

export default DeploymentDashboard;
