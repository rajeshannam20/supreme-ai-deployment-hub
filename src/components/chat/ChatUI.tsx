
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const ChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Simulate agent response (replace with actual API call)
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm processing your request. This would be connected to your backend in a real implementation.",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement actual speech recognition here
    if (!isRecording) {
      // Start recording
      toast.info('Voice recording started...');
    } else {
      // Stop recording
      toast.info('Voice recording stopped');
    }
  };
  
  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(600px-8rem)]">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start max-w-[80%] ${
                    message.sender === 'user'
                      ? 'flex-row-reverse'
                      : 'flex-row'
                  }`}
                >
                  <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                    <div className={`w-full h-full flex items-center justify-center ${
                      message.sender === 'agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {message.sender === 'user' ? 'U' : 'AI'}
                    </div>
                  </Avatar>
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? 'text-red-500' : ''}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatUI;
