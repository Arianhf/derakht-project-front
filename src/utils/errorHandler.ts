/**
 * Error Handler Utility
 *
 * Centralized error handling utility that transforms API errors into user-friendly messages
 * and integrates with the toast notification system.
 */

import toast from 'react-hot-toast';
import {
  StandardErrorResponse,
  ProcessedError,
  ErrorHandlerOptions,
  ErrorSeverity,
  ErrorCategory,
  ErrorCode,
  ERROR_CATEGORY_MAP,
  FieldError,
} from '@/types/error';
import {
  ERROR_MESSAGES,
  ERROR_ACTIONS,
  RETRYABLE_ERRORS,
  FALLBACK_MESSAGES,
} from '@/constants/errorMessages';
import { logError } from './errorLogger';

/**
 * ErrorHandler class for centralized error processing
 */
export class ErrorHandler {
  private environment: 'development' | 'production';

  constructor(environment?: 'development' | 'production') {
    this.environment = environment || process.env.NODE_ENV === 'production'
      ? 'production'
      : 'development';
  }

  /**
   * Main method to handle any error
   * @param error - The error object (can be from API, network, or application)
   * @param options - Additional options for error handling
   * @returns Processed error with user-friendly message
   */
  handle(error: unknown, options: ErrorHandlerOptions = {}): ProcessedError {
    const {
      showToast = true,
      logError: shouldLog = true,
      fallbackMessage,
      environment = this.environment,
    } = options;

    // Transform the error to standard format
    const standardError = this.transformError(error);

    // Process the error to get user-friendly message
    const processedError = this.processError(standardError, fallbackMessage);

    // Log the error if needed
    if (shouldLog) {
      this.logError(error, processedError);
    }

    // Show toast notification if needed
    if (showToast) {
      this.showToast(processedError);
    }

    return processedError;
  }

  /**
   * Handle errors and extract field-level validation errors for forms
   * @param error - The error object
   * @param options - Additional options
   * @returns Processed error with field errors
   */
  handleFormError(
    error: unknown,
    options: ErrorHandlerOptions = {}
  ): ProcessedError {
    const processedError = this.handle(error, { ...options, showToast: false });

    // Extract field errors
    if (processedError.details?.fields) {
      processedError.fieldErrors = this.extractFieldErrors(
        processedError.details.fields
      );
    }

    return processedError;
  }

  /**
   * Transform various error formats to StandardErrorResponse
   * @param error - Any error object
   * @returns Standardized error response
   */
  private transformError(error: unknown): StandardErrorResponse {
    // Already in standard format
    if (this.isStandardError(error)) {
      return error;
    }

    // Axios error response
    if (error.response?.data) {
      return this.transformAxiosError(error);
    }

    // Network error (no response from server)
    if (error.request && !error.response) {
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: 'Network error - no response from server',
        severity: 'error' as ErrorSeverity,
      };
    }

