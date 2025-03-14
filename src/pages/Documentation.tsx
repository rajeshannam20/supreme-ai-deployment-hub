
import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Documentation: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Documentation - DEVONN.AI</title>
      </Helmet>
      <Container>
        <SectionHeading
          subheading="Detailed guides and references to help you get the most out of DEVONN.AI"
        >
          Documentation
        </SectionHeading>

        <div className="mt-8">
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="reference">API Reference</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Installation</CardTitle>
                  <CardDescription>Set up DEVONN.AI in your environment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Node.js 16.0 or higher</li>
                    <li>npm 7.0 or higher (or yarn/pnpm)</li>
                    <li>Python 3.8 or higher (for certain features)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4">Quick Install</h3>
                  <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                    <code>npm install devonn-ai</code>
                  </pre>

                  <h3 className="text-lg font-semibold mt-4">Basic Setup</h3>
                  <p>After installation, initialize DEVONN.AI in your project:</p>
                  <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                    <code>{`
import { DevonnAI } from 'devonn-ai';

// Initialize with your API key
const ai = new DevonnAI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Now you can use the AI in your application
const response = await ai.generate({ 
  prompt: 'Create a React component for a login form'
});
                    `}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Concepts</CardTitle>
                  <CardDescription>Understand the core principles behind DEVONN.AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Intelligent Code Generation</h3>
                    <p>DEVONN.AI analyzes your project structure, coding style, and requirements to generate contextually appropriate code.</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-semibold">Context Awareness</h3>
                    <p>The AI maintains an understanding of your codebase, allowing it to make consistent and integrated suggestions.</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-semibold">Framework Agnostic</h3>
                    <p>DEVONN.AI works with most popular frameworks and libraries, including React, Vue, Angular, and many more.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Building Your First AI-Enhanced App</CardTitle>
                  <CardDescription>Step-by-step guide to creating an application with DEVONN.AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">1. Project Setup</h3>
                    <p>Create a new project and install the DEVONN.AI package as described in the installation guide.</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-semibold">2. Configure AI Settings</h3>
                    <p>Set up your AI configuration with your API key and preferred settings.</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-semibold">3. Define Your Requirements</h3>
                    <p>Clearly describe what you want to build in natural language or using our special syntax.</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-semibold">4. Generate Initial Code</h3>
                    <p>Use the DEVONN.AI to generate the foundation of your application.</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-semibold">5. Refine and Iterate</h3>
                    <p>Review the generated code, provide feedback, and let the AI make adjustments based on your input.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Techniques</CardTitle>
                  <CardDescription>Maximize your productivity with these best practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="border-b pb-3">
                      <h3 className="font-semibold">Custom Templates</h3>
                      <p className="text-sm text-muted-foreground">Define and use your own templates to maintain consistency across your projects.</p>
                    </li>
                    <li className="border-b pb-3">
                      <h3 className="font-semibold">Integration with CI/CD</h3>
                      <p className="text-sm text-muted-foreground">Automate code generation and reviews as part of your continuous integration pipeline.</p>
                    </li>
                    <li className="border-b pb-3">
                      <h3 className="font-semibold">Custom Fine-tuning</h3>
                      <p className="text-sm text-muted-foreground">Train the AI on your specific codebase to improve relevance and quality of suggestions.</p>
                    </li>
                    <li>
                      <h3 className="font-semibold">Team Collaboration</h3>
                      <p className="text-sm text-muted-foreground">Configure shared settings and standards for consistent AI-generated code across your team.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reference" className="mt-6">
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
                          <td className="py-2 font-mono text-xs">ai.generate({ prompt: '...' })</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-mono">enhance()</td>
                          <td className="py-2">Improves existing code</td>
                          <td className="py-2 font-mono text-xs">ai.enhance({ code: '...', instruction: '...' })</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-mono">explain()</td>
                          <td className="py-2">Analyzes and explains code</td>
                          <td className="py-2 font-mono text-xs">ai.explain({ code: '...' })</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono">debug()</td>
                          <td className="py-2">Identifies and fixes issues</td>
                          <td className="py-2 font-mono text-xs">ai.debug({ code: '...', error: '...' })</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Example Projects</CardTitle>
                  <CardDescription>Learn from complete, working examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold">Todo App</h3>
                      <p className="text-sm text-muted-foreground mb-2">A simple todo application with React and DEVONN.AI</p>
                      <a href="#" className="text-primary hover:underline text-sm">View Source</a>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold">E-commerce Dashboard</h3>
                      <p className="text-sm text-muted-foreground mb-2">Admin dashboard with data visualization</p>
                      <a href="#" className="text-primary hover:underline text-sm">View Source</a>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold">AI Chatbot</h3>
                      <p className="text-sm text-muted-foreground mb-2">Responsive chatbot interface with conversation history</p>
                      <a href="#" className="text-primary hover:underline text-sm">View Source</a>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold">Form Validation</h3>
                      <p className="text-sm text-muted-foreground mb-2">Advanced form with validation and error handling</p>
                      <a href="#" className="text-primary hover:underline text-sm">View Source</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Code Snippets</CardTitle>
                  <CardDescription>Ready-to-use code snippets for common tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Authentication System</h3>
                      <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                        <code>{`
import { DevonnAI } from 'devonn-ai';

const authSystem = await ai.generate({
  prompt: 'Create a secure authentication system with JWT',
  framework: 'react',
  includeTests: true
});

console.log(authSystem.files); // List of generated files
                        `}</code>
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">API Integration</h3>
                      <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                        <code>{`
// Generate a service to connect to a REST API
const apiService = await ai.generate({
  prompt: 'Create a service to fetch and manage products from a REST API',
  apiSpec: './swagger.json', // Optional: provide API specification
  caching: true // Enable result caching
});
                        `}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default Documentation;
