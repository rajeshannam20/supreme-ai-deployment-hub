import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const handleDeploymentNavigation = () => {
    navigate('/deployment');
  };

  return (
    <section className="py-16 bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Deploy Your AI Infrastructure
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Streamline your AI deployment with our comprehensive infrastructure management tools.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleDeploymentNavigation} 
              className="bg-primary hover:bg-primary/90"
            >
              <Terminal className="mr-2 h-4 w-4" />
              Go to Deployment Dashboard
            </Button>
            <Button variant="outline">
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
