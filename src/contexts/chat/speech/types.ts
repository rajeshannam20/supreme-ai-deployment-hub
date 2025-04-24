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
  onstart: (this: SpeechRecognitionInstance, ev: Event) => any;
  onend: (this: SpeechRecognitionInstance, ev: Event) => any;
  onerror: (this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEventInstance) => any;
  onresult: (this: SpeechRecognitionInstance, ev: SpeechRecognitionEventInstance) => any;
  start(): void;
  stop(): void;
}

export interface SpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  voice?: string;
}

// TypeScript type definitions for Speech API
export interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (this: SpeechRecognitionInstance, ev: Event) => any;
  onend: (this: SpeechRecognitionInstance, ev: Event) => any;
  onerror: (this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEventInstance) => any;
  onresult: (this: SpeechRecognitionInstance, ev: SpeechRecognitionEventInstance) => any;
  start(): void;
  stop(): void;
}

export interface SpeechRecognitionErrorEventInstance extends Event {
  error: string;
}

export interface SpeechRecognitionEventInstance extends Event {
  results: SpeechRecognitionResultListInstance;
  resultIndex: number;
}

export interface SpeechRecognitionResultListInstance {
  length: number;
  item(index: number): SpeechRecognitionResultInstance;
  [index: number]: SpeechRecognitionResultInstance;
}

export interface SpeechRecognitionResultInstance {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternativeInstance;
  [index: number]: SpeechRecognitionAlternativeInstance;
}

export interface SpeechRecognitionAlternativeInstance {
  transcript: string;
  confidence: number;
}

// Global speech recognition type definitions
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
    speechSynthesis: SpeechSynthesis;
  }
}

// Speech Recognition Interface
export interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start(): void;
  stop(): void;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
