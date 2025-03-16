
import { toast } from 'sonner';
import { ChatMessage, ConversationContext } from './types';
import { detectIntent } from './intentDetector';
import { generateResponse } from './responseGenerator';
import { analyzeSentiment } from './sentimentAnalyzer';

interface ChatActionsProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  conversationContext: ConversationContext;
  setConversationContext: React.Dispatch<React.SetStateAction<ConversationContext>>;
  getDeploymentSummary: () => string;
  isClusterConnected: boolean;
  apiConfigs: {
    name: string;
    endpoint: string;
    isConnected: boolean;
  }[];
  isAnyAPIConnected: boolean;
}

export const createChatActions = ({
  messages,
  setMessages,
  setIsProcessing,
  conversationContext,
  setConversationContext,
  getDeploymentSummary,
  isClusterConnected,
  apiConfigs,
  isAnyAPIConnected
}: ChatActionsProps) => {
  // Send a message
  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Analyze sentiment for user message
    const sentiment = analyzeSentiment(content);
    
    // Create and add user message with sentiment
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      sentiment
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI processing time with a more natural variable delay
    const processingTime = Math.floor(1200 + Math.random() * 800); // 1.2-2s
    
    setTimeout(() => {
      const intent = detectIntent(content, conversationContext, setConversationContext);
      
      // Log the detected intent and entities (in a real system this would be internal)
      console.log(`Detected intent: ${intent.type} with confidence ${intent.confidence}`);
      if (intent.entities && intent.entities.length > 0) {
        console.log(`Detected entities:`, intent.entities);
      }
      
      // Generate AI response with enhanced context
      let aiResponse = generateResponse(intent, content, {
        getDeploymentSummary,
        isClusterConnected,
        apiConfigs,
        isAnyAPIConnected,
        conversationContext
      });

      // Process specific post-processing
      if (intent.type === 'status') {
        const runningProcessCount = messages.filter(msg => msg.sender === 'ai').length;
        aiResponse.content = aiResponse.content.replace('[processCount]', `${runningProcessCount}/${messages.length}`);
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
    }, processingTime);
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
    
    // Improve future responses based on feedback
    if (feedback === 'negative') {
      // When negative feedback is received, add a follow-up message asking for clarification
      setTimeout(() => {
        const followUpMessage: ChatMessage = {
          id: Date.now().toString(),
          content: "I'm sorry my response wasn't helpful. Could you explain what you're looking for in more detail?",
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, followUpMessage]);
        toast.info("New message from DEVONN.AI Assistant");
      }, 1000);
    } else {
      toast.success(`Thank you for your feedback!`);
    }
  };

  // Clear conversation history
  const clearConversation = () => {
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    toast.info("Conversation history cleared");
    
    setConversationContext({
      mentionedEntities: {},
      messageCount: 0,
      topicHistory: [],
      failedIntentCount: 0
    });
  };

  return {
    sendMessage,
    provideFeedback,
    clearConversation
  };
};
