
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useDeployment } from '../DeploymentContext';
import { useAPI } from '../APIContext';
import { 
  ChatMessage, 
  Process, 
  ChatContextType, 
  ConversationContext 
} from './types';
import { detectIntent } from './intentDetector';
import { generateResponse } from './responseGenerator';

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
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
      const intent = detectIntent(content, conversationContext, setConversationContext);
      
      // Log the detected intent and entities (in a real system this would be internal)
      console.log(`Detected intent: ${intent.type} with confidence ${intent.confidence}`);
      if (intent.entities && intent.entities.length > 0) {
        console.log(`Detected entities:`, intent.entities);
      }
      
      // Generate AI response
      let aiResponse = generateResponse(intent, content, {
        getDeploymentSummary,
        isClusterConnected,
        apiConfigs,
        isAnyAPIConnected
      });

      // Process specific post-processing
      if (intent.type === 'status') {
        const runningProcesses = processes.filter(p => p.status === 'running').length;
        aiResponse.content = aiResponse.content.replace('[processCount]', `${runningProcesses}/${processes.length}`);
      }

      // Set up button actions that require access to the sendMessage function
      if (aiResponse.buttons) {
        aiResponse.buttons = aiResponse.buttons.map(button => {
          // If the action is empty (set in the response generator), replace it
          if (button.action.toString() === '() => {}') {
            return {
              ...button,
              action: () => sendMessage(button.label)
            };
          }
          return button;
        });
      }
      
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
