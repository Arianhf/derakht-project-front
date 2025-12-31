/**
 * Error Handling Type Definitions
 *
 * This file contains all TypeScript types and interfaces for the error handling system.
 */

/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Standard API error response format
 * All backend errors should conform to this structure
 */
export interface StandardErrorResponse {
  /** Machine-readable error code (e.g., "INVALID_EMAIL", "USER_NOT_FOUND") */
  code: string;

  /** Developer-friendly description of the error */
  message: string;

  /** Optional user-facing message from backend (in Persian) */
  userMessage?: string;

  /** Context data for parameterized messages (field names, limits, values, etc.) */
  details?: ErrorDetails;

  /** Error severity level */
  severity: ErrorSeverity;

  /** Optional timestamp when the error occurred */
  timestamp?: string;

  /** Optional request ID for tracking/debugging */
  requestId?: string;
}

/**
 * Error details object for additional context
 */
export interface ErrorDetails {
  /** Field name that caused the error (for validation errors) */
  field?: string;

  /** Multiple field errors */
  fields?: FieldError[];

  /** Limit that was exceeded (for rate limiting, length validation, etc.) */
  limit?: number;

  /** Current count (for rate limiting) */
  count?: number;

  /** Time until retry is allowed (in seconds) */
  retryAfter?: number;

  /** Additional custom data (including value that caused the error) */
  [key: string]: unknown;
}

/**
 * Field-level validation error
 */
export interface FieldError {
  /** Field name */
  field: string;

  /** Error code for this field */
  code: string;

  /** Error message for this field */
  message: string;

  /** User-friendly message for this field */
  userMessage?: string;
}

/**
 * Error categories for organizing error types
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  RATE_LIMITING = 'RATE_LIMITING',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Standard error codes used throughout the application
 */
export enum ErrorCode {
  // Validation Errors
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  PASSWORDS_DO_NOT_MATCH = 'PASSWORDS_DO_NOT_MATCH',
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_POSTAL_CODE = 'INVALID_POSTAL_CODE',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  VALUE_TOO_LONG = 'VALUE_TOO_LONG',
  VALUE_TOO_SHORT = 'VALUE_TOO_SHORT',
  INVALID_AGE = 'INVALID_AGE',
  AGE_TOO_YOUNG = 'AGE_TOO_YOUNG',

  // Authentication Errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Authorization Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Business Logic Errors
  PRODUCT_OUT_OF_STOCK = 'PRODUCT_OUT_OF_STOCK',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  CART_EMPTY = 'CART_EMPTY',
  CART_ITEM_NOT_FOUND = 'CART_ITEM_NOT_FOUND',
  INVALID_QUANTITY = 'INVALID_QUANTITY',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_VERIFICATION_FAILED = 'PAYMENT_VERIFICATION_FAILED',
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
  SHIPPING_ADDRESS_REQUIRED = 'SHIPPING_ADDRESS_REQUIRED',
  INVALID_SHIPPING_ADDRESS = 'INVALID_SHIPPING_ADDRESS',
  SHIPPING_METHOD_REQUIRED = 'SHIPPING_METHOD_REQUIRED',
  SHIPPING_METHOD_UNAVAILABLE = 'SHIPPING_METHOD_UNAVAILABLE',
  SHIPPING_ESTIMATE_FAILED = 'SHIPPING_ESTIMATE_FAILED',
  COMMENT_TOO_SHORT = 'COMMENT_TOO_SHORT',
  COMMENT_TOO_LONG = 'COMMENT_TOO_LONG',
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
  COMMENT_SUBMIT_FAILED = 'COMMENT_SUBMIT_FAILED',

  // Rate Limiting Errors
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  TOO_MANY_LOGIN_ATTEMPTS = 'TOO_MANY_LOGIN_ATTEMPTS',

  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',

