
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import DocumentationTabs from '@/components/documentation/DocumentationTabs';

const Documentation: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Documentation - DEVONN.AI</title>
      </Helmet>
      <Container>
        <SectionHeading
          subheading="Detailed guides and references to help you get the most out of DEVONN.AI"
        >
          Documentation
        </SectionHeading>

        <div className="mt-8">
          <DocumentationTabs />
        </div>
      </Container>
    </>
  );
};

export default Documentation;
