
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAPIPlayground } from '@/hooks/useAPIPlayground';
import APISelector from './playground/APISelector';
import MethodSelector from './playground/MethodSelector';
import RequestConfig from './playground/RequestConfig';
import ResponseDisplay from './playground/ResponseDisplay';

interface APIPlaygroundTabProps {
  onSaveResponse?: (
    apiName: string, 
    method: string, 
    endpoint: string, 
    status: string, 
    response: string
  ) => void;
}

const APIPlaygroundTab: React.FC<APIPlaygroundTabProps> = ({ onSaveResponse }) => {
  const {
    state,
    handleSelectAPI,
    setMethod,
    setEndpoint,
    setRequestBody,
    setHeaders,
    sendRequest,
    handleSaveResponse
  } = useAPIPlayground({ onSaveResponse });

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
              <APISelector 
                selectedAPI={state.selectedAPI} 
                onSelectAPI={handleSelectAPI} 
              />
              <MethodSelector 
                method={state.method} 
                onMethodChange={setMethod} 
              />
            </div>

            <RequestConfig 
              endpoint={state.endpoint}
              onEndpointChange={setEndpoint}
              requestBody={state.requestBody}
              onRequestBodyChange={setRequestBody}
              headers={state.headers}
              onHeadersChange={setHeaders}
              method={state.method}
            />

            <div className="flex justify-end">
              <Button onClick={sendRequest} disabled={!state.endpoint || state.loading}>
                {state.loading ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>

          <Separator />

          <ResponseDisplay 
            response={state.response}
            status={state.status}
            onSaveResponse={handleSaveResponse}
            hasValidResponse={!!(state.response && state.status && state.selectedAPI)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default APIPlaygroundTab;