  // Server Errors
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Unknown/Generic Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

/**
 * Error code to category mapping
 */
export const ERROR_CATEGORY_MAP: Record<string, ErrorCategory> = {
  // Validation
  [ErrorCode.INVALID_EMAIL]: ErrorCategory.VALIDATION,
  [ErrorCode.INVALID_PASSWORD]: ErrorCategory.VALIDATION,
  [ErrorCode.PASSWORD_TOO_SHORT]: ErrorCategory.VALIDATION,
  [ErrorCode.PASSWORD_TOO_WEAK]: ErrorCategory.VALIDATION,
  [ErrorCode.PASSWORDS_DO_NOT_MATCH]: ErrorCategory.VALIDATION,
  [ErrorCode.INVALID_PHONE]: ErrorCategory.VALIDATION,
  [ErrorCode.INVALID_POSTAL_CODE]: ErrorCategory.VALIDATION,
  [ErrorCode.REQUIRED_FIELD]: ErrorCategory.VALIDATION,
  [ErrorCode.INVALID_FORMAT]: ErrorCategory.VALIDATION,
  [ErrorCode.VALUE_TOO_LONG]: ErrorCategory.VALIDATION,
  [ErrorCode.VALUE_TOO_SHORT]: ErrorCategory.VALIDATION,
  [ErrorCode.INVALID_AGE]: ErrorCategory.VALIDATION,
  [ErrorCode.AGE_TOO_YOUNG]: ErrorCategory.VALIDATION,

  // Authentication
  [ErrorCode.INVALID_CREDENTIALS]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.EMAIL_ALREADY_EXISTS]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.USER_NOT_FOUND]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.SESSION_EXPIRED]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.TOKEN_INVALID]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.TOKEN_EXPIRED]: ErrorCategory.AUTHENTICATION,

  // Authorization
  [ErrorCode.UNAUTHORIZED]: ErrorCategory.AUTHORIZATION,
  [ErrorCode.FORBIDDEN]: ErrorCategory.AUTHORIZATION,
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: ErrorCategory.AUTHORIZATION,

  // Business Logic
  [ErrorCode.PRODUCT_OUT_OF_STOCK]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.PRODUCT_NOT_FOUND]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.CART_EMPTY]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.CART_ITEM_NOT_FOUND]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.INVALID_QUANTITY]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.ORDER_NOT_FOUND]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.PAYMENT_FAILED]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.PAYMENT_VERIFICATION_FAILED]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.PAYMENT_CANCELLED]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.SHIPPING_ADDRESS_REQUIRED]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.INVALID_SHIPPING_ADDRESS]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.SHIPPING_METHOD_REQUIRED]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.SHIPPING_METHOD_UNAVAILABLE]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.SHIPPING_ESTIMATE_FAILED]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.COMMENT_TOO_SHORT]: ErrorCategory.VALIDATION,
  [ErrorCode.COMMENT_TOO_LONG]: ErrorCategory.VALIDATION,
  [ErrorCode.COMMENT_NOT_FOUND]: ErrorCategory.BUSINESS_LOGIC,
  [ErrorCode.COMMENT_SUBMIT_FAILED]: ErrorCategory.BUSINESS_LOGIC,

  // Rate Limiting
  [ErrorCode.RATE_LIMIT_EXCEEDED]: ErrorCategory.RATE_LIMITING,
  [ErrorCode.TOO_MANY_REQUESTS]: ErrorCategory.RATE_LIMITING,
  [ErrorCode.TOO_MANY_LOGIN_ATTEMPTS]: ErrorCategory.RATE_LIMITING,

  // Network
  [ErrorCode.NETWORK_ERROR]: ErrorCategory.NETWORK,
  [ErrorCode.TIMEOUT_ERROR]: ErrorCategory.NETWORK,
  [ErrorCode.CONNECTION_ERROR]: ErrorCategory.NETWORK,

  // Server
  [ErrorCode.SERVER_ERROR]: ErrorCategory.SERVER,
  [ErrorCode.SERVICE_UNAVAILABLE]: ErrorCategory.SERVER,
  [ErrorCode.DATABASE_ERROR]: ErrorCategory.SERVER,

  // Unknown
  [ErrorCode.UNKNOWN_ERROR]: ErrorCategory.UNKNOWN,
  [ErrorCode.UNEXPECTED_ERROR]: ErrorCategory.UNKNOWN,
};

/**
 * Helper type for error with user-friendly message
 */
export interface ProcessedError {
  /** Original error code */
  code: string;

  /** User-friendly message to display */
  userMessage: string;

  /** Error severity */
  severity: ErrorSeverity;

  /** Error category */
  category: ErrorCategory;

  /** Original error details */
  details?: ErrorDetails;

  /** Field errors (for forms) */
  fieldErrors?: Record<string, string>;

  /** Whether this error can be retried */
  retryable: boolean;

  /** Suggested action for the user (if any) */
  action?: string;
}

/**
 * Options for error handler
 */
export interface ErrorHandlerOptions {
  /** Whether to show toast notification automatically */
  showToast?: boolean;

  /** Whether to log the error to console/logging service */
  logError?: boolean;

  /** Custom fallback message if error code is not found */
  fallbackMessage?: string;

  /** Environment (used to determine what details to show) */
  environment?: 'development' | 'production';
}
