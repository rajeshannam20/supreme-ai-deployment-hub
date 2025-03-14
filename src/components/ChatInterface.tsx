
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ThumbsUp, ThumbsDown, X, Sparkles, Activity, Maximize2, Minimize2 } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const ChatInterface: React.FC = () => {
  const { messages, processes, isProcessing, sendMessage, provideFeedback, clearConversation } = useChat();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [showProcessMonitor, setShowProcessMonitor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput('');
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            {/* Chat Header */}
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
            
            {/* Chat Messages */}
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
                      {/* Message content based on type */}
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
                      
                      {/* Message footer with timestamp and feedback */}
                      <div className={`flex justify-between items-center mt-2 text-xs ${
                        message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span>{formatTimestamp(message.timestamp)}</span>
                        
                        {message.sender === 'ai' && (
                          <div className="flex space-x-1">
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
              
              {/* Typing indicator */}
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
            
            {/* Input Area */}
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
                <Button type="submit" size="icon" disabled={isProcessing || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
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
      
      {/* Process Monitor Dialog */}
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
    </>
  );
};

export default ChatInterface;
