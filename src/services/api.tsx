// src/services/api.tsx with anonymous cart ID
import axios from "axios";
import Cookies from "js-cookie";

function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
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
        const token = Cookies.get("access_token") || localStorage.getItem("access_token");
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

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;