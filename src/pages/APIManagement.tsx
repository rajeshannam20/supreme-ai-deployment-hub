
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import APIConnectionForm from '@/components/APIConnectionForm';

const APIManagement: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>API Management - DEVONN.AI</title>
      </Helmet>
      <Container>
        <SectionHeading
          title="API Management"
          description="Connect DEVONN.AI to external services and APIs to extend its capabilities."
        />
        
        <div className="mt-8">
          <APIConnectionForm />
        </div>
      </Container>
    </>
  );
};

export default APIManagement;
