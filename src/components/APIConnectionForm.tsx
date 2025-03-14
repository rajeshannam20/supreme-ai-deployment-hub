
import React, { useState } from 'react';
import { useAPI } from '@/contexts/APIContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, RotateCw, Check, X } from 'lucide-react';

const APIConnectionForm: React.FC = () => {
  const { apiConfigs, addAPIConfig, removeAPIConfig, testConnection } = useAPI();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: '',
    endpoint: '',
    apiKey: '',
    description: ''
  });
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const handleAddAPI = () => {
    if (!newConfig.name || !newConfig.endpoint) return;
    
    addAPIConfig({
      name: newConfig.name,
      endpoint: newConfig.endpoint,
      apiKey: newConfig.apiKey || undefined,
      description: newConfig.description || 'No description provided.'
    });
    
    // Reset form
    setNewConfig({
      name: '',
      endpoint: '',
      apiKey: '',
      description: ''
    });
    
    setIsAddDialogOpen(false);
  };

  const handleTestConnection = async (name: string) => {
    setTestingConnection(name);
    await testConnection(name);
    setTestingConnection(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">API Connections</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add API
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New API Connection</DialogTitle>
              <DialogDescription>
                Configure a new API endpoint to connect with DEVONN.AI
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-name">API Name</Label>
                <Input 
                  id="api-name" 
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                  placeholder="e.g., Weather API, OpenAI API"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input 
                  id="api-endpoint" 
                  value={newConfig.endpoint}
                  onChange={(e) => setNewConfig({...newConfig, endpoint: e.target.value})}
                  placeholder="https://api.example.com/v1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input 
                  id="api-key" 
                  type="password"
                  value={newConfig.apiKey}
                  onChange={(e) => setNewConfig({...newConfig, apiKey: e.target.value})}
                  placeholder="Your API key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-description">Description (Optional)</Label>
                <Textarea 
                  id="api-description" 
                  value={newConfig.description}
                  onChange={(e) => setNewConfig({...newConfig, description: e.target.value})}
                  placeholder="What this API is used for"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAPI} disabled={!newConfig.name || !newConfig.endpoint}>
                Add API
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Separator />
      
      {apiConfigs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No API connections configured yet.</p>
          <p className="text-sm">Add an API connection to integrate external services with DEVONN.AI</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {apiConfigs.map((config) => (
            <Card key={config.name} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-md">{config.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{config.endpoint}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    {config.isConnected ? (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm py-2">
                <p className="line-clamp-2 text-muted-foreground">{config.description}</p>
                {config.lastConnected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last connected: {config.lastConnected.toLocaleString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeAPIConfig(config.name)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleTestConnection(config.name)}
                  disabled={testingConnection === config.name}
                >
                  {testingConnection === config.name ? (
                    <>
                      <RotateCw className="h-4 w-4 mr-1 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <RotateCw className="h-4 w-4 mr-1" />
                      Test Connection
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default APIConnectionForm;
