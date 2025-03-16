
import React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, useLocation } from 'react-router-dom';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import DocumentationTabs from '@/components/documentation/DocumentationTabs';
import IstioServiceMeshPage from '@/components/documentation/IstioServiceMeshPage';
import KongAPIGatewayPage from '@/components/documentation/KongAPIGatewayPage';
import ObservabilityStackPage from '@/components/documentation/ObservabilityStackPage';

const Documentation: React.FC = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/documentation';
  
  return (
    <>
      <Helmet>
        <title>Documentation - DEVONN.AI</title>
      </Helmet>
      <Container>
        {isMainPage ? (
          <>
            <SectionHeading
              subheading="Detailed guides and references to help you get the most out of DEVONN.AI"
            >
              Documentation
            </SectionHeading>

            <div className="mt-8">
              <DocumentationTabs />
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/istio-service-mesh" element={<IstioServiceMeshPage />} />
            <Route path="/kong-api-gateway" element={<KongAPIGatewayPage />} />
            <Route path="/observability-stack" element={<ObservabilityStackPage />} />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default Documentation;
