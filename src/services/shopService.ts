// services/shopService.ts
import api from "@/services/api";
import { ShippingInfo } from "@/types/shop";

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

    getProductsByCategory: async (categoryId: string) => {
        const response = await api.get(`/shop/products/by_category/${categoryId}/`);
        return response.data;
    },

    getProductCategories: async () => {
        const response = await api.get('/shop/categories/');
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

    // Checkout related endpoints
    checkout: async (shippingInfo: ShippingInfo) => {
        const response = await api.post('/shop/cart/checkout/', {
            shipping_info: shippingInfo,
        });
        return response.data;
    },

    applyPromoCode: async (code: string) => {
        const response = await api.post('/shop/cart/apply_promo/', {
            code
        });
        return response.data;
    },

    estimateShipping: async (postalCode: string) => {
        const response = await api.post('/shop/cart/estimate_shipping/', {
            postal_code: postalCode
        });
        return response.data;
    },

    // Order related endpoints
    getOrders: async (page = 1, limit = 10) => {
        const response = await api.get(`/shop/orders/?page=${page}&limit=${limit}`);
        return response.data;
    },

    getOrderById: async (orderId: string) => {
        const response = await api.get(`/shop/orders/${orderId}/`);
        return response.data;
    },

    cancelOrder: async (orderId: string) => {
        const response = await api.post(`/shop/orders/${orderId}/cancel/`);
        return response.data;
    },

    trackOrder: async (orderId: string) => {
        const response = await api.get(`/shop/orders/${orderId}/track/`);
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
    }
}