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
  entities?: Entity[];
}

interface Entity {
  type: string;
  value: string;
  position: {
    start: number;
    end: number;
  };
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

// Enhanced intents our system can detect
const INTENTS = [
  { name: 'greeting', keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'] },
  { name: 'help', keywords: ['help', 'assist', 'support', 'guide', 'how to', 'how do i'] },
  { name: 'pricing', keywords: ['price', 'cost', 'billing', 'subscription', 'pay', 'money', 'fee'] },
  { name: 'features', keywords: ['feature', 'capability', 'can do', 'functionality', 'what does', 'what can'] },
  { name: 'deployment', keywords: ['deploy', 'deployment', 'install', 'setup', 'configure', 'kubernetes', 'k8s'] },
  { name: 'technical', keywords: ['code', 'api', 'integration', 'architecture', 'infrastructure', 'microservice'] },
  { name: 'farewell', keywords: ['bye', 'goodbye', 'see you', 'farewell', 'exit', 'close'] },
  { name: 'api', keywords: ['api', 'endpoint', 'connect', 'integration', 'service', 'webhook'] },
  { name: 'status', keywords: ['status', 'health', 'monitor', 'metrics', 'how is', 'how are', 'what\'s happening'] },
];

// Entity types our system can recognize
const ENTITY_TYPES = {
  SERVICE: 'service',
  PLATFORM: 'platform',
  TIME_PERIOD: 'time_period',
  NUMBER: 'number',
  ACTION: 'action',
};

// Service entities our system recognizes
const SERVICE_ENTITIES = [
  'kubernetes', 'k8s', 'istio', 'prometheus', 'grafana', 'jaeger', 'kong', 'argo', 'helm',
];

// Platform entities
const PLATFORM_ENTITIES = [
  'aws', 'gcp', 'azure', 'google cloud', 'amazon', 'microsoft', 'digital ocean', 'heroku', 'vercel',
];

// Action entities
const ACTION_ENTITIES = [
  'create', 'update', 'delete', 'deploy', 'monitor', 'integrate', 'connect', 'install', 'configure',
];

// Time period entities
const TIME_PERIOD_ENTITIES = [
  'today', 'yesterday', 'this week', 'last week', 'this month', 'last month',
];

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationContext, setConversationContext] = useState<{
    lastIntent?: string;
    mentionedEntities: Record<string, string[]>;
    messageCount: number;
  }>({
    mentionedEntities: {},
    messageCount: 0,
  });
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

  // Extract entities from message
  const extractEntities = (message: string): Entity[] => {
    const entities: Entity[] = [];
    const lowerMessage = message.toLowerCase();
    
    // Extract service entities
    SERVICE_ENTITIES.forEach(service => {
      const serviceRegex = new RegExp(`\\b${service}\\b`, 'gi');
      let match;
      while ((match = serviceRegex.exec(message)) !== null) {
        entities.push({
          type: ENTITY_TYPES.SERVICE,
          value: service,
          position: {
            start: match.index,
            end: match.index + service.length
          }
        });
      }
    });
    
    // Extract platform entities
    PLATFORM_ENTITIES.forEach(platform => {
      const platformRegex = new RegExp(`\\b${platform}\\b`, 'gi');
      let match;
      while ((match = platformRegex.exec(message)) !== null) {
        entities.push({
          type: ENTITY_TYPES.PLATFORM,
          value: platform,
          position: {
            start: match.index,
            end: match.index + platform.length
          }
        });
      }
    });
    
    // Extract action entities
    ACTION_ENTITIES.forEach(action => {
      const actionRegex = new RegExp(`\\b${action}\\b`, 'gi');
      let match;
      while ((match = actionRegex.exec(message)) !== null) {
        entities.push({
          type: ENTITY_TYPES.ACTION,
          value: action,
          position: {
            start: match.index,
            end: match.index + action.length
          }
        });
      }
    });
    
    // Extract time period entities
    TIME_PERIOD_ENTITIES.forEach(period => {
      const periodRegex = new RegExp(`\\b${period}\\b`, 'gi');
      let match;
      while ((match = periodRegex.exec(message)) !== null) {
        entities.push({
          type: ENTITY_TYPES.TIME_PERIOD,
          value: period,
          position: {
            start: match.index,
            end: match.index + period.length
          }
        });
      }
    });
    
    // Extract numbers (could be useful for quantity-related requests)
    const numberMatches = message.match(/\b\d+\b/g);
    if (numberMatches) {
      numberMatches.forEach(num => {
        const numIndex = message.indexOf(num);
        entities.push({
          type: ENTITY_TYPES.NUMBER,
          value: num,
          position: {
            start: numIndex,
            end: numIndex + num.length
          }
        });
      }); 
    }
    
    return entities;
  };

  // Enhanced intent detection with entities and context
  const detectIntent = (message: string): Intent => {
    const lowerMessage = message.toLowerCase();
    const entities = extractEntities(message);
    
    // Keep track of entities for conversation context
    entities.forEach(entity => {
      if (!conversationContext.mentionedEntities[entity.type]) {
        conversationContext.mentionedEntities[entity.type] = [];
      }
      if (!conversationContext.mentionedEntities[entity.type].includes(entity.value)) {
        setConversationContext(prev => ({
          ...prev,
          mentionedEntities: {
            ...prev.mentionedEntities,
            [entity.type]: [...prev.mentionedEntities[entity.type], entity.value]
          }
        }));
      }
    });
    
    // Calculate scores for each intent based on keyword matches
    const intentScores = INTENTS.map(intent => {
      let score = 0;
      let matchCount = 0;
      
      // Check for keyword matches
      intent.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          matchCount++;
          // More specific keywords get higher scores
          score += keyword.length > 3 ? 0.4 : 0.2;
        }
      });
      
