
import React, { useState } from 'react';
import { useAPIKeys } from '@/hooks/useAPIKeys';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader, 
  Key, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Clipboard, 
  Clock,
  ShieldAlert,
  RefreshCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const APIKeysDemo: React.FC = () => {
  const { 
    availableAPIs, 
    hasAPIKey, 
    getAPIKey, 
    makeAPIRequest, 
    isLoading, 
    getAPICredentials,
    toggleKeyVisibility,
    isKeyVisible,
    getMaskedAPIKey,
    copyAPIKeyToClipboard,
    getLastUsed,
    setAPIKey
  } = useAPIKeys();
  
  const [selectedAPI, setSelectedAPI] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string>('');
  const [newApiKey, setNewApiKey] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTestKey = async () => {
    if (!selectedAPI) return;
    
    const { endpoint } = getAPICredentials(selectedAPI);
    if (!endpoint) return;
    
    const result = await makeAPIRequest(selectedAPI, endpoint, { method: 'GET' });
    setTestResponse(JSON.stringify(result, null, 2));
  };

  const handleUpdateKey = () => {
    if (!selectedAPI || !newApiKey.trim()) return;
    
    setAPIKey(selectedAPI, newApiKey.trim());
    setNewApiKey('');
    setIsUpdating(false);
  };

  const lastUsed = selectedAPI ? getLastUsed(selectedAPI) : undefined;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>API Keys Management</CardTitle>
          <CardDescription>
            Securely access and manage your stored API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Available APIs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {availableAPIs.length > 0 ? (
                  availableAPIs.map(api => (
                    <div 
                      key={api}
                      className={`p-3 border rounded-md cursor-pointer transition-colors hover:bg-primary/5 flex items-center space-x-2 ${
                        selectedAPI === api ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setSelectedAPI(api)}
                    >
                      <Key className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{api}</span>
                      {hasAPIKey(api) ? (
                        <Check className="h-4 w-4 text-green-500 ml-auto flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500 ml-auto flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground col-span-full">
                    No APIs configured yet. Add an API first.
                  </p>
                )}
              </div>
            </div>
            
            {selectedAPI && (
              <div className="p-4 border rounded-md bg-secondary/10 space-y-4">
                <h3 className="text-base font-medium">API: {selectedAPI}</h3>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">API Key Status:</p>
                    {hasAPIKey(selectedAPI) ? (
                      <div className="flex items-center text-sm text-green-500">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-amber-500">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>Not set</span>
                      </div>
                    )}
                  </div>
                  
                  {lastUsed && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Last used: {format(lastUsed, 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  )}
                </div>
                
                {hasAPIKey(selectedAPI) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">API Key:</p>
                      <div className="flex space-x-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => toggleKeyVisibility(selectedAPI)}
                            >
                              {isKeyVisible(selectedAPI) ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {isKeyVisible(selectedAPI) ? 'Hide API key' : 'Show API key'}
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => copyAPIKeyToClipboard(selectedAPI)}
                            >
                              <Clipboard className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Copy to clipboard
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-secondary/20 px-3 py-2 rounded-md text-sm font-mono">
                      <ShieldAlert className="h-3 w-3 mr-2 text-amber-500" />
                      <span className="truncate">
                        {getMaskedAPIKey(selectedAPI)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  {isUpdating ? (
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Enter new API key..."
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                      />
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={handleUpdateKey}
                          disabled={!newApiKey.trim()}
                        >
                          Save Key
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setIsUpdating(false);
                            setNewApiKey('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant={hasAPIKey(selectedAPI) ? "outline" : "default"} 
                        onClick={() => setIsUpdating(true)}
                      >
                        {hasAPIKey(selectedAPI) ? "Update Key" : "Add Key"}
                      </Button>
                      
                      {hasAPIKey(selectedAPI) && (
                        <Button 
                          size="sm" 
                          onClick={handleTestKey}
                          disabled={isLoading(selectedAPI)}
                        >
                          {isLoading(selectedAPI) ? (
                            <>
                              <Loader className="h-4 w-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Test Connection
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {testResponse && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">API Response:</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTestResponse('')}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
                <pre className="bg-black/10 dark:bg-white/5 p-4 rounded-md overflow-auto max-h-60 text-xs">
                  {testResponse}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default APIKeysDemo;
