
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitGraph, Terminal, LineChart, Send } from "lucide-react";
import { toast } from "sonner";
import { AgentService } from "@/services/agentService";
import yaml from 'js-yaml';

interface WorkflowTabProps {
  yamlDAG: string;
  setYamlDAG: (yaml: string) => void;
  dagResponse: any;
  setDagResponse: (response: any) => void;
  logMessages: string[];
}

const WorkflowTab: React.FC<WorkflowTabProps> = ({
  yamlDAG,
  setYamlDAG,
  dagResponse,
  setDagResponse,
  logMessages,
}) => {
  const handleSubmitDAG = async () => {
    try {
      const parsedDAG = yaml.load(yamlDAG);
      const response = await AgentService.submitDAG(parsedDAG);
      setDagResponse(response);
      toast.success("DAG workflow submitted successfully");
    } catch (error: any) {
      console.error("Error submitting DAG:", error);
      setDagResponse({ error: error.message || 'Invalid YAML or server error' });
      toast.error("Failed to submit DAG workflow");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitGraph className="h-5 w-5" />
            DAG Workflow Editor
          </CardTitle>
          <CardDescription>
            Create and submit agent workflows using YAML syntax
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="yamlEditor">YAML Configuration</Label>
            <Textarea
              id="yamlEditor"
              value={yamlDAG}
              onChange={(e) => setYamlDAG(e.target.value)}
              placeholder="Enter DAG in YAML format..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          <Button
            onClick={handleSubmitDAG}
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            Submit DAG Workflow
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Workflow Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dagResponse ? (
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {JSON.stringify(dagResponse, null, 2)}
                </pre>
              </ScrollArea>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Submit a workflow to see the response here
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Real-Time Agent Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md border bg-black p-4">
              <div className="font-mono text-sm text-green-400">
                {logMessages.length > 0 ? (
                  logMessages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    Waiting for log messages...
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowTab;
