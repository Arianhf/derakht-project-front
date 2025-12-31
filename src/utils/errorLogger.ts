/**
 * Error Logger Utility
 *
 * Structured error logging with support for different environments and error tracking services.
 * Can be extended to integrate with services like Sentry, LogRocket, etc.
 */

import { ProcessedError } from '@/types/error';

/**
 * Error log entry interface
 */
interface ErrorLogEntry {
  originalError: unknown;
  processedError: ProcessedError;
  timestamp: string;
  environment: 'development' | 'production';
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
}

/**
 * Error logger configuration
 */
interface ErrorLoggerConfig {
  enabled: boolean;
  logToConsole: boolean;
  logToService: boolean;
  serviceName?: 'sentry' | 'logrocket' | 'custom';
  includeStackTrace: boolean;
  includeBreadcrumbs: boolean;
}

/**
 * Default logger configuration
 */
const defaultConfig: ErrorLoggerConfig = {
  enabled: true,
  logToConsole: true,
  logToService: false, // Set to true when error tracking service is configured
  serviceName: undefined,
  includeStackTrace: process.env.NODE_ENV !== 'production',
  includeBreadcrumbs: true,
};

let config: ErrorLoggerConfig = { ...defaultConfig };

/**
 * Configure the error logger
 */
export function configureErrorLogger(
  customConfig: Partial<ErrorLoggerConfig>
): void {
  config = { ...config, ...customConfig };
}

/**
 * Log error with structured format
 */
export function logError(entry: ErrorLogEntry): void {
  if (!config.enabled) return;

  // Enhance entry with additional context
  const enhancedEntry = enhanceErrorEntry(entry);

  // Log to console in development
  if (config.logToConsole) {
    logToConsole(enhancedEntry);
  }

  // Log to error tracking service
  if (config.logToService && config.serviceName) {
    logToService(enhancedEntry);
  }
}

/**
 * Enhance error entry with browser/context information
 */
function enhanceErrorEntry(entry: ErrorLogEntry): ErrorLogEntry {
  return {
    ...entry,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    // userId and sessionId should be added from UserContext if available
  };
}

/**
 * Log error to console with appropriate formatting
 */
function logToConsole(entry: ErrorLogEntry): void {
  const { originalError, processedError, timestamp, environment } = entry;

  // Different formatting for development vs production
  if (environment === 'development') {
    console.group(
      `%c🔴 Error: ${processedError.code}`,
      'color: #ef4444; font-weight: bold; font-size: 12px;'
    );
    console.log('%cUser Message:', 'color: #f59e0b; font-weight: bold;', processedError.userMessage);
    console.log('%cCategory:', 'color: #8b5cf6;', processedError.category);
    console.log('%cSeverity:', 'color: #ec4899;', processedError.severity);
    console.log('%cRetryable:', 'color: #06b6d4;', processedError.retryable);

    if (processedError.details) {
      console.log('%cDetails:', 'color: #10b981;', processedError.details);
    }

    if (processedError.fieldErrors) {
      console.log('%cField Errors:', 'color: #f97316;', processedError.fieldErrors);
    }

    console.log('%cOriginal Error:', 'color: #64748b;', originalError);
    console.log('%cTimestamp:', 'color: #64748b;', timestamp);

    if (entry.url) {
      console.log('%cURL:', 'color: #64748b;', entry.url);
    }

    // Log stack trace if available
    if (config.includeStackTrace && originalError && typeof originalError === 'object' && 'stack' in originalError) {
      console.log('%cStack Trace:', 'color: #64748b;');
      console.log(originalError.stack);
    }

    console.groupEnd();
  } else {
    // Simplified production logging
    console.error('[Error]', {
      code: processedError.code,
      message: processedError.userMessage,
      category: processedError.category,
      timestamp,
      url: entry.url,
    });
  }
}

/**
 * Log error to external error tracking service
 * This is a placeholder that can be extended based on your chosen service
 */
