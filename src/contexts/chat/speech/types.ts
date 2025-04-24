
export interface SpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  onInterim?: (text: string) => void;
}

export interface SpeechRecognitionService {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (this: SpeechRecognition, ev: Event) => any;
  onend: (this: SpeechRecognition, ev: Event) => any;
  onerror: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
  onresult: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
  start(): void;
  stop(): void;
}

export interface SpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  voice?: string;
}
