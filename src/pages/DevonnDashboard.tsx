
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import AgentBuilder from '@/components/builder/AgentBuilder';
import OpenManusEditor from '@/components/builder/OpenManusEditor';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import SkillParser from '@/components/skills/SkillParser';
import ChatUI from '@/components/chat/ChatUI';
import { toast } from 'sonner';

const DevonnDashboard = () => {
  return (
    <div className="py-8">
      <Container>
        <SectionHeading
          tag="Beta"
          centered
          className="mb-8"
          subheading="Build, deploy, and manage AI agents with OpenManus"
        >
          Devonn.AI Dashboard
        </SectionHeading>
        
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="builder">Agent Builder</TabsTrigger>
            <TabsTrigger value="yaml">OpenManus Editor</TabsTrigger>
            <TabsTrigger value="skills">Skill Parser</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <AgentDashboard />
          </TabsContent>
          
          <TabsContent value="builder" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <AgentBuilder />
            </div>
          </TabsContent>
          
          <TabsContent value="yaml" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <OpenManusEditor />
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <SkillParser />
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <ChatUI />
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default DevonnDashboard;
