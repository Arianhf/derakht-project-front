// src/services/loginService.tsx with anonymous cart merging and error handling
import api from "./api";
import Cookies from "js-cookie";
import { shopService } from "./shopService";
import { StandardErrorResponse } from "@/types/error";

export const loginService = {
    signup: async (email: string, password: string, confirmPassword: string, age: number) => {
        try {
            const response = await api.post("/users/signup/", {
                email,
                password,
                confirm_password: confirmPassword,
                age,
            });

            // After successful signup, automatically login and merge carts
            if (response.data) {
                await loginService.login(email, password);
            }

            return response.data;
        } catch (error: unknown) {
            // Error is already transformed to StandardErrorResponse by axios interceptor
            // Just re-throw it for the calling code to handle
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await api.post("/users/login/", {
                email,
                password,
            });

            if (response.data.access) {
                // Store tokens in localStorage
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                // Store access_token in cookies (so middleware can access it)
                Cookies.set("access_token", response.data.access, { expires: 1 }); // Expires in 1 day

                // Merge anonymous cart with user cart
                try {
                    await shopService.mergeAnonymousCart();
                } catch (cartError) {
                    // Error merging carts - don't fail login
                }
            }

            return response.data;
        } catch (error: unknown) {
            // Error is already transformed to StandardErrorResponse by axios interceptor
            // Just re-throw it for the calling code to handle
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        Cookies.remove("access_token"); // Remove cookie on logout
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("access_token"); // Check if access token exists
    },
};