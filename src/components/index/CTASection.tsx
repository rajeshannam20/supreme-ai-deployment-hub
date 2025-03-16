
import React from 'react';
import Container from '@/components/Container';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-secondary">
      <Container maxWidth="2xl">
        <div className="rounded-2xl bg-gradient-to-br from-primary/80 to-blue-600/80 p-8 md:p-12 shadow-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white mb-4">
              Ready to Deploy Your AI Framework?
            </h2>
            <p className="text-white/80 mb-8">
              Start with our comprehensive deployment framework and take your AI applications to production with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-white text-primary hover:bg-white/90"
              >
                Get Started
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary/20 text-white hover:bg-primary/30 border border-white/20"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
