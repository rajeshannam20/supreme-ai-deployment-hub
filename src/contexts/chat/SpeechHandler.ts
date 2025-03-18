
interface SpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  onInterim?: (text: string) => void;
}

export class SpeechHandler {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesisUtterance | null = null;
  private isListening: boolean = false;
  public options: SpeechOptions = {};
  private voices: SpeechSynthesisVoice[] = [];
  private autoRestart: boolean = false;
  private recognitionTimeout: NodeJS.Timeout | null = null;

  constructor(options: SpeechOptions = {}) {
    this.options = options;
    this.initSpeechRecognition();
    this.loadVoices();
  }

  private loadVoices() {
    if ('speechSynthesis' in window) {
      // Load available voices
      this.voices = window.speechSynthesis.getVoices();
      
      // If voices array is empty, wait for the voiceschanged event
      if (this.voices.length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          this.voices = window.speechSynthesis.getVoices();
        });
      }
    }
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
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.options.onStart) this.options.onStart();
        
        // Set a timeout to restart recognition if it stops unexpectedly
        if (this.recognitionTimeout) {
          clearTimeout(this.recognitionTimeout);
        }
        
        this.recognitionTimeout = setTimeout(() => {
          if (this.isListening && this.autoRestart) {
            console.log("Recognition restarted due to timeout");
            this.restartListening();
          }
        }, 10000); // 10 seconds timeout
      };

      this.recognition.onend = () => {
        if (this.recognitionTimeout) {
          clearTimeout(this.recognitionTimeout);
          this.recognitionTimeout = null;
        }
        
        this.isListening = false;
        if (this.options.onEnd) this.options.onEnd();
        
        // Auto restart if enabled
        if (this.autoRestart) {
          setTimeout(() => {
            this.startListening();
          }, 500);
        }
      };

      this.recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        if (interim && this.options.onInterim) {
          this.options.onInterim(interim);
        }
        
        if (final && this.options.onResult) {
          this.options.onResult(final);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // Auto recover from errors
        if (this.isListening && this.autoRestart) {
          setTimeout(() => this.restartListening(), 2000);
        }
        
        if (this.options.onError) this.options.onError(event.error);
      };
    }
  }

  public startListening(autoRestart = false) {
    if (!this.recognition) {
      this.initSpeechRecognition();
    }

    this.autoRestart = autoRestart;

    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        // Try to re-initialize and start again
        setTimeout(() => {
          this.initSpeechRecognition();
          this.recognition?.start();
        }, 100);
      }
    }
  }

  public stopListening() {
    this.autoRestart = false;
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  private restartListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
        setTimeout(() => {
          this.recognition?.start();
        }, 200);
      } catch (error) {
        console.error('Error restarting speech recognition:', error);
      }
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

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  public getListeningState(): boolean {
    return this.isListening;
  }
}

// Type definitions for Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
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
  resultIndex: number;
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
