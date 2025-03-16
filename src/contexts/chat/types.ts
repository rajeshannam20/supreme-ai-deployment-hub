
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
  sentiment?: 'positive' | 'negative' | 'neutral';
  fromVoice?: boolean; // Added to track if message was from voice input
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
  sendMessage: (content: string, fromVoice?: boolean) => void;
  provideFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  clearConversation: () => void;
  startVoiceInput: () => void; // New function to start voice recognition
  stopSpeaking: () => void; // New function to stop text-to-speech
  isSpeechSupported: () => { voiceInput: boolean; voiceOutput: boolean }; // Check browser support
}

export interface ConversationContext {
  lastIntent?: string;
  mentionedEntities: Record<string, string[]>;
  messageCount: number;
  topicHistory: string[];
  lastUserSentiment?: 'positive' | 'negative' | 'neutral';
  failedIntentCount: number;
}

export interface FallbackStrategy {
  threshold: number;
  responses: string[];
}
