import api from './api';
import Cookies from 'js-cookie';
import { User, UserAddress } from '@/contexts/UserContext';

export interface ApiResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const userService = {
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get('/users/me/');
        return response.data;
    },

    updateProfile: async (userData: Partial<User>): Promise<User> => {
        const response = await api.patch('/users/me/', userData);
        return response.data;
    },

    getAddresses: async (): Promise<ApiResponse<UserAddress>> => {
        const response = await api.get('/users/addresses/');
        return response.data;
    },

    addAddress: async (addressData: UserAddress) => {
        const response = await api.post('/users/addresses/', addressData);
        return response.data;
    },

    updateAddress: async (addressId: string, addressData: UserAddress) => {
        const response = await api.put(`/users/addresses/${addressId}/`, addressData);
        return response.data;
    },

    deleteAddress: async (addressId: string) => {
        await api.delete(`/users/addresses/${addressId}/`);
    },

    setDefaultAddress: async (addressId: string) => {
        const response = await api.post(`/users/addresses/${addressId}/set_default/`);
        return response.data;
    },

    getOrders: async (page = 1, limit = 10): Promise<ApiResponse<any>> => {
        const response = await api.get(`/shop/orders/?page=${page}&limit=${limit}`);
        return response.data;
    },

    getOrderDetails: async (orderId: string) => {
        const response = await api.get(`/shop/orders/${orderId}/`);
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token') || !!Cookies.get('access_token');
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        Cookies.remove('access_token');
    }
};