import api from "./api";
import Cookies from "js-cookie";

export const loginService = {
    signup: async (email: string, password: string, confirmPassword: string, age: number) => {
        try {
            const response = await api.post("/users/signup/", {
                email,
                password,
                confirm_password: confirmPassword,
                age,
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: "Signup failed" };
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await api.post("/users/login/", {
                email,
                password,
            });

            if (response.data.access) {
                // ✅ Store tokens in localStorage
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                // ✅ Store access_token in cookies (so middleware can access it)
                Cookies.set("access_token", response.data.access, { expires: 1 }); // Expires in 1 day
            }

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: "Login failed" };
        }
    },

    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        Cookies.remove("access_token"); // ✅ Remove cookie on logout
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("access_token"); // Check if access token exists
    },
};
