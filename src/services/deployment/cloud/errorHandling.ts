
import type { CloudProvider } from '../../../types/deployment';
import { ErrorCategory, ErrorSeverity } from '../errorHandling';

// Error handling utilities for cloud operations
const errorCodeMapping: Record<string, string> = {
  // AWS specific error codes
  'AccessDeniedException': 'DEPLOY_AUTH_002',
  'ResourceNotFoundException': 'DEPLOY_RESOURCE_001',
  'ThrottlingException': 'DEPLOY_TIMEOUT_001',
  
  // Azure specific error codes
  'AuthorizationFailed': 'DEPLOY_AUTH_002',
  'ResourceNotFound': 'DEPLOY_RESOURCE_001',
  'TooManyRequests': 'DEPLOY_TIMEOUT_001',
  
  // GCP specific error codes
  'PERMISSION_DENIED': 'DEPLOY_AUTH_002',
  'NOT_FOUND': 'DEPLOY_RESOURCE_001',
  'RESOURCE_EXHAUSTED': 'DEPLOY_TIMEOUT_001',
  
  // Generic error codes
  'TIMEOUT': 'DEPLOY_TIMEOUT_001',
  'NETWORK_ERROR': 'DEPLOY_CONN_001',
  'VALIDATION_ERROR': 'DEPLOY_CONFIG_001'
};

// Error classifier to provide consistent error messages
export const classifyCloudError = (error: any, provider: CloudProvider): {
  errorCode: string;
  errorMessage: string;
  errorDetails: Record<string, any>;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  recoverable?: boolean;
} => {
  // Default values
  let errorCode = 'DEPLOY_UNKNOWN';
  let errorMessage = 'An unknown error occurred';
  let errorDetails: Record<string, any> = {};
  let category: ErrorCategory = 'unknown';
  let severity: ErrorSeverity = 'major';
  let recoverable = false;
  
  if (!error) {
    return { errorCode, errorMessage, errorDetails, category, severity, recoverable };
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
    
    // AWS specific categorization
    if (errorCode.includes('Permission') || errorCode.includes('Access')) {
      category = 'authorization';
      severity = 'critical';
      recoverable = false;
    } else if (errorCode.includes('NotFound')) {
      category = 'resource';
      severity = 'major';
      recoverable = false;
    } else if (errorCode.includes('Throttling') || errorCode.includes('Timeout')) {
      category = 'timeout';
      severity = 'major';
      recoverable = true;
    }
  } else if (provider === 'azure') {
    errorCode = error.code || errorCode;
    errorMessage = error.message || errorMessage;
    errorDetails = {
      requestId: error.requestId,
      details: error.details,
      target: error.target
    };
    
    // Azure specific categorization
    if (errorCode.includes('Authorization') || errorCode.includes('Authentication')) {
      category = 'authorization';
      severity = 'critical';
      recoverable = false;
    } else if (errorCode.includes('NotFound')) {
      category = 'resource';
      severity = 'major';
      recoverable = false;
    } else if (errorCode.includes('Timeout') || errorCode.includes('TooMany')) {
      category = 'timeout';
      severity = 'major';
      recoverable = true;
    }
  } else if (provider === 'gcp') {
    errorCode = error.code || errorCode;
    errorMessage = error.message || errorMessage;
    errorDetails = {
      details: error.details,
      location: error.location,
      reason: error.reason
    };
    
    // GCP specific categorization
    if (errorCode.includes('PERMISSION') || errorCode.includes('UNAUTHENTICATED')) {
      category = 'authorization';
      severity = 'critical';
      recoverable = false;
    } else if (errorCode.includes('NOT_FOUND')) {
      category = 'resource';
      severity = 'major';
      recoverable = false;
    } else if (errorCode.includes('DEADLINE') || errorCode.includes('RESOURCE_EXHAUSTED')) {
      category = 'timeout';
      severity = 'major';
      recoverable = true;
    }
  } else {
    // Generic error handling
    errorCode = error.code || error.name || errorCode;
    errorMessage = error.message || errorMessage;
    errorDetails = { ...error };
    
    // Generic categorization
    if (errorMessage.toLowerCase().includes('permission') || 
        errorMessage.toLowerCase().includes('access') || 
        errorMessage.toLowerCase().includes('auth')) {
      category = 'authorization';
      severity = 'critical';
      recoverable = false;
    } else if (errorMessage.toLowerCase().includes('not found') || 
               errorMessage.toLowerCase().includes('missing')) {
      category = 'resource';
      severity = 'major';
      recoverable = false;
    } else if (errorMessage.toLowerCase().includes('timeout') || 
               errorMessage.toLowerCase().includes('too many')) {
      category = 'timeout';
      severity = 'major';
      recoverable = true;
    }
  }
  
  // Map to consistent error code if available
  const mappedErrorCode = errorCodeMapping[errorCode] || errorCode;
  
  return { 
    errorCode: mappedErrorCode, 
    errorMessage, 
    errorDetails, 
    category, 
    severity, 
    recoverable 
  };
};
