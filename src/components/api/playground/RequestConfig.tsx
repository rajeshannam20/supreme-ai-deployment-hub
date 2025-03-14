
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface RequestConfigProps {
  endpoint: string;
  onEndpointChange: (endpoint: string) => void;
  requestBody: string;
  onRequestBodyChange: (body: string) => void;
  headers: string;
  onHeadersChange: (headers: string) => void;
  method: string;
}

const RequestConfig: React.FC<RequestConfigProps> = ({
  endpoint,
  onEndpointChange,
  requestBody,
  onRequestBodyChange,
  headers,
  onHeadersChange,
  method
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Endpoint URL</label>
        <Input 
          placeholder="https://api.example.com/v1/resource" 
          value={endpoint} 
          onChange={e => onEndpointChange(e.target.value)}
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
            onChange={e => onRequestBodyChange(e.target.value)}
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
            onChange={e => onHeadersChange(e.target.value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestConfig;