function logToService(entry: ErrorLogEntry): void {
  const { serviceName } = config;

  try {
    switch (serviceName) {
      case 'sentry':
        logToSentry(entry);
        break;
      case 'logrocket':
        logToLogRocket(entry);
        break;
      case 'custom':
        logToCustomService(entry);
        break;
      default:
        console.warn('Error tracking service not configured');
    }
  } catch (error) {
    // Don't let logging errors break the application
    console.error('Failed to log error to service:', error);
  }
}

/**
 * Log to Sentry (requires @sentry/nextjs package)
 * Uncomment and configure when Sentry is set up
 */
function logToSentry(entry: ErrorLogEntry): void {
  // Example Sentry integration:
  /*
  import * as Sentry from '@sentry/nextjs';

  Sentry.captureException(entry.originalError, {
    level: entry.processedError.severity === 'error' ? 'error' : 'warning',
    tags: {
      errorCode: entry.processedError.code,
      category: entry.processedError.category,
    },
    extra: {
      processedError: entry.processedError,
      details: entry.processedError.details,
    },
    user: entry.userId ? { id: entry.userId } : undefined,
  });
  */

  console.log('Sentry logging not yet configured');
}

/**
 * Log to LogRocket (requires logrocket package)
 * Uncomment and configure when LogRocket is set up
 */
function logToLogRocket(entry: ErrorLogEntry): void {
  // Example LogRocket integration:
  /*
  import LogRocket from 'logrocket';

  LogRocket.captureException(entry.originalError, {
    tags: {
      errorCode: entry.processedError.code,
      category: entry.processedError.category,
    },
    extra: {
      userMessage: entry.processedError.userMessage,
      details: entry.processedError.details,
    },
  });
  */

  console.log('LogRocket logging not yet configured');
}

/**
 * Log to custom error tracking service
 * Implement this based on your specific service
 */
function logToCustomService(entry: ErrorLogEntry): void {
  // Example: Send to custom API endpoint
  /*
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: entry.processedError.code,
      message: entry.processedError.userMessage,
      category: entry.processedError.category,
      severity: entry.processedError.severity,
      timestamp: entry.timestamp,
      url: entry.url,
      userAgent: entry.userAgent,
      userId: entry.userId,
      sessionId: entry.sessionId,
      details: entry.processedError.details,
    }),
  }).catch(console.error);
  */

  console.log('Custom error logging not yet configured');
}

/**
 * Breadcrumb data type for additional context
 */
type BreadcrumbData = Record<string, unknown>;

/**
 * Breadcrumb entry interface
 */
interface BreadcrumbEntry {
  timestamp: string;
  category: string;
  message: string;
  data?: BreadcrumbData;
}

/**
 * Breadcrumb tracking for error context
 * This helps understand what actions led to an error
 */
const breadcrumbs: BreadcrumbEntry[] = [];

const MAX_BREADCRUMBS = 50;

/**
 * Add a breadcrumb for tracking user actions
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: BreadcrumbData
): void {
  if (!config.includeBreadcrumbs) return;

  breadcrumbs.push({
    timestamp: new Date().toISOString(),
    category,
    message,
    data,
  });

  // Keep only last MAX_BREADCRUMBS
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }
}

/**
 * Get recent breadcrumbs
 */
export function getBreadcrumbs(count?: number): BreadcrumbEntry[] {
  if (!count) return [...breadcrumbs];
  return breadcrumbs.slice(-count);
}

/**
 * Clear all breadcrumbs
 */
export function clearBreadcrumbs(): void {
  breadcrumbs.length = 0;
}

/**
 * Log info message (for non-error logging)
 */
export function logInfo(message: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Info] ${message}`, data || '');
  }
}

/**
 * Log warning message
 */
export function logWarning(message: string, data?: Record<string, unknown>): void {
  console.warn(`[Warning] ${message}`, data || '');
}

/**
 * Log debug message (only in development)
 */
export function logDebug(message: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Debug] ${message}`, data || '');
  }
}
