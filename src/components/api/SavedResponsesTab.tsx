
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SavedAPIResponse } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface SavedResponsesTabProps {
  savedResponses: SavedAPIResponse[];
  onDeleteResponse: (id: string) => void;
}

const SavedResponsesTab: React.FC<SavedResponsesTabProps> = ({ 
  savedResponses, 
  onDeleteResponse 
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (savedResponses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Responses</CardTitle>
          <CardDescription>View and manage your saved API responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-2">No saved responses yet</p>
            <p className="text-sm text-muted-foreground">
              Use the API Playground to test endpoints and save responses for future reference
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Responses</CardTitle>
        <CardDescription>View and manage your saved API responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {savedResponses.map((saved) => (
            <div key={saved.id} className="border rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{saved.apiName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      saved.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      saved.method === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      saved.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      saved.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {saved.method}
                    </span>
                    <span>{saved.endpoint}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(saved.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm px-2 py-0.5 rounded-md ${
                    saved.status.startsWith('2') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    Status: {saved.status}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(saved.response)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onDeleteResponse(saved.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                
                <div className="bg-secondary rounded-md p-4 overflow-hidden">
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words max-h-[200px] overflow-auto">
                    {saved.response}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedResponsesTab;
