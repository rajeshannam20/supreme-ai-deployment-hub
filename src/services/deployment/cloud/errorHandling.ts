
import type { CloudProvider } from '../../../types/deployment';

// Error handling utilities for cloud operations
const errorCodeMapping: Record<string, string> = {
  // AWS specific error codes
  'AccessDeniedException': 'Insufficient permissions for AWS operation',
  'ResourceNotFoundException': 'The requested AWS resource was not found',
  'ThrottlingException': 'AWS API rate limit exceeded',
  
  // Azure specific error codes
  'AuthorizationFailed': 'Authorization failed for Azure operation',
  'ResourceNotFound': 'The requested Azure resource was not found',
  'TooManyRequests': 'Azure API rate limit exceeded',
  
  // GCP specific error codes
  'PERMISSION_DENIED': 'Insufficient permissions for GCP operation',
  'NOT_FOUND': 'The requested GCP resource was not found',
  'RESOURCE_EXHAUSTED': 'GCP API rate limit exceeded',
  
  // Generic error codes
  'TIMEOUT': 'Operation timed out',
  'NETWORK_ERROR': 'Network connectivity issue',
  'VALIDATION_ERROR': 'Invalid parameters for operation'
};

// Error classifier to provide consistent error messages
export const classifyCloudError = (error: any, provider: CloudProvider): {
  errorCode: string;
  errorMessage: string;
  errorDetails: Record<string, any>;
} => {
  // Default values
  let errorCode = 'UNKNOWN_ERROR';
  let errorMessage = 'An unknown error occurred';
  let errorDetails: Record<string, any> = {};
  
  if (!error) {
    return { errorCode, errorMessage, errorDetails };
  }
  
  // Extract provider-specific error information
  if (provider === 'aws') {
    errorCode = error.name || error.code || errorCode;
    errorMessage = error.message || errorMessage;
    errorDetails = {
      requestId: error.$metadata?.requestId,
      region: error.$metadata?.region,
      service: error.$metadata?.service,
      ...error.info
    };
  } else if (provider === 'azure') {
    errorCode = error.code || errorCode;
    errorMessage = error.message || errorMessage;
    errorDetails = {
      requestId: error.requestId,
      details: error.details,
      target: error.target
    };
  } else if (provider === 'gcp') {
    errorCode = error.code || errorCode;
    errorMessage = error.message || errorMessage;
    errorDetails = {
      details: error.details,
      location: error.location,
      reason: error.reason
    };
  } else {
    // Generic error handling
    errorCode = error.code || error.name || errorCode;
    errorMessage = error.message || errorMessage;
    errorDetails = { ...error };
  }
  
  // Map to consistent error message if available
  if (errorCodeMapping[errorCode]) {
    errorMessage = errorCodeMapping[errorCode] + ': ' + errorMessage;
  }
  
  return { errorCode, errorMessage, errorDetails };
};
