// src/services/publicApi.tsx
// Public API client for static content (blog posts, categories, etc.)
// Does NOT use cookies() on server-side to allow static page generation
import axios, { AxiosError } from "axios";
import { StandardErrorResponse, ErrorCode } from "@/types/error";
import { addBreadcrumb } from "@/utils/errorLogger";

function getBaseUrl() {
    const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Check if we're on the server-side
    const isServer = typeof window === 'undefined';

    if (configuredUrl) {
        // If the configured URL is relative and we're on the server, make it absolute
        if (isServer && configuredUrl.startsWith('/')) {
            // Use localhost for development, or construct from environment
            const host = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000';
            const fullUrl = `${host}${configuredUrl}`;
            console.log('[PublicAPI] Server-side: Using absolute URL:', fullUrl);
            return fullUrl;
        }
        return configuredUrl;
    }

    // Warn if NEXT_PUBLIC_BASE_URL is not set
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            'NEXT_PUBLIC_BASE_URL environment variable is not set. Falling back to "/api/". ' +
            'Please set NEXT_PUBLIC_BASE_URL in your .env file for proper API configuration.'
        );
    }

    // Default fallback
    if (isServer) {
        const host = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000';
        const fullUrl = `${host}/api/`;
        console.log('[PublicAPI] Server-side: Using default absolute URL:', fullUrl);
        return fullUrl;
    }

    return '/api/';
}

const publicApi = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

publicApi.interceptors.request.use(
    async (config) => {
        // No authentication headers for public API
        // This allows static page generation without cookies()

        // Add breadcrumb for debugging
        addBreadcrumb('http', `${config.method?.toUpperCase()} ${config.url}`, {
            method: config.method,
            url: config.url,
        });

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for error handling
 * Transforms backend errors to StandardErrorResponse format
 */
publicApi.interceptors.response.use(
    (response) => {
        // Success response - pass through
        return response;
    },
    async (error: AxiosError) => {
        // Transform error to standard format
        const standardError = transformAxiosErrorToStandard(error);

        // Add breadcrumb for error
        addBreadcrumb('error', `API Error: ${standardError.code}`, {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
        });

        // Reject with standardized error
        return Promise.reject(standardError);
    }
);

/**
 * Backend error response structure (can vary)
 * Supports both the new standardized format (PR #34) and legacy formats
 */
interface BackendErrorResponse {
    // New standardized format (PR #34)
    error?: {
        code: string;
        message: string;
        details: Record<string, string[] | unknown>;
    };

    // Legacy formats
    code?: string;
    message?: string;
    userMessage?: string;
    details?: Record<string, unknown>;
    severity?: string;
    timestamp?: string;
    requestId?: string;
    detail?: string;
    error_code?: string;
    error_message?: string;
}

/**
 * Transform Axios error to StandardErrorResponse
 */
function transformAxiosErrorToStandard(error: AxiosError): StandardErrorResponse {
    const responseData = error.response?.data as BackendErrorResponse | undefined;
    const status = error.response?.status;

    // Check for new standardized format (PR #34) FIRST
    if (responseData?.error && typeof responseData.error === 'object' && 'code' in responseData.error) {
        const errorData = responseData.error;
        return {
            code: errorData.code,
            message: errorData.message,
            details: errorData.details,
            severity: mapErrorCodeToSeverity(errorData.code),
        };
    }

    // Check if backend already sends legacy standard format
    if (responseData?.code && responseData?.message && responseData?.severity) {
        return {
            code: responseData.code,
            message: responseData.message,
            userMessage: responseData.userMessage,
            details: responseData.details,
            severity: responseData.severity as 'error' | 'warning' | 'info',
            timestamp: responseData.timestamp,
            requestId: responseData.requestId,
        };
    }

    // Handle legacy error.detail format (string)
    if (responseData?.detail && typeof responseData.detail === 'string') {
        return inferErrorFromMessage(responseData.detail, status);
    }

    // Handle legacy single-level message
    if (responseData?.message && typeof responseData.message === 'string') {
        return inferErrorFromMessage(responseData.message, status);
    }

    // Handle existing format: { error_code, error_message }
    if (responseData?.error_code || responseData?.error_message) {
        return {
            code: normalizeErrorCode(responseData.error_code) || ErrorCode.UNKNOWN_ERROR,
            message: responseData.error_message || 'Unknown error',
            severity: 'error',
        };
    }

    // Network error (no response)
    if (error.request && !error.response) {
        return {
            code: ErrorCode.NETWORK_ERROR,
            message: 'Network error - no response from server',
            severity: 'error',
        };
    }

    // Timeout error
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
            code: ErrorCode.TIMEOUT_ERROR,
            message: 'Request timeout',
            severity: 'error',
        };
    }

    // Fallback to status-based inference
    return inferErrorFromStatus(status, error.message);
}

