
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ResponseDisplayProps {
  response: string;
  status: string;
  onSaveResponse: () => void;
  hasValidResponse: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
  status,
  onSaveResponse,
  hasValidResponse
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Response</h3>
        
        {hasValidResponse && (
          <Button 
            onClick={onSaveResponse} 
            variant="outline" 
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Response
          </Button>
        )}
      </div>
      
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
  );
};

export default ResponseDisplay;
