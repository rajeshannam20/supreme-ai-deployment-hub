
/**
 * Simple encryption/decryption utility for client-side storage
 * Note: This is not meant for highly sensitive data, but provides
 * basic obfuscation for API keys stored in localStorage
 */

// Simple encryption key - in a real app, would use a more secure approach
const ENCRYPTION_KEY = 'DEVONN_AI_SECURE_STORAGE';

export const encrypt = (text: string): string => {
  if (!text) return '';
  
  // Simple XOR encryption with the key
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  
  // Convert to base64 for storage
  return btoa(result);
};

export const decrypt = (encryptedText: string): string => {
  if (!encryptedText) return '';
  
  try {
    // Decode from base64
    const decodedText = atob(encryptedText);
    
    // Reverse the XOR operation
    let result = '';
    for (let i = 0; i < decodedText.length; i++) {
      const charCode = decodedText.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};
