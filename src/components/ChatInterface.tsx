import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ThumbsUp, ThumbsDown, X, Sparkles, Activity, Globe, Minimize2, Mic, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/contexts/ChatContext';
import { useAPI } from '@/contexts/APIContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">DEVONN.AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">AI-powered help</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => setShowAPIStatus(true)}
                  aria-label="API Status"
                >
                  <Globe className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => setShowProcessMonitor(true)}
                  aria-label="Process Monitor"
                >
                  <Activity className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => setIsMinimized(true)}
                  aria-label="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={clearConversation}
                  aria-label="Clear conversation"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      {message.fromVoice && (
                        <div className="flex items-center mb-1">
                          <Mic className="h-3 w-3 mr-1" />
                          <span className="text-xs">Voice message</span>
                        </div>
                      )}
                    
                      {message.type === 'text' && (
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      )}
                      
                      {message.type === 'buttons' && (
                        <div className="space-y-2">
                          <p className="text-sm mb-2">{message.content}</p>
                          <div className="flex flex-col space-y-2">
                            {message.buttons?.map((button) => (
                              <Button
                                key={button.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={button.action}
                              >
                                {button.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {message.type === 'links' && (
                        <div className="space-y-2">
                          <p className="text-sm mb-2">{message.content}</p>
                          <div className="flex flex-col space-y-1">
                            {message.links?.map((link, i) => (
                              <a
                                key={i}
                                href={link.url}
                                className="text-sm text-blue-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {message.type === 'image' && message.imageUrl && (
                        <div className="space-y-2">
                          <p className="text-sm mb-2">{message.content}</p>
                          <img 
                            src={message.imageUrl} 
                            alt="Chat image" 
                            className="w-full rounded-md"
                          />
                        </div>
                      )}
                      
                      <div className={`flex justify-between items-center mt-2 text-xs ${
                        message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span>{formatTimestamp(message.timestamp)}</span>
                        
                        {message.sender === 'ai' && (
                          <div className="flex space-x-1">
                            {speechSupport.voiceOutput && (
                              <button
                                className="p-1 rounded-full hover:bg-background/10"
                                onClick={() => {
                                  if (isSpeaking) {
                                    stopSpeaking();
                                    setIsSpeaking(false);
                                  } else {
                                    sendMessage(message.content, true);
                                    setIsSpeaking(true);
                                  }
                                }}
                                aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
                              >
                                {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                              </button>
                            )}
                            <button
                              className={`p-1 rounded-full hover:bg-background/10 ${
                                message.feedback === 'positive' ? 'bg-green-100 text-green-600' : ''
                              }`}
                              onClick={() => provideFeedback(message.id, 'positive')}
                              aria-label="Positive feedback"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            <button
                              className={`p-1 rounded-full hover:bg-background/10 ${
                                message.feedback === 'negative' ? 'bg-red-100 text-red-600' : ''
                              }`}
                              onClick={() => provideFeedback(message.id, 'negative')}
                              aria-label="Negative feedback"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
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
            
            <form onSubmit={handleSubmit} className="p-3 border-t">
              <div className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something..."
                  className="min-h-10 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                
                {speechSupport.voiceInput && (
                  <Button 
                    type="button" 
                    variant={isProcessing ? "outline" : "ghost"}
                    size="icon"
                    onClick={handleVoiceInput}
                    disabled={isProcessing}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                )}
                
                <Button type="submit" size="icon" disabled={isProcessing || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {(speechSupport.voiceInput || speechSupport.voiceOutput) && (
                <div className="flex pt-2 text-xs text-muted-foreground">
                  {speechSupport.voiceInput && (
                    <Badge variant="outline" className="mr-1 py-0">Voice input</Badge>
                  )}
                  {speechSupport.voiceOutput && (
                    <Badge variant="outline" className="py-0">Voice output</Badge>
                  )}
                </div>
              )}
            </form>
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
      
      <Dialog open={showProcessMonitor} onOpenChange={setShowProcessMonitor}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>DEVONN.AI Process Monitor</DialogTitle>
            <DialogDescription>
              Master Control Program (MCP) system processes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {processes.map((process) => (
              <div key={process.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      process.status === 'running' ? 'bg-green-500' : 
                      process.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <h4 className="font-medium text-sm">{process.name}</h4>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                    Priority: {process.priority}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">CPU Usage: {Math.round(process.cpuUsage)}%</Label>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${process.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Memory: {Math.round(process.memoryUsage)} MB</Label>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min(100, process.memoryUsage / 5)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAPIStatus} onOpenChange={setShowAPIStatus}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>API Connection Status</DialogTitle>
            <DialogDescription>
              Manage your external API connections
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {apiConfigs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No API connections configured</p>
                <Button 
                  variant="outline" 
                  onClick={goToAPIManagement} 
                  className="mt-2"
                >
                  Add API Connection
                </Button>
              </div>
            ) : (
              <>
                {apiConfigs.map((api) => (
                  <div key={api.name} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{api.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{api.endpoint}</p>
                    </div>
                    <div>
                      {api.isConnected ? (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                          Connected
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full">
                          Disconnected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <Button onClick={goToAPIManagement} className="w-full mt-2">
                  Manage API Connections
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatInterface;
