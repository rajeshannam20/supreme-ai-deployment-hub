
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAPI } from '@/contexts/APIContext';

const APIPlaygroundTab: React.FC = () => {
  const { apiConfigs } = useAPI();
  const [selectedAPI, setSelectedAPI] = useState<string>('');
  const [method, setMethod] = useState<string>('GET');
  const [endpoint, setEndpoint] = useState<string>('');
  const [requestBody, setRequestBody] = useState<string>('');
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectAPI = (apiName: string) => {
    setSelectedAPI(apiName);
    const config = apiConfigs.find(c => c.name === apiName);
    if (config) {
      setEndpoint(config.endpoint);
      
      // If the API has an API key, add it to the headers
      if (config.apiKey) {
        setHeaders(prev => {
          try {
            const headersObj = JSON.parse(prev);
            return JSON.stringify({
              ...headersObj,
              "Authorization": `Bearer ${config.apiKey}`
            }, null, 2);
          } catch (e) {
            // If the headers aren't valid JSON, start fresh
            return `{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer ${config.apiKey}"\n}`;
          }
        });
      }
    }
  };

  const sendRequest = async () => {
    try {
      setLoading(true);
      setResponse('');
      setStatus('');

      // Validate headers JSON
      let headersObj = {};
      try {
        headersObj = JSON.parse(headers);
      } catch (e) {
        toast.error('Invalid headers JSON format');
        setLoading(false);
        return;
      }

      // Validate request body if not GET
      let bodyData = undefined;
      if (method !== 'GET' && requestBody) {
        try {
          bodyData = JSON.parse(requestBody);
        } catch (e) {
          toast.error('Invalid request body JSON format');
          setLoading(false);
          return;
        }
      }

      // Build fetch options
      const options: RequestInit = {
        method,
        headers: headersObj as HeadersInit,
      };

      if (method !== 'GET' && bodyData) {
        options.body = JSON.stringify(bodyData);
      }

      // Send the request
      const fetchResponse = await fetch(endpoint, options);
      const statusText = `${fetchResponse.status} ${fetchResponse.statusText}`;
      setStatus(statusText);

      // Try to parse as JSON first
      try {
        const data = await fetchResponse.json();
        setResponse(JSON.stringify(data, null, 2));
      } catch (e) {
        // If not JSON, get as text
        const text = await fetchResponse.text();
        setResponse(text);
      }

      if (fetchResponse.ok) {
        toast.success(`Request successful: ${statusText}`);
      } else {
        toast.error(`Request failed: ${statusText}`);
      }
    } catch (error) {
      console.error('API request error:', error);
      setStatus('Request failed');
      setResponse(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('Request failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Playground</CardTitle>
        <CardDescription>Test API endpoints interactively</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">API Connection</label>
                <Select value={selectedAPI} onValueChange={handleSelectAPI}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select API connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiConfigs.length === 0 ? (
                      <SelectItem value="none" disabled>No API connections configured</SelectItem>
                    ) : (
                      apiConfigs.map(config => (
                        <SelectItem key={config.name} value={config.name}>
                          {config.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">HTTP Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="HTTP Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Endpoint URL</label>
              <Input 
                placeholder="https://api.example.com/v1/resource" 
                value={endpoint} 
                onChange={e => setEndpoint(e.target.value)}
              />
            </div>

            <Tabs defaultValue="body" className="w-full">
              <TabsList>
                <TabsTrigger value="body">Request Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="body" className="pt-4">
                <Textarea 
                  placeholder={`{\n  "key": "value"\n}`}
                  className="font-mono min-h-[150px]"
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  disabled={method === 'GET'}
                />
                {method === 'GET' && (
                  <p className="text-sm text-muted-foreground mt-2">Request body not applicable for GET requests</p>
                )}
              </TabsContent>
              <TabsContent value="headers" className="pt-4">
                <Textarea 
                  placeholder={`{\n  "Content-Type": "application/json"\n}`}
                  className="font-mono min-h-[150px]"
                  value={headers}
                  onChange={e => setHeaders(e.target.value)}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button onClick={sendRequest} disabled={!endpoint || loading}>
                {loading ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Response</h3>
            
            {status && (
              <div className={`text-sm px-3 py-1 rounded-md inline-block ${
                status.startsWith('2') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                Status: {status}
              </div>
            )}
            
            <div className="bg-secondary rounded-md p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap break-words min-h-[200px] max-h-[400px] overflow-auto">
                {response || 'Response will appear here'}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIPlaygroundTab;
