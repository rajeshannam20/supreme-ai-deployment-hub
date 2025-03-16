
interface SpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

export class SpeechHandler {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesisUtterance | null = null;
  private isListening: boolean = false;
  // Changed from private to public to allow access from ChatActions
  public options: SpeechOptions = {};

  constructor(options: SpeechOptions = {}) {
    this.options = options;
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();
    
    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.options.onStart) this.options.onStart();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.options.onEnd) this.options.onEnd();
      };

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (event.results[0].isFinal && this.options.onResult) {
          this.options.onResult(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        if (this.options.onError) this.options.onError(event.error);
      };
    }
  }

  public startListening() {
    if (!this.recognition) {
      this.initSpeechRecognition();
    }

    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public speak(text: string, voiceOptions: { rate?: number; pitch?: number; voice?: string } = {}) {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    this.synthesis = new SpeechSynthesisUtterance(text);
    
    // Set voice options
    this.synthesis.rate = voiceOptions.rate || 1;
    this.synthesis.pitch = voiceOptions.pitch || 1;
    
    // Set voice if specified and available
    if (voiceOptions.voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === voiceOptions.voice || v.voiceURI === voiceOptions.voice);
      if (selectedVoice) {
        this.synthesis.voice = selectedVoice;
      }
    }

    this.synthesis.onstart = () => {
      if (this.options.onStart) this.options.onStart();
    };

    this.synthesis.onend = () => {
      if (this.options.onEnd) this.options.onEnd();
    };

    this.synthesis.onerror = (event) => {
      if (this.options.onError) this.options.onError(event.error);
    };

    window.speechSynthesis.speak(this.synthesis);
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isVoiceSupported(): boolean {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  }

  public isSpeechSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Fix TypeScript issues with the Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognitionConstructor;
    webkitSpeechRecognition: typeof SpeechRecognitionConstructor;
  }
}

// Define a constructor type for SpeechRecognition
interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

// Define the SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
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

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
