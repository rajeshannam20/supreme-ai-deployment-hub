
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

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
  const isGetMethod = method === 'GET';
  
  // Example templates for different content types
  const jsonTemplate = '{\n  "key": "value"\n}';
  const formDataTemplate = 'key1=value1&key2=value2';
  
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <label className="text-sm font-medium mb-2 block">Endpoint URL</label>
        <Input 
          placeholder="https://api.example.com/v1/resource" 
          value={endpoint} 
          onChange={e => onEndpointChange(e.target.value)}
          className="font-mono text-sm"
        />
      </div>

      <Tabs defaultValue="body" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="body">Request Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="body" className="pt-4 space-y-4">
          {isGetMethod && (
            <Alert variant="default" className="bg-muted/50">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Request body is not applicable for GET requests. Use URL parameters instead.
              </AlertDescription>
            </Alert>
          )}
          
          <Textarea 
            placeholder={jsonTemplate}
            className="font-mono min-h-[150px] text-sm"
            value={requestBody}
            onChange={e => onRequestBodyChange(e.target.value)}
            disabled={isGetMethod}
          />
          
          {!isGetMethod && (
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Example formats:</p>
              <div className="space-y-1">
                <div><strong>JSON:</strong> {jsonTemplate}</div>
                <div><strong>Form Data:</strong> {formDataTemplate}</div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="headers" className="pt-4">
          <Textarea 
            placeholder={'{\n  "Content-Type": "application/json"\n}'}
            className="font-mono min-h-[150px] text-sm"
            value={headers}
            onChange={e => onHeadersChange(e.target.value)}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Common headers:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Content-Type: application/json</li>
              <li>Authorization: Bearer &lt;token&gt;</li>
              <li>Accept: application/json</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default RequestConfig;
