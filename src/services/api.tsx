// src/services/api.tsx with anonymous cart ID and error handling
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
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
            console.log('[API] Server-side: Using absolute URL:', fullUrl);
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
        console.log('[API] Server-side: Using default absolute URL:', fullUrl);
        return fullUrl;
    }

    return '/api/';
}

const baseURL = getBaseUrl();
const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Log the configured baseURL for debugging
console.log('[API] Axios instance created with baseURL:', baseURL);

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem("refresh_token")
        : null;

    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    try {
        const response = await axios.post(
            `${getBaseUrl()}/users/token/refresh/`,
            { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh; // New refresh token if rotation is enabled

        // Update tokens in storage
        if (typeof window !== 'undefined') {
            localStorage.setItem("access_token", newAccessToken);
            Cookies.set("access_token", newAccessToken, { expires: 1 }); // 1 day

            // Update refresh token if backend sent a new one (rotation enabled)
            if (newRefreshToken) {
                localStorage.setItem("refresh_token", newRefreshToken);
            }
        }

        return newAccessToken;
    } catch (error) {
        // Refresh token is invalid or expired - logout user
        if (typeof window !== 'undefined') {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            Cookies.remove("access_token");

            // Redirect to login page
            window.location.href = "/login?session_expired=true";
        }
        throw error;
    }
};

api.interceptors.request.use(
    async (config) => {
        console.log('[API] ========== Request Interceptor ==========');
        console.log('[API] Request URL:', config.url);
        console.log('[API] Base URL:', config.baseURL);
        console.log('[API] Full URL:', `${config.baseURL}${config.url}`);
        console.log('[API] Is Server:', typeof window === 'undefined');

        // Add auth token if available
        let token: string | null = null;

        // Check if we're on the server or client
        if (typeof window === 'undefined') {
            // Server-side: Dynamically import and use Next.js cookies() function
            try {
                console.log('[API] Server-side: Getting cookies from next/headers');
                const { cookies } = await import('next/headers');
                const cookieStore = await cookies();
                const accessTokenCookie = cookieStore.get('access_token');
                token = accessTokenCookie?.value || null;
                console.log('[API] Server token found:', !!token);
                if (token) {
                    console.log('[API] Server token (first 20 chars):', token.substring(0, 20) + '...');
                }
            } catch (error) {
                console.error('[API] Error getting server cookies:', error);
                token = null;
            }
        } else {
            // Client-side: Use js-cookie and localStorage
            console.log('[API] Client-side: Getting cookies from js-cookie');
            const cookieToken = Cookies.get("access_token");
            const localStorageToken = localStorage.getItem("access_token");
            token = cookieToken || localStorageToken;
            console.log('[API] Client cookie token found:', !!cookieToken);
            console.log('[API] Client localStorage token found:', !!localStorageToken);
            console.log('[API] Client final token found:', !!token);
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[API] Authorization header set');
        } else {
            // Explicitly remove Authorization header when no token is available
            // This ensures the header doesn't persist after logout
            delete config.headers.Authorization;
            console.log('[API] No token available - Authorization header removed');
        }

        // Add anonymous cart ID header if available and not already authenticated
        if (!token) {
            if (typeof window !== 'undefined') {
                const anonymousCartId = Cookies.get("anonymous_cart_id");
                if (anonymousCartId) {
                    config.headers["X-Anonymous-Cart-ID"] = anonymousCartId;
                    console.log('[API] Anonymous cart ID header added');
                }
            } else {
                try {
                    const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    const anonymousCartId = cookieStore.get("anonymous_cart_id")?.value;
                    if (anonymousCartId) {
                        config.headers["X-Anonymous-Cart-ID"] = anonymousCartId;
                        console.log('[API] Server anonymous cart ID header added');
                    }
                } catch (error) {
                    // Ignore errors getting anonymous cart ID
                }
            }
        }

        // Add breadcrumb for debugging
        addBreadcrumb('http', `${config.method?.toUpperCase()} ${config.url}`, {
            method: config.method,
            url: config.url,
        });

        console.log('[API] Final request headers:', {
            Authorization: config.headers.Authorization ? 'Bearer ***' : 'None',
            'X-Anonymous-Cart-ID': config.headers['X-Anonymous-Cart-ID'] || 'None'
        });

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for error handling and automatic token refresh
 * Transforms backend errors to StandardErrorResponse format
 */
api.interceptors.response.use(
    (response) => {
        // Success response - pass through
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const responseData = error.response?.data as BackendErrorResponse | undefined;

        // Check if this is a token expiry error
        const isTokenExpired =
            status === 401 &&
            responseData?.code === "token_not_valid" &&
            responseData?.messages?.some((msg: TokenErrorMessage) => msg.message === "Token is expired");

        // Attempt to refresh token if:
        // 1. Status is 401 (Unauthorized)
        // 2. We haven't already tried to refresh for this request
        // 3. The error is not from the refresh endpoint itself
        if (
            (status === 401 || isTokenExpired) &&
            !originalRequest._retry &&
            originalRequest.url !== "/users/token/refresh/"
        ) {
            if (isRefreshing) {
                // Another request is already refreshing the token
                // Queue this request to be retried after refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshAccessToken();

                // Update the authorization header with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                // Process queued requests
                processQueue(null, newAccessToken);

                // Retry the original request with new token
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - reject all queued requests
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

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
 * Token error message structure from backend
 */
interface TokenErrorMessage {
    message: string;
    token_type?: string;
}

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
    messages?: TokenErrorMessage[];
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