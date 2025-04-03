
import React, { useState } from "react";
import { useAgents } from "@/hooks/useAgents";
import { Task } from "@/types/agent";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, RefreshCw, Send, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const AgentManager: React.FC = () => {
  const {
    agents,
    loading,
    generating,
    selectedAgent,
    lastResponse,
    setSelectedAgent,
    generateAgent,
    runAgent,
    refreshAgents,
  } = useAgents();

  const [taskDescription, setTaskDescription] = useState("");
  const [context, setContext] = useState("");
  const [includeContext, setIncludeContext] = useState(false);
  const [userId, setUserId] = useState("user_" + Math.random().toString(36).substring(2, 8));

  const handleGenerateAgent = async () => {
    if (!taskDescription) {
      return;
    }

    const task: Task = {
      user_id: userId,
      task_description: taskDescription,
      context: includeContext ? context : undefined,
    };

    try {
      await generateAgent(task);
    } catch (error) {
      console.error("Error generating agent:", error);
    }
  };

  const handleRunAgent = async () => {
    if (!selectedAgent || !taskDescription) {
      return;
    }

    const task: Task = {
      user_id: userId,
      task_description: taskDescription,
      context: includeContext ? context : undefined,
    };

    try {
      await runAgent(selectedAgent.id, task);
    } catch (error) {
      console.error("Error running agent:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI Agent Manager</h1>
          <Button variant="outline" onClick={refreshAgents} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Agents
          </Button>
        </div>

        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Agent</TabsTrigger>
            <TabsTrigger value="manage">Manage Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate New AI Agent</CardTitle>
                <CardDescription>
                  Create a new AI agent by providing a task description and optional context.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your user ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskDescription">Task Description</Label>
                  <Textarea
                    id="taskDescription"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Describe what you want the AI agent to do..."
                    rows={4}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeContext"
                    checked={includeContext}
                    onCheckedChange={(checked) => 
                      setIncludeContext(checked === true)}
                  />
                  <Label htmlFor="includeContext">Include additional context</Label>
                </div>
                {includeContext && (
                  <div className="space-y-2">
                    <Label htmlFor="context">Additional Context</Label>
                    <Textarea
                      id="context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Provide any additional context..."
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleGenerateAgent}
                  disabled={!taskDescription || generating}
                  className="w-full"
                >
                  {generating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {generating ? "Generating Agent..." : "Generate AI Agent"}
                </Button>
              </CardFooter>
            </Card>

            {lastResponse && (
              <Card>
                <CardHeader>
                  <CardTitle>Agent Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="whitespace-pre-wrap">{lastResponse}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Available Agents</CardTitle>
                  <CardDescription>
                    {agents.length} agent{agents.length !== 1 ? "s" : ""} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : agents.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      No agents found. Create one first.
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {agents.map((agent) => (
                          <div
                            key={agent.id}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${
                              selectedAgent?.id === agent.id ? "bg-accent" : ""
                            }`}
                            onClick={() => setSelectedAgent(agent)}
                          >
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {agent.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedAgent ? `Run Agent: ${selectedAgent.name}` : "Select an Agent"}
                  </CardTitle>
                  {selectedAgent && (
                    <CardDescription>{selectedAgent.desc}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAgent ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="runTaskDescription">Task Description</Label>
                        <Textarea
                          id="runTaskDescription"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder="Describe what you want the agent to do..."
                          rows={4}
                        />
                      </div>
                      {includeContext && (
                        <div className="space-y-2">
                          <Label htmlFor="runContext">Context</Label>
                          <Textarea
                            id="runContext"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Provide additional context..."
                            rows={3}
                          />
                        </div>
                      )}
                      <Button
                        onClick={handleRunAgent}
                        disabled={!taskDescription || loading}
                        className="w-full"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        {loading ? "Running..." : "Run Agent"}
                      </Button>
                      {lastResponse && (
                        <div className="mt-4">
                          <Separator className="my-4" />
                          <Label>Agent Response:</Label>
                          <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-2">
                            <pre className="whitespace-pre-wrap">{lastResponse}</pre>
                          </ScrollArea>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                      <List className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Agent Selected</h3>
                      <p className="text-muted-foreground">
                        Select an agent from the list to run it
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentManager;
