
import { CloudProvider } from './types';

/**
 * Classify cloud provider errors for better error messages
 */
export function classifyCloudError(error: any, provider: CloudProvider): {
  errorCode: string;
  errorMessage: string;
  errorDetails?: Record<string, any>;
} {
  // Default values
  let errorCode = 'UnknownError';
  let errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  let errorDetails = {};
  
  // Determine if this is an API error
  const isApiError = error && (
    error.response || 
    error.statusCode || 
    error.code || 
    error.name === 'HttpError' ||
    error.name === 'ApiError'
  );
  
  if (isApiError) {
    // Extract error information based on provider
    switch (provider) {
      case 'aws':
        errorCode = error.code || 'AWSError';
        
        if (error.code === 'AccessDeniedException' || error.code === 'AccessDenied') {
          errorMessage = 'AWS access denied. Please check your credentials and permissions.';
        } else if (error.code === 'ResourceNotFoundException' || error.code === 'ResourceNotFound') {
          errorMessage = 'The requested AWS resource was not found.';
        } else if (error.code === 'ValidationException' || error.code === 'ValidationError') {
          errorMessage = 'Invalid parameters for AWS operation.';
        } else if (error.code === 'ExpiredToken') {
          errorMessage = 'Your AWS credentials have expired. Please refresh them and try again.';
        }
        break;
        
      case 'azure':
        errorCode = error.code || (error.response?.data?.error?.code) || 'AzureError';
        
        if (errorCode === 'AuthorizationFailed' || errorCode === 'Unauthorized') {
          errorMessage = 'Azure authorization failed. Please check your credentials and permissions.';
        } else if (errorCode === 'ResourceNotFound' || errorCode === 'ResourceGroupNotFound') {
          errorMessage = 'The requested Azure resource was not found.';
        } else if (errorCode === 'InvalidParameter' || errorCode === 'ValidationError') {
          errorMessage = 'Invalid parameters for Azure operation.';
        } else if (errorCode === 'TokenExpired') {
          errorMessage = 'Your Azure credentials have expired. Please refresh them and try again.';
        }
        break;
        
      case 'gcp':
        errorCode = error.code || (error.response?.data?.error?.status) || 'GCPError';
        
        if (errorCode === 'PERMISSION_DENIED' || errorCode === 'UNAUTHENTICATED') {
          errorMessage = 'GCP permission denied. Please check your credentials and permissions.';
        } else if (errorCode === 'NOT_FOUND') {
          errorMessage = 'The requested GCP resource was not found.';
        } else if (errorCode === 'INVALID_ARGUMENT' || errorCode === 'FAILED_PRECONDITION') {
          errorMessage = 'Invalid parameters for GCP operation.';
        } else if (error.response?.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
        break;
        
      default:
        // Use generic error handling for other providers
        errorCode = 'ProviderError';
        errorMessage = 'Cloud provider error occurred. Please check your configuration.';
    }
    
    // Extract detailed error information if available
    if (error.response?.data) {
      errorDetails = error.response.data;
    }
  } else if (error.message && error.message.includes('ECONNREFUSED')) {
    // Connection errors
    errorCode = 'ConnectionError';
    errorMessage = 'Could not connect to the cloud provider. Please check your network connection.';
  } else if (error.message && error.message.includes('ETIMEDOUT')) {
    errorCode = 'TimeoutError'; 
    errorMessage = 'The request to the cloud provider timed out. Please try again later.';
  } else if (error.message && error.message.includes('certificate')) {
    errorCode = 'CertificateError';
    errorMessage = 'SSL certificate validation failed. Please check your system certificates.';
  }
  
  return {
    errorCode,
    errorMessage,
    errorDetails
  };
}