/**
 * Map error code to severity level
 * Used for the new standardized error format (PR #34)
 */
function mapErrorCodeToSeverity(code: string): 'error' | 'warning' | 'info' {
    switch (code) {
        case 'THROTTLED':
        case 'RATE_LIMIT_EXCEEDED':
            return 'warning';
        case 'VALIDATION_ERROR':
        case 'PARSE_ERROR':
            return 'error';
        case 'NOT_AUTHENTICATED':
        case 'AUTHENTICATION_FAILED':
        case 'PERMISSION_DENIED':
            return 'error';
        case 'NOT_FOUND':
        case 'METHOD_NOT_ALLOWED':
            return 'error';
        case 'INTERNAL_ERROR':
        case 'UNKNOWN_ERROR':
            return 'error';
        default:
            return 'error';
    }
}

/**
 * Infer error from message and status
 */
function inferErrorFromMessage(message: string, status?: number): StandardErrorResponse {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('not found') || lowerMessage.includes('یافت نشد')) {
        return { code: ErrorCode.USER_NOT_FOUND, message, severity: 'error' };
    }

    if (lowerMessage.includes('unauthorized') || status === 401) {
        return { code: ErrorCode.UNAUTHORIZED, message, severity: 'error' };
    }

    if (lowerMessage.includes('forbidden') || status === 403) {
        return { code: ErrorCode.FORBIDDEN, message, severity: 'error' };
    }

    if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many')) {
        return { code: ErrorCode.RATE_LIMIT_EXCEEDED, message, severity: 'warning' };
    }

    return inferErrorFromStatus(status, message);
}

/**
 * Infer error from HTTP status
 */
function inferErrorFromStatus(status?: number, message?: string): StandardErrorResponse {
    switch (status) {
        case 400:
            return { code: ErrorCode.INVALID_FORMAT, message: message || 'Bad request', severity: 'error' };
        case 401:
            return { code: ErrorCode.UNAUTHORIZED, message: message || 'Unauthorized', severity: 'error' };
        case 403:
            return { code: ErrorCode.FORBIDDEN, message: message || 'Forbidden', severity: 'error' };
        case 404:
            return { code: ErrorCode.USER_NOT_FOUND, message: message || 'Not found', severity: 'error' };
        case 429:
            return { code: ErrorCode.RATE_LIMIT_EXCEEDED, message: message || 'Too many requests', severity: 'warning' };
        case 500:
            return { code: ErrorCode.SERVER_ERROR, message: message || 'Internal server error', severity: 'error' };
        case 503:
            return { code: ErrorCode.SERVICE_UNAVAILABLE, message: message || 'Service unavailable', severity: 'error' };
        default:
            return { code: ErrorCode.UNKNOWN_ERROR, message: message || 'Unknown error', severity: 'error' };
    }
}

/**
 * Normalize error code from backend
 */
function normalizeErrorCode(code?: string): string | undefined {
    if (!code) return undefined;
    return code.toUpperCase().replace(/[-\s]/g, '_');
}

export default publicApi;
