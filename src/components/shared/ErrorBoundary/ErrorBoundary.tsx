'use client';

/**
 * Error Boundary Component
 *
 * Catches React component errors and displays a fallback UI.
 * Prevents the entire application from crashing when an error occurs.
 */

import React, { Component, ReactNode } from 'react';
import { logError } from '@/utils/errorLogger';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches errors in the React component tree
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error
    logError({
      originalError: error,
      processedError: {
        code: 'REACT_ERROR',
        userMessage: 'خطایی در نمایش صفحه رخ داد',
        severity: 'error',
        category: 'UNKNOWN' as any,
        retryable: false,
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if resetKeys change
    if (
      this.state.hasError &&
      prevProps.resetKeys &&
      this.props.resetKeys &&
      prevProps.resetKeys !== this.props.resetKeys
    ) {
      this.reset();
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h1 className={styles.errorTitle}>مشکلی پیش آمده است</h1>
            <p className={styles.errorMessage}>
              متأسفانه خطایی در نمایش این بخش رخ داده است.
              <br />
              لطفاً صفحه را دوباره بارگذاری کنید یا به صفحه اصلی بروید.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>جزئیات خطا (فقط در حالت توسعه)</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className={styles.errorActions}>
              <button onClick={this.handleReload} className={styles.primaryButton}>
                بارگذاری مجدد
              </button>
              <button onClick={this.handleGoHome} className={styles.secondaryButton}>
                بازگشت به صفحه اصلی
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