    // Timeout error
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        code: ErrorCode.TIMEOUT_ERROR,
        message: 'Request timeout',
        severity: 'error' as ErrorSeverity,
      };
    }

    // Generic JavaScript error
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || 'Unknown error occurred',
      severity: 'error' as ErrorSeverity,
    };
  }

  /**
   * Transform Axios error to standard format
   * Handles various backend response formats
   */
  private transformAxiosError(error: unknown): StandardErrorResponse {
    const responseData = error.response?.data;
    const status = error.response?.status;

    // Check if backend already sends standard format
    if (responseData.code && responseData.message) {
      return {
        code: responseData.code,
        message: responseData.message,
        userMessage: responseData.userMessage,
        details: responseData.details,
        severity: responseData.severity || 'error',
        timestamp: responseData.timestamp,
        requestId: responseData.requestId,
      };
    }

    // Handle common backend error formats
    // Format 1: { error: "message" }
    if (responseData.error) {
      return this.inferErrorFromMessage(responseData.error, status);
    }

    // Format 2: { detail: "message" }
    if (responseData.detail) {
      return this.inferErrorFromMessage(responseData.detail, status);
    }

    // Format 3: { message: "message" }
    if (responseData.message) {
      return this.inferErrorFromMessage(responseData.message, status);
    }

    // Format 4: { error_code: "...", error_message: "..." } (existing format)
    if (responseData.error_code || responseData.error_message) {
      return {
        code: this.normalizeErrorCode(responseData.error_code) || ErrorCode.UNKNOWN_ERROR,
        message: responseData.error_message || 'Unknown error',
        severity: 'error' as ErrorSeverity,
      };
    }

    // Infer from HTTP status code
    return this.inferErrorFromStatus(status);
  }

  /**
   * Infer error code from error message and HTTP status
   */
  private inferErrorFromMessage(
    message: string,
    status?: number
  ): StandardErrorResponse {
    const lowerMessage = message.toLowerCase();

    // Check for specific error patterns
    if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
      return {
        code: ErrorCode.EMAIL_ALREADY_EXISTS,
        message,
        severity: 'error' as ErrorSeverity,
      };
    }

    if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('اشتباه')) {
      return {
        code: ErrorCode.INVALID_CREDENTIALS,
        message,
        severity: 'error' as ErrorSeverity,
      };
    }

    if (lowerMessage.includes('not found') || lowerMessage.includes('یافت نشد')) {
      return {
        code: ErrorCode.USER_NOT_FOUND,
        message,
        severity: 'error' as ErrorSeverity,
      };
    }

    if (lowerMessage.includes('expired') || lowerMessage.includes('منقضی')) {
      return {
        code: ErrorCode.SESSION_EXPIRED,
        message,
        severity: 'error' as ErrorSeverity,
      };
    }

    if (lowerMessage.includes('unauthorized') || status === 401) {
      return {
        code: ErrorCode.UNAUTHORIZED,
        message,
        severity: 'error' as ErrorSeverity,
      };
    }

    if (lowerMessage.includes('forbidden') || status === 403) {
      return {
        code: ErrorCode.FORBIDDEN,
        message,
        severity: 'error' as ErrorSeverity,
      };
    }

    if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many')) {
      return {
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        message,
        severity: 'warning' as ErrorSeverity,
      };
    }

    // Fallback to status-based inference
    return this.inferErrorFromStatus(status, message);
  }

  /**
   * Infer error code from HTTP status
   */
  private inferErrorFromStatus(
    status?: number,
    message?: string
  ): StandardErrorResponse {
    switch (status) {
      case 400:
        return {
          code: ErrorCode.INVALID_FORMAT,
          message: message || 'Bad request',
          severity: 'error' as ErrorSeverity,
        };
      case 401:
        return {
          code: ErrorCode.UNAUTHORIZED,
          message: message || 'Unauthorized',
          severity: 'error' as ErrorSeverity,
        };
      case 403:
        return {
          code: ErrorCode.FORBIDDEN,
          message: message || 'Forbidden',
          severity: 'error' as ErrorSeverity,
        };
      case 404:
        return {
          code: ErrorCode.USER_NOT_FOUND,
          message: message || 'Not found',
          severity: 'error' as ErrorSeverity,
        };
      case 429:
        return {
          code: ErrorCode.RATE_LIMIT_EXCEEDED,
          message: message || 'Too many requests',
          severity: 'warning' as ErrorSeverity,
        };
      case 500:
        return {
          code: ErrorCode.SERVER_ERROR,
          message: message || 'Internal server error',
          severity: 'error' as ErrorSeverity,
        };
      case 503:
        return {
          code: ErrorCode.SERVICE_UNAVAILABLE,
          message: message || 'Service unavailable',
          severity: 'error' as ErrorSeverity,
        };
      default:
        return {
          code: ErrorCode.UNKNOWN_ERROR,
          message: message || 'Unknown error',
          severity: 'error' as ErrorSeverity,
        };
    }
  }

  /**
   * Normalize error codes from backend (convert to uppercase, replace spaces/dashes)
   */
  private normalizeErrorCode(code?: string): string | undefined {
    if (!code) return undefined;
    return code.toUpperCase().replace(/[-\s]/g, '_');
  }

  /**
   * Check if error is already in standard format
   */
  private isStandardError(error: unknown): error is StandardErrorResponse {
    return (
      error &&
      typeof error.code === 'string' &&
      typeof error.message === 'string' &&
      typeof error.severity === 'string'
    );
  }

  /**
   * Process error to get user-friendly message
   */
  private processError(
    error: StandardErrorResponse,
    customFallback?: string
  ): ProcessedError {
    const category = this.getErrorCategory(error.code);
    const userMessage = this.getUserMessage(error, customFallback);
    const action = ERROR_ACTIONS[error.code];
    const retryable = RETRYABLE_ERRORS.has(error.code as ErrorCode);

    return {
      code: error.code,
      userMessage,
      severity: error.severity,
      category,
      details: error.details,
      retryable,
      action,
    };
  }

  /**
   * Get user-friendly message for an error
   * Priority: custom message → userMessage from backend → mapped message → fallback
   */
  private getUserMessage(
    error: StandardErrorResponse,
    customFallback?: string
  ): string {
    // 1. Check if backend provided user message
    if (error.userMessage) {
      return error.userMessage;
    }

    // 2. Check our message mapping
    const messageTemplate = ERROR_MESSAGES[error.code];
    if (messageTemplate) {
      if (typeof messageTemplate === 'function') {
        return messageTemplate(error.details);
      }
      return messageTemplate;
    }

    // 3. Use custom fallback if provided
    if (customFallback) {
      return customFallback;
    }

    // 4. Use environment-based fallback
    if (this.environment === 'development') {
      return `${FALLBACK_MESSAGES.development}${error.message}`;
    }

    return FALLBACK_MESSAGES.production;
  }

  /**
   * Get error category
   */
  private getErrorCategory(code: string): ErrorCategory {
    return ERROR_CATEGORY_MAP[code] || ErrorCategory.UNKNOWN;
  }

  /**
   * Extract field errors from error details
   */
  private extractFieldErrors(fields: FieldError[]): Record<string, string> {
    const fieldErrors: Record<string, string> = {};

    fields.forEach((fieldError) => {
      const message = fieldError.userMessage || fieldError.message;
      fieldErrors[fieldError.field] = message;
    });

    return fieldErrors;
  }

  /**
   * Show toast notification based on error severity
   */
  private showToast(error: ProcessedError): void {
    const message = error.userMessage;

    switch (error.severity) {
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast(message, { icon: '⚠️' });
        break;
      case 'info':
        toast(message, { icon: 'ℹ️' });
        break;
    }
  }

  /**
   * Log error to console and error tracking service
   */
  private logError(originalError: unknown, processedError: ProcessedError): void {
    logError({
      originalError,
      processedError,
      timestamp: new Date().toISOString(),
      environment: this.environment,
    });
  }
}

/**
 * Default error handler instance
 */
export const errorHandler = new ErrorHandler();

/**
 * Convenience functions for common error handling scenarios
 */

/**
 * Handle API error and show toast
 */
export function handleApiError(
  error: unknown,
  options?: ErrorHandlerOptions
): ProcessedError {
  return errorHandler.handle(error, options);
}

/**
 * Handle form validation error
 */
export function handleFormError(
  error: unknown,
  options?: ErrorHandlerOptions
): ProcessedError {
  return errorHandler.handleFormError(error, options);
}

/**
 * Get user-friendly error message without showing toast
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage?: string
): string {
  const processed = errorHandler.handle(error, {
    showToast: false,
    logError: false,
    fallbackMessage,
  });
  return processed.userMessage;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const processed = errorHandler.handle(error, {
    showToast: false,
    logError: false,
  });
  return processed.retryable;
}
