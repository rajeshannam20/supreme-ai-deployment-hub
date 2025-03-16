
export type MessageType = 'text' | 'buttons' | 'links' | 'image';

export interface ChatButton {
  id: string;
  label: string;
  action: () => void;
}

export interface ChatLink {
  url: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: MessageType;
  buttons?: ChatButton[];
  links?: ChatLink[];
  imageUrl?: string;
  feedback?: 'positive' | 'negative' | null;
  sentiment?: 'positive' | 'negative' | 'neutral'; // Added sentiment field
}

export interface Intent {
  type: string;
  confidence: number;
  entities?: Entity[];
}

export interface Entity {
  type: string;
  value: string;
  position: {
    start: number;
    end: number;
  };
}

export interface Process {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'terminated';
  priority: number;
  cpuUsage: number;
  memoryUsage: number;
  startTime: Date;
}

export interface ChatContextType {
  messages: ChatMessage[];
  processes: Process[];
  isProcessing: boolean;
  sendMessage: (content: string) => void;
  provideFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  clearConversation: () => void;
}

export interface ConversationContext {
  lastIntent?: string;
  mentionedEntities: Record<string, string[]>;
  messageCount: number;
  topicHistory: string[]; // Added to track conversation topics
  lastUserSentiment?: 'positive' | 'negative' | 'neutral'; // Track user sentiment
  failedIntentCount: number; // Track consecutive failed intents for fallback
}

// New fallback response options
export interface FallbackStrategy {
  threshold: number; // Number of low-confidence intents before fallback
  responses: string[]; // Array of fallback responses to cycle through
}
