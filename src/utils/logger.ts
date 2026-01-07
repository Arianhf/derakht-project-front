/**
 * Development-only logger utility
 * Automatically prevents logs in production and provides structured logging capabilities
 */

/**
 * Log levels enum for type safety
 */
export enum LogLevel {
  DEBUG = 'debug',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Context object type for structured logging
 * Allows passing additional metadata with log messages
 */
export interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger interface defining all logging methods
 */
interface Logger {
  debug(message: string, context?: LogContext): void;
  log(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

/**
 * Checks if the current environment is development
 * @returns true if NODE_ENV is 'development', false otherwise
 */
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Formats the log message with timestamp, level, and optional context
 * @param level - The log level
 * @param message - The log message
 * @param context - Optional context object with additional metadata
 * @returns Formatted log message string
 */
const formatMessage = (
  level: LogLevel,
  message: string,
  context?: LogContext
): string => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (context && Object.keys(context).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(context, null, 2)}`;
  }

  return `${prefix} ${message}`;
};

/**
 * Development-only logger
 * All methods are no-ops in production environments
 *
 * Usage:
 * ```typescript
 * import logger from '@/utils/logger';
 *
 * logger.log('User logged in', { userId: '123' });
 * logger.warn('API rate limit approaching');
 * logger.error('Payment processing failed', { orderId: '456' });
 * logger.debug('Cache hit', { key: 'user:123' });
 * ```
 */
const logger: Logger = {
  /**
   * Debug level logging - for detailed debugging information
   * Only logs in development environment
   * @param message - The debug message
   * @param context - Optional context object
   */
  debug(message: string, context?: LogContext): void {
    if (isDevelopment()) {
      console.debug(formatMessage(LogLevel.DEBUG, message, context));
    }
  },

  /**
   * Info level logging - for general information
   * Only logs in development environment
   * @param message - The log message
   * @param context - Optional context object
   */
  log(message: string, context?: LogContext): void {
    if (isDevelopment()) {
      console.log(formatMessage(LogLevel.LOG, message, context));
    }
  },

  /**
   * Warning level logging - for warning conditions
   * Only logs in development environment
   * @param message - The warning message
   * @param context - Optional context object
   */
  warn(message: string, context?: LogContext): void {
    if (isDevelopment()) {
      console.warn(formatMessage(LogLevel.WARN, message, context));
    }
  },

  /**
   * Error level logging - for error conditions
   * Only logs in development environment
   * @param message - The error message
   * @param context - Optional context object
   */
  error(message: string, context?: LogContext): void {
    if (isDevelopment()) {
      console.error(formatMessage(LogLevel.ERROR, message, context));
    }
  },
};

export default logger;
