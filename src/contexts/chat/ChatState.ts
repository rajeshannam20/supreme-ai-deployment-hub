
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChatMessage, Process, ConversationContext } from './types';

export const useChatState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    mentionedEntities: {},
    messageCount: 0,
    topicHistory: [],
    failedIntentCount: 0
  });

  // Initialize sample processes
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

  // Update process statistics periodically
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

  return {
    messages,
    setMessages,
    processes,
    isProcessing,
    setIsProcessing,
    conversationContext,
    setConversationContext,
  };
};
