
import React, { useState } from 'react';
import { useAPIKeys } from '@/hooks/useAPIKeys';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Key, Check, AlertCircle } from 'lucide-react';

const APIKeysDemo: React.FC = () => {
  const { availableAPIs, hasAPIKey, getAPIKey, makeAPIRequest, isLoading, getAPICredentials } = useAPIKeys();
  const [selectedAPI, setSelectedAPI] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string>('');

  const handleTestKey = async () => {
    if (!selectedAPI) return;
    
    const { endpoint } = getAPICredentials(selectedAPI);
    if (!endpoint) return;
    
    const result = await makeAPIRequest(selectedAPI, endpoint, { method: 'GET' });
    setTestResponse(JSON.stringify(result, null, 2));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys Management Demo</CardTitle>
        <CardDescription>
          This demo shows how to access and use your stored API keys securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Available APIs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableAPIs.length > 0 ? (
                availableAPIs.map(api => (
                  <div 
                    key={api}
                    className={`p-2 border rounded-md cursor-pointer flex items-center space-x-2 ${
                      selectedAPI === api ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setSelectedAPI(api)}
                  >
                    <Key className="h-4 w-4" />
                    <span>{api}</span>
                    {hasAPIKey(api) ? (
                      <Check className="h-4 w-4 text-green-500 ml-auto" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 ml-auto" />
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
            <div className="p-4 border rounded-md bg-secondary/20">
              <h3 className="text-sm font-medium mb-2">Selected API: {selectedAPI}</h3>
              
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">API Key Status:</p>
                {hasAPIKey(selectedAPI) ? (
                  <div className="flex items-center text-sm text-green-500">
                    <Check className="h-4 w-4 mr-1" />
                    API Key is available and securely stored
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-amber-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    No API Key found
                  </div>
                )}
              </div>
              
              <Button 
                size="sm" 
                onClick={handleTestKey}
                disabled={!hasAPIKey(selectedAPI) || isLoading(selectedAPI)}
              >
                {isLoading(selectedAPI) && (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                )}
                Test API Key
              </Button>
            </div>
          )}
          
          {testResponse && (
            <div>
              <h3 className="text-sm font-medium mb-2">API Response:</h3>
              <pre className="bg-black/20 p-4 rounded-md overflow-auto max-h-40 text-xs">
                {testResponse}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeysDemo;
