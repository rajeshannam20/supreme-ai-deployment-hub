
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type: 'text' | 'buttons' | 'links' | 'image';
  buttons?: Array<{
    id: string;
    label: string;
    action: () => void;
  }>;
  links?: Array<{
    label: string;
    url: string;
  }>;
  imageUrl?: string;
  fromVoice?: boolean;
}

export interface Process {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
  startTime: Date;
  endTime?: Date;
}

export interface ConversationContext {
  topic?: string;
  recentTopics?: string[];
  userPreferences?: {
    detailLevel: 'basic' | 'detailed' | 'technical';
    showExamples: boolean;
  };
}

export interface ChatContextType {
  messages: Message[];
  processes: Process[];
  isProcessing: boolean;
  sendMessage: (text: string, speak?: boolean) => void;
  provideFeedback: (messageId: string, isPositive: boolean) => void;
  clearConversation: () => void;
  startVoiceInput: () => void;
  stopSpeaking: () => void;
  isSpeechSupported: () => {
    voiceInput: boolean;
    voiceOutput: boolean;
  };
}
