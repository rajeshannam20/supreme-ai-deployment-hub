
import { useState } from 'react';
import { Message, Process, ConversationContext } from './types';

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    userPreferences: {
      detailLevel: 'basic',
      showExamples: true
    }
  });

  return {
    messages,
    setMessages,
    processes,
    setProcesses,
    isProcessing,
    setIsProcessing,
    conversationContext,
    setConversationContext
  };
};
