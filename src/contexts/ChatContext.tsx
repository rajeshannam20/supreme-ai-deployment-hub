
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useDeployment } from './DeploymentContext';
import { useAPI } from './APIContext';

// Define types for our chat system
type MessageType = 'text' | 'buttons' | 'links' | 'image';

interface ChatButton {
  id: string;
  label: string;
  action: () => void;
}

interface ChatLink {
  url: string;
  label: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: MessageType;
  buttons?: ChatButton[];
  links?: ChatLink[];
  imageUrl?: string;
  feedback?: 'positive' | 'negative' | null;
}

interface Intent {
  type: string;
  confidence: number;
}

interface Process {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'terminated';
  priority: number;
  cpuUsage: number;
  memoryUsage: number;
  startTime: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  processes: Process[];
  isProcessing: boolean;
  sendMessage: (content: string) => void;
  provideFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  clearConversation: () => void;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample intents our system can detect
const INTENTS = [
  'greeting',
  'help',
  'pricing',
  'features',
  'demo',
  'deployment',
  'technical',
  'farewell',
  'api',
  'status',
];

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getDeploymentSummary, isConnected: isClusterConnected } = useDeployment();
  const { apiConfigs, isAnyAPIConnected } = useAPI();
  
  // Initialize some sample processes
  useEffect(() => {
    const initialProcesses: Process[] = [
      {
        id: '1',
        name: 'Intent Analyzer',
        status: 'running',
        priority: 8,
        cpuUsage: 15,
        memoryUsage: 120,
        startTime: new Date(),
      },
      {
        id: '2',
        name: 'Natural Language Processor',
        status: 'running',
        priority: 9,
        cpuUsage: 25,
        memoryUsage: 180,
        startTime: new Date(),
      },
      {
        id: '3',
        name: 'Response Generator',
        status: 'running',
        priority: 7,
        cpuUsage: 10,
        memoryUsage: 90,
        startTime: new Date(),
      },
      {
        id: '4',
        name: 'API Integration Manager',
        status: 'running',
        priority: 6,
        cpuUsage: 8,
        memoryUsage: 75,
        startTime: new Date(),
      },
    ];

    setProcesses(initialProcesses);
    
    // Add an initial welcome message
    const welcomeMessage: ChatMessage = {
      id: '0',
      content: "Welcome to DEVONN.AI Assistant. How can I help you with your AI deployment and integration needs today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Simulate intent detection
  const detectIntent = (message: string): Intent => {
    // Simple keyword matching for demo purposes
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return { type: 'greeting', confidence: 0.9 };
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return { type: 'pricing', confidence: 0.8 };
    }
    
    if (lowerMessage.includes('feature') || lowerMessage.includes('can do')) {
      return { type: 'features', confidence: 0.85 };
    }
    
    if ((lowerMessage.includes('how') && lowerMessage.includes('deploy')) || 
         lowerMessage.includes('deployment')) {
      return { type: 'deployment', confidence: 0.95 };
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return { type: 'farewell', confidence: 0.9 };
    }
    
    if (lowerMessage.includes('help')) {
      return { type: 'help', confidence: 0.95 };
    }
    
    if (lowerMessage.includes('api') || lowerMessage.includes('connect') || 
        lowerMessage.includes('integration') || lowerMessage.includes('service')) {
      return { type: 'api', confidence: 0.9 };
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('how are') || 
        lowerMessage.includes('what\'s happening')) {
      return { type: 'status', confidence: 0.85 };
    }
    
    // Default to technical intent for anything else
    return { type: 'technical', confidence: 0.6 };
  };

  // Generate a response based on detected intent
  const generateResponse = (intent: Intent, message: string): ChatMessage => {
    let response: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      content: "",
    };
    
    switch (intent.type) {
      case 'greeting':
        response.content = "Hello! Welcome to DEVONN.AI. I'm your AI assistant for deploying AI systems and managing API integrations. How can I help you today?";
        break;
        
      case 'help':
        response.content = "I can help you with deploying AI systems, managing Kubernetes clusters, connecting to APIs, monitoring services, and more. What specific assistance do you need?";
        response.type = 'buttons';
        response.buttons = [
          { id: 'b1', label: 'Deployment Help', action: () => sendMessage("How do I deploy an AI system?") },
          { id: 'b2', label: 'API Integration', action: () => sendMessage("How can I connect to external APIs?") },
          { id: 'b3', label: 'Cluster Management', action: () => sendMessage("Tell me about cluster management") },
          { id: 'b4', label: 'System Status', action: () => sendMessage("What's the current status?") },
        ];
        break;
        
      case 'pricing':
        response.content = "DEVONN.AI offers several pricing tiers based on your deployment and integration needs:";
        response.type = 'links';
        response.links = [
          { url: "#", label: "Basic Plan - $99/month" },
          { url: "#", label: "Professional Plan - $299/month" },
          { url: "#", label: "Enterprise Plan - Custom pricing" },
        ];
        break;
        
      case 'features':
        response.content = "DEVONN.AI offers the following key features:";
        response.type = 'text';
        response.content += "\n\n• Kubernetes deployment orchestration\n• External API integration\n• Service monitoring and observability\n• Istio service mesh integration\n• Kong API gateway management\n• Canary deployments with Argo Rollouts\n• Comprehensive logging system";
        break;
        
      case 'deployment':
        response.content = "To deploy an AI system using DEVONN.AI, navigate to the Deployment Dashboard where you can connect to your Kubernetes cluster and follow our step-by-step deployment process. Would you like me to walk you through it?";
        if (isClusterConnected) {
          response.content += "\n\nI notice you're already connected to a Kubernetes cluster. " + getDeploymentSummary();
        }
        break;
        
      case 'api':
        if (apiConfigs.length > 0) {
          response.content = `I see you have ${apiConfigs.length} API configurations set up. `;
          if (isAnyAPIConnected) {
            const connectedApis = apiConfigs.filter(api => api.isConnected);
            response.content += `${connectedApis.length} of them are currently connected.`;
          } else {
            response.content += "None of them are currently connected.";
          }
          response.content += "\n\nYou can manage your API connections by clicking on the API Management section. Would you like to add a new API connection?";
        } else {
          response.content = "To connect to external APIs, you can use our API Management section. Would you like to add a new API connection now?";
        }
        response.type = 'buttons';
        response.buttons = [
          { id: 'api1', label: 'Add New API', action: () => {
              // This would normally navigate to the API management page
              toast.info("Navigate to API Management to add new APIs");
            } 
          },
          { id: 'api2', label: 'View API Status', action: () => sendMessage("What's the status of my APIs?") },
        ];
        break;

      case 'status':
        response.content = "Here's the current status of your DEVONN.AI system:\n\n";
        
        // Add deployment status if available
        response.content += getDeploymentSummary() + "\n\n";
        
        // Add API status if there are any configured
        if (apiConfigs.length > 0) {
          response.content += `API Integrations: ${apiConfigs.length} configured, ${apiConfigs.filter(api => api.isConnected).length} connected.\n\n`;
        } else {
          response.content += "API Integrations: None configured.\n\n";
        }
        
        // Add system process status
        const runningProcesses = processes.filter(p => p.status === 'running').length;
        response.content += `System Processes: ${runningProcesses}/${processes.length} running.`;
        break;
        
      case 'technical':
        response.content = "I understand you have a technical question. DEVONN.AI supports various technologies including Kubernetes, Istio, Kong, Prometheus, Grafana, Jaeger, and external API integrations. Could you provide more specific details about your question?";
        break;
        
      case 'farewell':
        response.content = "Thank you for using DEVONN.AI Assistant. If you need any further assistance with deployments or API integrations, feel free to ask. Have a great day!";
        break;
        
      default:
        response.content = "I'm not sure I understand. Could you rephrase your question or select from common topics?";
        response.type = 'buttons';
        response.buttons = [
          { id: 'b1', label: 'Deployment', action: () => sendMessage("Tell me about deployment") },
          { id: 'b2', label: 'API Integration', action: () => sendMessage("How do I connect APIs?") },
          { id: 'b3', label: 'Help', action: () => sendMessage("I need help") },
        ];
    }
    
    return response;
  };

  // Update process statistics periodically to simulate system activity
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prevProcesses => 
        prevProcesses.map(process => ({
          ...process,
          cpuUsage: Math.min(100, Math.max(5, process.cpuUsage + (Math.random() * 10 - 5))),
          memoryUsage: Math.min(500, Math.max(50, process.memoryUsage + (Math.random() * 20 - 10))),
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Send a message
  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Create and add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const intent = detectIntent(content);
      
      // Log the detected intent (in a real system this would be internal)
      console.log(`Detected intent: ${intent.type} with confidence ${intent.confidence}`);
      
      // Generate and add AI response
      const aiResponse = generateResponse(intent, content);
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      
      // Show toast notification for new message
      toast.info("New message from DEVONN.AI Assistant");
    }, 1500);
  };

  // Provide feedback on a message
  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback } 
          : msg
      )
    );
    
    toast.success(`Thank you for your feedback!`);
  };

  // Clear conversation history
  const clearConversation = () => {
    // Keep only the welcome message
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    toast.info("Conversation history cleared");
  };

  // Expose chat API through window object for external access
  useEffect(() => {
    const api = {
      sendMessage,
      getMessages: () => messages,
      clearConversation,
    };
    
    // @ts-ignore
    window.DevonnAIChat = api;
    
    return () => {
      // @ts-ignore
      delete window.DevonnAIChat;
    };
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        processes,
        isProcessing,
        sendMessage,
        provideFeedback,
        clearConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
