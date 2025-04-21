import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ThumbsUp, ThumbsDown, X, Sparkles, Activity, Globe, Minimize2, Mic, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/contexts/ChatContext';
import { useAPI } from '@/contexts/APIContext';
import ProcessMonitorDialog from '@/components/chat/ProcessMonitorDialog';
import APIStatusDialog from '@/components/chat/APIStatusDialog';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    processes, 
    isProcessing, 
    sendMessage, 
    provideFeedback, 
    clearConversation,
    startVoiceInput,
    stopSpeaking,
    isSpeechSupported
  } = useChat();
  
  const { apiConfigs } = useAPI();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [showProcessMonitor, setShowProcessMonitor] = useState(false);
  const [showAPIStatus, setShowAPIStatus] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const speechSupport = isSpeechSupported();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput('');
  };

  const handleVoiceInput = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    
    startVoiceInput();
    
    setInput('Listening...');
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const goToAPIManagement = () => {
    setIsMinimized(true);
    navigate('/api-management');
  };

  return (
    <>
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 500, opacity: 0 }}
            className="fixed bottom-5 right-5 w-80 sm:w-96 h-[500px] bg-background border rounded-xl shadow-lg flex flex-col z-40"
          >
            <ChatHeader 
              onMinimize={() => setIsMinimized(true)}
              onShowAPIStatus={() => setShowAPIStatus(true)}
              onShowProcessMonitor={() => setShowProcessMonitor(true)}
              onClearConversation={clearConversation}
            />
            
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    {...message}
                    isSpeaking={isSpeaking}
                    onSpeakMessage={(content) => {
                      sendMessage(content, true);
                      setIsSpeaking(true);
                    }}
                    onStopSpeaking={() => {
                      stopSpeaking();
                      setIsSpeaking(false);
                    }}
                    onProvideFeedback={provideFeedback}
                    speechSupport={speechSupport}
                  />
                ))}
              </AnimatePresence>
              
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <ChatInput
              onSendMessage={sendMessage}
              onVoiceInput={handleVoiceInput}
              isProcessing={isProcessing}
              speechSupport={speechSupport}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-5 right-5 cursor-pointer z-40"
            onClick={() => setIsMinimized(false)}
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ProcessMonitorDialog
        open={showProcessMonitor}
        onOpenChange={setShowProcessMonitor}
        processes={processes}
      />
      
      <APIStatusDialog
        open={showAPIStatus}
        onOpenChange={setShowAPIStatus}
        apiConfigs={apiConfigs}
        onManageAPI={goToAPIManagement}
      />
    </>
  );
};

export default ChatInterface;
