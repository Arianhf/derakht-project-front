import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for common headers, auth tokens, etc.
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors (401, 403, etc.)
        return Promise.reject(error);
    }
);

export default api;