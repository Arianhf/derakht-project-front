// src/services/shopService.ts
import api from "./api";
import { ShippingInfo, ShopFilters, SortOption } from "@/types/shop";

export const shopService = {
    // Product related endpoints with enhanced filtering
    getProducts: async (filters?: ShopFilters) => {
        // Convert filters to query parameters
        const queryParams: Record<string, string> = {};

        if (filters?.searchTerm) {
            queryParams.search = filters.searchTerm;
        }

        if (filters?.category) {
            queryParams.category = filters.category;
        }

        if (filters?.price?.min !== undefined) {
            queryParams.min_price = filters.price.min.toString();
        }

        if (filters?.price?.max !== undefined) {
            queryParams.max_price = filters.price.max.toString();
        }

        if (filters?.sort) {
            // Convert sort option to API parameter
            switch (filters.sort) {
                case 'price_low':
                    queryParams.ordering = 'price';
                    break;
                case 'price_high':
                    queryParams.ordering = '-price';
                    break;
                case 'newest':
                    queryParams.ordering = '-created_at';
                    break;
                case 'popular':
                    queryParams.ordering = '-popularity';
                    break;
            }
        }

        // Build query string
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const url = `/shop/products/${queryString ? `?${queryString}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    getProductBySlug: async (slug: string) => {
        const response = await api.get(`/shop/products/${slug}/`);
        return response.data;
    },

    getProductsByAge: async (age: number) => {
        const response = await api.get(`/shop/products/by_age/?age=${age}`);
        return response.data;
    },

    getProductsByAgeRange: async (minAge: number, maxAge: number) => {
        const response = await api.get(`/shop/products/age_filter/?min=${minAge}&max=${maxAge}`);
        return response.data;
    },

    getProductsByCategory: async (categorySlug: string, filters?: Omit<ShopFilters, 'category'>) => {
        // Convert remaining filters to query parameters
        const queryParams: Record<string, string> = {};

        if (filters?.searchTerm) {
            queryParams.search = filters.searchTerm;
        }

        if (filters?.price?.min !== undefined) {
            queryParams.min_price = filters.price.min.toString();
        }

        if (filters?.price?.max !== undefined) {
            queryParams.max_price = filters.price.max.toString();
        }

        if (filters?.sort) {
            // Convert sort option to API parameter
            switch (filters.sort) {
                case 'price_low':
                    queryParams.ordering = 'price';
                    break;
                case 'price_high':
                    queryParams.ordering = '-price';
                    break;
                case 'newest':
                    queryParams.ordering = '-created_at';
                    break;
                case 'popular':
                    queryParams.ordering = '-popularity';
                    break;
            }
        }

        // Build query string
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const url = `/shop/products/by_category_slug/${categorySlug}/${queryString ? `?${queryString}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    // The rest of your existing service methods...
    getCartDetails: async () => {
        const response = await api.get('/shop/cart/details/');
        return response.data;
    },

    addToCart: async (productId: string, quantity: number = 1) => {
        const response = await api.post('/shop/cart/add_item/', {
            product_id: productId,
            quantity
        });
        return response.data;
    },

    updateCartItemQuantity: async (productId: string, quantity: number) => {
        const response = await api.post('/shop/cart/update_quantity/', {
            product_id: productId,
            quantity
        });
        return response.data;
    },

    removeFromCart: async (productId: string) => {
        const response = await api.post('/shop/cart/remove_item/', {
            product_id: productId
        });
        return response.data;
    },

    clearCart: async () => {
        const response = await api.post('/shop/cart/clear/');
        return response.data;
    },

    checkout: async (shippingInfo: ShippingInfo) => {
        const response = await api.post('/shop/cart/checkout/', {
            shipping_info: shippingInfo,
        });
        return response.data;
    },

    requestPayment: async (orderId: string) => {
        const response = await api.post(`/shop/orders/${orderId}/request_payment/`);
        return response.data;
    },

    verifyPayment: async (orderId: string, transactionId: string) => {
        const response = await api.post(`/shop/orders/${orderId}/verify_payment/`, {
            transaction_id: transactionId
        });
        return response.data;
    },

    getOrderById: async (orderId: string) => {
        const response = await api.get(`/shop/orders/${orderId}/`);
        return response.data;
    }
};