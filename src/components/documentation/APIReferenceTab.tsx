
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const APIReferenceTab: React.FC = () => {
  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>API Reference Documentation</CardTitle>
          <CardDescription>Detailed reference for all DEVONN.AI functions and methods</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Visit our <a href="/api" className="text-primary hover:underline">complete API documentation</a> for detailed information on all available endpoints and methods.</p>
          
          <h3 className="text-lg font-semibold mt-4">Core API Methods</h3>
          <div className="overflow-x-auto mt-2">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-mono">generate()</td>
                  <td className="py-2">Generates code based on a prompt</td>
                  <td className="py-2 font-mono text-xs">ai.generate({'{'} prompt: '...' {'}'})</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">enhance()</td>
                  <td className="py-2">Improves existing code</td>
                  <td className="py-2 font-mono text-xs">ai.enhance({'{'} code: '...', instruction: '...' {'}'})</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">explain()</td>
                  <td className="py-2">Analyzes and explains code</td>
                  <td className="py-2 font-mono text-xs">ai.explain({'{'} code: '...' {'}'})</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">debug()</td>
                  <td className="py-2">Identifies and fixes issues</td>
                  <td className="py-2 font-mono text-xs">ai.debug({'{'} code: '...', error: '...' {'}'})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIReferenceTab;
