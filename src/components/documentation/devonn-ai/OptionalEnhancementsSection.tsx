
import React from 'react';
import SectionHeader from './enhancements/SectionHeader';
import EnhancementGrid from './enhancements/EnhancementGrid';
import { enhancementData } from './enhancements/enhancementData';

const OptionalEnhancementsSection: React.FC = () => {
  return (
    <section>
      <SectionHeader 
        title="Optional Enhancements" 
        description="Extend Devonn.AI's capabilities with these powerful add-on modules and integrations."
      />
      <EnhancementGrid enhancements={enhancementData} />
    </section>
  );
};

export default OptionalEnhancementsSection;
