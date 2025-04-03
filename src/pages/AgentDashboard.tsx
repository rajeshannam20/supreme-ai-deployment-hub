
import React from "react";
import AgentManager from "@/components/agent/AgentManager";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const AgentDashboard: React.FC = () => {
  return (
    <div>
      <SectionHeading
        title="AI Agent Dashboard"
        description="Create, manage, and run AI agents for your tasks"
      />
      <Container>
        <AgentManager />
      </Container>
    </div>
  );
};

export default AgentDashboard;
