
import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';

const testimonialsData = [
  {
    quote: "DEVONN.AI transformed how we deploy machine learning models. We reduced our deployment time from days to minutes.",
    name: "Sarah Johnson",
    role: "CTO, DataStream AI"
  },
  {
    quote: "The observability stack integration saved us countless hours of troubleshooting and helped us identify performance bottlenecks immediately.",
    name: "Michael Chen",
    role: "Lead DevOps Engineer, TechFusion"
  },
  {
    quote: "The security features of DEVONN.AI gave us the confidence to deploy sensitive financial models in production environments.",
    name: "Elena Rodriguez",
    role: "Head of AI, FinTech Solutions"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <Container maxWidth="2xl">
        <SectionHeading 
          centered
          animate 
          tag="Testimonials"
          subheading="What our users say about DEVONN.AI Framework"
        >
          User Feedback
        </SectionHeading>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <Card className="h-full border-2 border-primary/5 hover:border-primary/20 transition-colors">
                <CardContent className="pt-6">
                  <div className="mb-4 text-4xl text-primary/20">"</div>
                  <p className="italic text-muted-foreground mb-6">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="font-semibold text-secondary-foreground">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
