
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { backendService } from '@/services/backendService';

const AgentBuilder = () => {
  const [agentName, setAgentName] = useState('');
  const [agentDesc, setAgentDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName) {
      toast.error('Please provide an agent name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await backendService.createAgent({
        name: agentName,
        description: agentDesc
      });
      toast.success('Agent created successfully');
      // Reset form
      setAgentName('');
      setAgentDesc('');
    } catch (error) {
      toast.error('Failed to create agent');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name</Label>
            <Input
              id="agentName"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="My Assistant"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agentDesc">Description</Label>
            <Textarea
              id="agentDesc"
              value={agentDesc}
              onChange={(e) => setAgentDesc(e.target.value)}
              placeholder="Describe what this agent does..."
              rows={3}
            />
          </div>
          
          <Separator className="my-4" />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Agent'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgentBuilder;
