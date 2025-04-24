
import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useChat } from '@/contexts/ChatContext';
import { SpeechHandler } from '@/contexts/chat/SpeechHandler';

const ChatInterface = () => {
  const { sendMessage, isProcessing, startVoiceInput, isSpeechSupported } = useChat();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const speechSupport = isSpeechSupported();
  const [speechHandler, setSpeechHandler] = useState<SpeechHandler | null>(null);

  useEffect(() => {
    // Initialize speech handler if supported
    if (speechSupport.voiceInput) {
      const handler = new SpeechHandler({
        onStart: () => setIsListening(true),
        onEnd: () => setIsListening(false),
        onResult: (text) => {
          setTranscript(text);
          if (text.trim()) {
            setMessage(text);
          }
        },
        onInterim: (text) => setTranscript(text),
        onError: (error) => {
          toast.error(`Speech recognition error: ${error}`);
          setIsListening(false);
        }
      });
      
      setSpeechHandler(handler);
      
      return () => {
        if (handler) {
          handler.stopListening();
        }
      };
    }
  }, [speechSupport.voiceInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage('');
  };

  const toggleListening = () => {
    if (!speechHandler) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      speechHandler.stopListening();
      setIsListening(false);
    } else {
      speechHandler.startListening();
      toast.info('Listening for voice input...');
    }
  };

  return (
    <div className="flex flex-col h-full rounded-md border overflow-hidden">
      <div className="p-4 bg-primary/10 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Chat Assistant</h3>
        </div>
        {speechSupport.voiceInput && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleListening}
            className={isListening ? "text-red-500" : ""}
          >
            {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isListening ? "Stop" : "Voice"}
          </Button>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Chat messages would go here */}
        <div className="text-sm text-muted-foreground text-center mt-4">
          Start a conversation with the AI assistant
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          value={transcript || message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" disabled={isProcessing || !message.trim()}>
          Send
        </Button>
      </form>
      
      {isListening && (
        <div className="p-2 bg-primary/5 border-t text-sm text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute" />
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <span>{transcript ? transcript : "Listening..."}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
