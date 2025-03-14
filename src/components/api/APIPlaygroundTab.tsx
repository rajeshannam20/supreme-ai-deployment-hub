
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const APIPlaygroundTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Playground</CardTitle>
        <CardDescription>Test API endpoints interactively</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">API Playground coming soon!</p>
          <p className="text-sm">This feature will allow you to test API calls directly from the browser.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIPlaygroundTab;
