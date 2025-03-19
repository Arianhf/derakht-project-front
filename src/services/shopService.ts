// services/shopService.ts
import api from "@/services/api";

export const shopService = {
    // Product related endpoints
    getProducts: async (filters?: Record<string, string>) => {
        const queryString = filters
            ? Object.entries(filters)
                .filter(([_, value]) => value)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&')
            : '';

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

    // Cart related endpoints
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

    checkout: async (shippingAddress: string, phoneNumber: string) => {
        const response = await api.post('/shop/cart/checkout/', {
            shipping_address: shippingAddress,
            phone_number: phoneNumber
        });
        return response.data;
    },

    // Order related endpoints
    getOrders: async () => {
        const response = await api.get('/shop/orders/');
        return response.data;
    },

    getOrderById: async (orderId: string) => {
        const response = await api.get(`/shop/orders/${orderId}/`);
        return response.data;
    },

    requestPayment: async (orderId: string) => {
        const response = await api.post(`/shop/orders/${orderId}/request_payment/`);
        return response.data;
    }
};