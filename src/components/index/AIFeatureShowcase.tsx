
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Network, Zap, Code2, Lock, BarChart } from 'lucide-react';

const features = [
  {
    id: 'neural',
    title: 'Neural Network Processing',
    description: 'Process complex neural networks with optimized infrastructure for training and inference.',
    icon: BrainCircuit,
    color: 'from-blue-500 to-purple-600',
    details: [
      'Multi-GPU Training Support',
      'Distributed Processing',
      'Model Checkpointing',
      'Gradient Accumulation'
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'
  },
  {
    id: 'vector',
    title: 'Vector Database Integration',
    description: 'Store and query high-dimensional vectors for semantic search and recommendation systems.',
    icon: Network,
    color: 'from-green-500 to-emerald-600',
    details: [
      'Similarity Search',
      'Clustering Operations',
      'Embedding Storage',
      'ANN Algorithms'
    ],
    image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f'
  },
  {
    id: 'inference',
    title: 'Fast Inference Engine',
    description: 'Serve AI models with low-latency responses for real-time applications.',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    details: [
      'Model Quantization',
      'Batched Prediction',
      'Adaptive Scaling',
      'Request Prioritization'
    ],
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23'
  },
  {
    id: 'security',
    title: 'Security & Governance',
    description: 'Implement robust security measures for model deployment and data protection.',
    icon: Lock,
    color: 'from-red-500 to-pink-600',
    details: [
      'Model Encryption',
      'Access Control',
      'Audit Logging',
      'Data Anonymization'
    ],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3'
  },
  {
    id: 'pipeline',
    title: 'CI/CD Pipeline',
    description: 'Automated workflows for testing and deploying AI models to production.',
    icon: Code2,
    color: 'from-indigo-500 to-violet-600',
    details: [
      'Automated Testing',
      'Model Versioning',
      'Canary Deployments',
      'Rollback Mechanisms'
    ],
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2'
  },
  {
    id: 'monitoring',
    title: 'Model Monitoring',
    description: 'Track model performance, drift, and operational metrics in production.',
    icon: BarChart,
    color: 'from-cyan-500 to-blue-600',
    details: [
      'Performance Metrics',
      'Drift Detection',
      'Alerting System',
      'Custom Dashboards'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
  }
];

const FeatureCard: React.FC<{
  feature: typeof features[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ feature, isActive, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: isActive ? 1 : 1.03 }}
      transition={{ duration: 0.2 }}
      className={`cursor-pointer ${isActive ? 'col-span-2 row-span-2' : ''}`}
      onClick={onClick}
    >
      <Card className={`h-full border-2 overflow-hidden ${isActive ? 'border-primary' : 'border-transparent hover:border-primary/30'} transition-all duration-300`}>
        <CardContent className="p-0">
          <div className="relative h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br bg-gray-900/80 z-10"></div>
              <img 
                src={feature.image} 
                alt={feature.title} 
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            
            <div className="relative z-20 p-6 flex flex-col h-full">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="text-white" size={24} />
              </div>
              
              <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
              
              <p className="text-gray-300 mb-4 text-sm">{feature.description}</p>
              
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-auto"
                >
                  <h4 className="text-white font-medium mb-2">Key Capabilities:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {feature.details.map((detail, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-gray-300 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {!isActive && (
                <div className="mt-auto text-primary text-sm font-medium">
                  Click to learn more →
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AIFeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <Container maxWidth="2xl">
        <SectionHeading
          centered
          animate
          tag="AI Capabilities"
          subheading="Powerful features designed to streamline AI deployment and management"
        >
          Advanced AI Features
        </SectionHeading>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              isActive={activeFeature === feature.id}
              onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default AIFeatureShowcase;
