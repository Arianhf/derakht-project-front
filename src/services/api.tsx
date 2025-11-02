// src/services/api.tsx with anonymous cart ID and error handling
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { StandardErrorResponse, ErrorCode } from "@/types/error";
import { addBreadcrumb } from "@/utils/errorLogger";

function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // Warn if NEXT_PUBLIC_BASE_URL is not set
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            'NEXT_PUBLIC_BASE_URL environment variable is not set. Falling back to "/api". ' +
            'Please set NEXT_PUBLIC_BASE_URL in your .env file for proper API configuration.'
        );
    }

    return '/api';
}

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const cookieToken = Cookies.get("access_token");
        const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
        const token = cookieToken || localStorageToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add anonymous cart ID header if available and not already authenticated
        if (!token) {
            const anonymousCartId = Cookies.get("anonymous_cart_id");
            if (anonymousCartId) {
                config.headers["X-Anonymous-Cart-ID"] = anonymousCartId;
            }
        }

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
api.interceptors.response.use(
    (response) => {
        // Success response - pass through
        return response;
    },
    (error: AxiosError) => {
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
 */
interface BackendErrorResponse {
    code?: string;
    message?: string;
    userMessage?: string;
    details?: Record<string, unknown>;
    severity?: string;
    timestamp?: string;
    requestId?: string;
    error?: string;
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

    // Check if backend already sends standard format
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

    // Handle common backend error formats
    if (responseData?.error) {
        return inferErrorFromMessage(responseData.error, status);
    }

    if (responseData?.detail) {
        return inferErrorFromMessage(responseData.detail, status);
    }

    if (responseData?.message) {
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
 * Infer error from message and status
 */
function inferErrorFromMessage(message: string, status?: number): StandardErrorResponse {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
        return { code: ErrorCode.EMAIL_ALREADY_EXISTS, message, severity: 'error' };
    }

    if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('اشتباه')) {
        return { code: ErrorCode.INVALID_CREDENTIALS, message, severity: 'error' };
    }

    if (lowerMessage.includes('not found') || lowerMessage.includes('یافت نشد')) {
        return { code: ErrorCode.USER_NOT_FOUND, message, severity: 'error' };
    }

    if (lowerMessage.includes('expired') || lowerMessage.includes('منقضی')) {
        return { code: ErrorCode.SESSION_EXPIRED, message, severity: 'error' };
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

export default api;