      // Adjust score based on message length and match count
      if (matchCount > 0) {
        // Normalize score based on message length (shorter messages with matches are more focused)
        const wordCount = lowerMessage.split(/\s+/).length;
        score = score * (1 + (1 / wordCount));
        
        // Boost score if multiple keywords match
        if (matchCount > 1) {
          score *= (1 + (0.1 * matchCount));
        }
      }
      
      return {
        type: intent.name,
        score: score,
      };
    });
    
    // Consider conversation context for intent detection
    if (conversationContext.lastIntent && conversationContext.messageCount < 5) {
      // If we're in a conversation thread, slightly bias toward same intent family
      intentScores.forEach(intent => {
        if (intent.type === conversationContext.lastIntent) {
          intent.score += 0.1;
        }
      });
    }
    
    // Find highest scoring intent
    const highestIntent = intentScores.reduce((highest, current) => 
      current.score > highest.score ? current : highest, 
      { type: 'technical', score: 0.3 }
    );
    
    // If no strong intent is detected, default to technical
    if (highestIntent.score < 0.3) {
      return { 
        type: 'technical', 
        confidence: 0.6,
        entities
      };
    }
    
    // Update conversation context with the detected intent
    setConversationContext(prev => ({
      ...prev,
      lastIntent: highestIntent.type,
      messageCount: prev.messageCount + 1
    }));
    
    return {
      type: highestIntent.type,
      confidence: Math.min(0.95, highestIntent.score + 0.5), // Convert score to confidence
      entities
    };
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
    
    // Use extracted entities to personalize responses
    const mentionedServices = intent.entities?.filter(e => e.type === ENTITY_TYPES.SERVICE).map(e => e.value) || [];
    const mentionedPlatforms = intent.entities?.filter(e => e.type === ENTITY_TYPES.PLATFORM).map(e => e.value) || [];
    const mentionedActions = intent.entities?.filter(e => e.type === ENTITY_TYPES.ACTION).map(e => e.value) || [];
    
    switch (intent.type) {
      case 'greeting':
        response.content = "Hello! Welcome to DEVONN.AI. I'm your AI assistant for deploying AI systems and managing API integrations. How can I help you today?";
        break;
        
      case 'help':
        if (mentionedServices.length > 0) {
          response.content = `I can help you with ${mentionedServices.join(", ")}. What specifically would you like to know?`;
        } else if (mentionedActions.length > 0) {
          response.content = `I can help you ${mentionedActions.join(", ")} your AI systems. Would you like specific guidance?`;
        } else {
          response.content = "I can help you with deploying AI systems, managing Kubernetes clusters, connecting to APIs, monitoring services, and more. What specific assistance do you need?";
        }
        
        response.type = 'buttons';
        if (mentionedServices.includes('kubernetes') || mentionedServices.includes('k8s')) {
          response.buttons = [
            { id: 'b1', label: 'Kubernetes Deployment', action: () => sendMessage("How do I deploy on Kubernetes?") },
            { id: 'b2', label: 'Cluster Management', action: () => sendMessage("Tell me about cluster management") },
            { id: 'b3', label: 'API Integration', action: () => sendMessage("How can I connect to external APIs?") },
            { id: 'b4', label: 'System Status', action: () => sendMessage("What's the current status?") },
          ];
        } else {
          response.buttons = [
            { id: 'b1', label: 'Deployment Help', action: () => sendMessage("How do I deploy an AI system?") },
            { id: 'b2', label: 'API Integration', action: () => sendMessage("How can I connect to external APIs?") },
            { id: 'b3', label: 'Cluster Management', action: () => sendMessage("Tell me about cluster management") },
            { id: 'b4', label: 'System Status', action: () => sendMessage("What's the current status?") },
          ];
        }
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
        if (mentionedPlatforms.length > 0) {
          const platform = mentionedPlatforms[0];
          response.content = `To deploy an AI system on ${platform}, you'll need to configure your DEVONN.AI settings for ${platform} integration. Would you like me to help you set up the ${platform} connection?`;
        } else if (mentionedServices.length > 0) {
          const service = mentionedServices[0];
          response.content = `Deploying with ${service} is a great choice! DEVONN.AI provides streamlined integration with ${service}. Would you like to see our ${service} deployment guide?`;
        } else {
          response.content = "To deploy an AI system using DEVONN.AI, navigate to the Deployment Dashboard where you can connect to your Kubernetes cluster and follow our step-by-step deployment process. Would you like me to walk you through it?";
        }
        
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
        if (mentionedServices.length > 0) {
          const services = mentionedServices.join(", ");
          response.content = `I see you're interested in ${services}. DEVONN.AI provides robust support for ${services}. Would you like specific technical documentation or implementation guidance?`;
        } else if (mentionedPlatforms.length > 0) {
          const platforms = mentionedPlatforms.join(", ");
          response.content = `DEVONN.AI can deploy to ${platforms} environments. Would you like information about our ${platforms} integration capabilities?`;
        } else {
          response.content = "I understand you have a technical question. DEVONN.AI supports various technologies including Kubernetes, Istio, Kong, Prometheus, Grafana, Jaeger, and external API integrations. Could you provide more specific details about your question?";
        }
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
      
      // Log the detected intent and entities (in a real system this would be internal)
      console.log(`Detected intent: ${intent.type} with confidence ${intent.confidence}`);
      if (intent.entities && intent.entities.length > 0) {
        console.log(`Detected entities:`, intent.entities);
      }
      
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
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    toast.info("Conversation history cleared");
    
    setConversationContext({
      mentionedEntities: {},
      messageCount: 0
    });
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
