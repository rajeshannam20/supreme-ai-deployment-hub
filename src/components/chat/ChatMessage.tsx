
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Volume2, VolumeX } from 'lucide-react';

interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'buttons';
  buttons?: Array<{
    id: string;
    label: string;
    action: () => void;
  }>;
  fromVoice?: boolean;
  feedback?: 'positive' | 'negative';
  isSpeaking: boolean;
  onSpeakMessage: (content: string) => void;
  onStopSpeaking: () => void;
  onProvideFeedback: (messageId: string, isPositive: boolean) => void;
  speechSupport: { voiceInput: boolean; voiceOutput: boolean };
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  content,
  sender,
  timestamp,
  type,
  buttons,
  fromVoice,
  feedback,
  isSpeaking,
  onSpeakMessage,
  onStopSpeaking,
  onProvideFeedback,
  speechSupport
}) => {
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-[80%] ${sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className={`h-8 w-8 ${sender === 'user' ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-full h-full flex items-center justify-center ${
            sender === 'agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            {sender === 'user' ? 'U' : 'AI'}
          </div>
        </Avatar>
        <div className={`p-3 rounded-lg ${
          sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          {type === 'text' && <p className="text-sm whitespace-pre-line">{content}</p>}
          
          {type === 'buttons' && buttons && (
            <div className="space-y-2">
              <p className="text-sm mb-2">{content}</p>
              <div className="flex flex-col space-y-2">
                {buttons.map((button) => (
                  <Button
                    key={button.id}
                    variant="secondary"
                    size="sm"
                    className="w-full text-left"
                    onClick={button.action}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className={`flex justify-between items-center mt-2 text-xs ${
            sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            <span>{formatTimestamp(timestamp)}</span>
            
            {sender === 'agent' && (
              <div className="flex space-x-1">
                {speechSupport.voiceOutput && (
                  <button
                    className="p-1 rounded-full hover:bg-background/10"
                    onClick={() => {
                      if (isSpeaking) {
                        onStopSpeaking();
                      } else {
                        onSpeakMessage(content);
                      }
                    }}
                    aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
                  >
                    {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </button>
                )}
                <button
                  className={`p-1 rounded-full hover:bg-background/10 ${
                    feedback === 'positive' ? 'bg-green-100 text-green-600' : ''
                  }`}
                  onClick={() => onProvideFeedback(id, true)}
                  aria-label="Positive feedback"
                >
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button
                  className={`p-1 rounded-full hover:bg-background/10 ${
                    feedback === 'negative' ? 'bg-red-100 text-red-600' : ''
                  }`}
                  onClick={() => onProvideFeedback(id, false)}
                  aria-label="Negative feedback"
                >
                  <ThumbsDown className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
