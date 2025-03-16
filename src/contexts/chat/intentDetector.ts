import { Intent, ConversationContext, Entity } from './types';
import { INTENTS } from './constants';
import { extractEntities } from './entityExtractor';

export const detectIntent = (
  message: string, 
  conversationContext: ConversationContext,
  updateConversationContext: (updater: (prev: ConversationContext) => ConversationContext) => void
): Intent => {
  const lowerMessage = message.toLowerCase();
  const entities = extractEntities(message);
  
  // Keep track of entities for conversation context
  entities.forEach(entity => {
    if (!conversationContext.mentionedEntities[entity.type]) {
      conversationContext.mentionedEntities[entity.type] = [];
    }
    if (!conversationContext.mentionedEntities[entity.type].includes(entity.value)) {
      updateConversationContext(prev => ({
        ...prev,
        mentionedEntities: {
          ...prev.mentionedEntities,
          [entity.type]: [...prev.mentionedEntities[entity.type], entity.value]
        }
      }));
    }
  });
  
  // Calculate scores for each intent based on keyword matches
  const intentScores = INTENTS.map(intent => {
    let score = 0;
    let matchCount = 0;
    
    // Check for keyword matches
    intent.keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        matchCount++;
        // More specific keywords get higher scores
        score += keyword.length > 3 ? 0.4 : 0.2;
      }
    });
    
    // Adjust score based on message length and match count
    if (matchCount > 0) {
      // Normalize score based on message length (shorter messages with matches are more focused)
      const wordCount = lowerMessage.split(/\s+/).length;
      score = score * (1 + (1 / wordCount));
      
      // Boost score if multiple keywords match
      if (matchCount > 1) {
        score *= (1 + (0.1 * matchCount));
      }
    }
    
    return {
      type: intent.name,
      score: score,
    };
  });
  
  // Consider conversation context for intent detection
  if (conversationContext.lastIntent && conversationContext.messageCount < 5) {
    // If we're in a conversation thread, slightly bias toward same intent family
    intentScores.forEach(intent => {
      if (intent.type === conversationContext.lastIntent) {
        intent.score += 0.1;
      }
    });
  }
  
  // Find highest scoring intent
  const highestIntent = intentScores.reduce((highest, current) => 
    current.score > highest.score ? current : highest, 
    { type: 'technical', score: 0.3 }
  );
  
  // If no strong intent is detected, default to technical
  if (highestIntent.score < 0.3) {
    return { 
      type: 'technical', 
      confidence: 0.6,
      entities
    };
  }
  
  // Update conversation context with the detected intent
  updateConversationContext(prev => ({
    ...prev,
    lastIntent: highestIntent.type,
    messageCount: prev.messageCount + 1
  }));
  
  return {
    type: highestIntent.type,
    confidence: Math.min(0.95, highestIntent.score + 0.5), // Convert score to confidence
    entities
  };
};
