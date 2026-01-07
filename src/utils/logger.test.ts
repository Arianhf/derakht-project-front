/**
 * Tests for development-only logger utility
 */

import logger, { LogLevel, LogContext } from './logger';

describe('Logger Utility', () => {
  const originalEnv = process.env.NODE_ENV;
  let consoleDebugSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock all console methods
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Restore all mocks
    consoleDebugSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    describe('logger.debug', () => {
      it('should call console.debug with formatted message', () => {
        logger.debug('Test debug message');

        expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleDebugSpy.mock.calls[0][0];
        expect(calledMessage).toContain('[DEBUG]');
        expect(calledMessage).toContain('Test debug message');
        expect(calledMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // Timestamp regex
      });

      it('should include context object in formatted message', () => {
        const context: LogContext = { userId: '123', action: 'login' };
        logger.debug('User action', context);

        expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleDebugSpy.mock.calls[0][0];
        expect(calledMessage).toContain('User action');
        expect(calledMessage).toContain('"userId": "123"');
        expect(calledMessage).toContain('"action": "login"');
      });

      it('should handle empty context object', () => {
        logger.debug('Test message', {});

        expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleDebugSpy.mock.calls[0][0];
        expect(calledMessage).toContain('Test message');
        expect(calledMessage).not.toContain('{}'); // Empty context should not be included
      });

      it('should handle undefined context', () => {
        logger.debug('Test message', undefined);

        expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleDebugSpy.mock.calls[0][0];
        expect(calledMessage).toContain('Test message');
      });
    });

    describe('logger.log', () => {
      it('should call console.log with formatted message', () => {
        logger.log('Test log message');

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleLogSpy.mock.calls[0][0];
        expect(calledMessage).toContain('[LOG]');
        expect(calledMessage).toContain('Test log message');
        expect(calledMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });

      it('should include context object in formatted message', () => {
        const context: LogContext = { endpoint: '/api/users', status: 200 };
        logger.log('API request successful', context);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleLogSpy.mock.calls[0][0];
        expect(calledMessage).toContain('API request successful');
        expect(calledMessage).toContain('"endpoint": "/api/users"');
        expect(calledMessage).toContain('"status": 200');
      });

      it('should handle nested context objects', () => {
        const context: LogContext = {
          user: { id: '123', name: 'Test User' },
          metadata: { timestamp: 1234567890 },
        };
        logger.log('Complex context', context);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleLogSpy.mock.calls[0][0];
        expect(calledMessage).toContain('"id": "123"');
        expect(calledMessage).toContain('"name": "Test User"');
        expect(calledMessage).toContain('"timestamp": 1234567890');
      });
    });

    describe('logger.warn', () => {
      it('should call console.warn with formatted message', () => {
        logger.warn('Test warning message');

        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleWarnSpy.mock.calls[0][0];
        expect(calledMessage).toContain('[WARN]');
        expect(calledMessage).toContain('Test warning message');
        expect(calledMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });

      it('should include context object in formatted message', () => {
        const context: LogContext = { threshold: 80, current: 75 };
        logger.warn('Approaching rate limit', context);

        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleWarnSpy.mock.calls[0][0];
        expect(calledMessage).toContain('Approaching rate limit');
        expect(calledMessage).toContain('"threshold": 80');
        expect(calledMessage).toContain('"current": 75');
      });
    });

    describe('logger.error', () => {
      it('should call console.error with formatted message', () => {
        logger.error('Test error message');

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleErrorSpy.mock.calls[0][0];
        expect(calledMessage).toContain('[ERROR]');
        expect(calledMessage).toContain('Test error message');
        expect(calledMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });

      it('should include context object in formatted message', () => {
        const context: LogContext = {
          error: 'Payment failed',
          orderId: '456',
          amount: 1000,
        };
        logger.error('Payment processing error', context);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        const calledMessage = consoleErrorSpy.mock.calls[0][0];
        expect(calledMessage).toContain('Payment processing error');
        expect(calledMessage).toContain('"error": "Payment failed"');
        expect(calledMessage).toContain('"orderId": "456"');
        expect(calledMessage).toContain('"amount": 1000');
      });
    });

    describe('LogLevel enum', () => {
      it('should have correct log level values', () => {
        expect(LogLevel.DEBUG).toBe('debug');
        expect(LogLevel.LOG).toBe('log');
        expect(LogLevel.WARN).toBe('warn');
        expect(LogLevel.ERROR).toBe('error');
      });
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should not call console.debug in production', () => {
      logger.debug('Test debug message', { test: 'data' });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should not call console.log in production', () => {
      logger.log('Test log message', { test: 'data' });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should not call console.warn in production', () => {
      logger.warn('Test warning message', { test: 'data' });
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not call console.error in production', () => {
      logger.error('Test error message', { test: 'data' });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle multiple log calls without output', () => {
      logger.debug('Debug 1');
      logger.log('Log 1');
      logger.warn('Warn 1');
      logger.error('Error 1');
      logger.debug('Debug 2', { context: 'data' });
      logger.log('Log 2', { context: 'data' });

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should not call console methods in test environment', () => {
      logger.debug('Test debug');
      logger.log('Test log');
      logger.warn('Test warn');
      logger.error('Test error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should handle special characters in messages', () => {
      logger.log('Message with "quotes" and \'apostrophes\' and \n newlines');
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string messages', () => {
      logger.log('');
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const calledMessage = consoleLogSpy.mock.calls[0][0];
      expect(calledMessage).toContain('[LOG]');
    });

    it('should handle context with null values', () => {
      logger.log('Test message', { value: null });
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const calledMessage = consoleLogSpy.mock.calls[0][0];
      expect(calledMessage).toContain('"value": null');
    });

    it('should handle context with array values', () => {
      logger.log('Test message', { items: [1, 2, 3] });
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const calledMessage = consoleLogSpy.mock.calls[0][0];
      expect(calledMessage).toContain('"items": [');
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      logger.log(longMessage);
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const calledMessage = consoleLogSpy.mock.calls[0][0];
      expect(calledMessage).toContain(longMessage);
    });
  });
});
