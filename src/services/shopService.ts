// src/services/shopService.ts
import api from "./api";
import { ShippingInfo, ShopFilters } from "@/types/shop";
import Cookies from 'js-cookie';

export const shopService = {
    // Helper function to get anonymous cart ID
    getAnonymousCartId: () => {
        return Cookies.get('anonymous_cart_id');
    },

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

    // Updated cart methods with anonymous cart support
    getCartDetails: async () => {
        const anonymousCartId = shopService.getAnonymousCartId();
        let url = '/shop/cart/details/';

        // Add anonymous cart ID if available
        if (anonymousCartId) {
            url += `?cart_id=${anonymousCartId}`;
        }

        const response = await api.get(url);
        return response.data;
    },

    addToCart: async (productId: string, quantity = 1) => {
        const anonymousCartId = shopService.getAnonymousCartId();
        const payload = {
            product_id: productId,
            quantity,
            anonymous_cart_id: anonymousCartId
        };

        const response = await api.post('/shop/cart/add_item/', payload);
        return response.data;
    },

    updateCartItemQuantity: async (productId: string, quantity: number) => {
        const anonymousCartId = shopService.getAnonymousCartId();
        const payload = {
            product_id: productId,
            quantity,
            anonymous_cart_id: anonymousCartId
        };

        const response = await api.post('/shop/cart/update_quantity/', payload);
        return response.data;
    },

    removeFromCart: async (productId: string) => {
        const anonymousCartId = shopService.getAnonymousCartId();
        const payload = {
            product_id: productId,
            anonymous_cart_id: anonymousCartId
        };

        const response = await api.post('/shop/cart/remove_item/', payload);
        return response.data;
    },

    clearCart: async () => {
        const anonymousCartId = shopService.getAnonymousCartId();
        let url = '/shop/cart/clear/';

        if (anonymousCartId) {
            url += `?cart_id=${anonymousCartId}`;
        }

        const response = await api.post(url);
        return response.data;
    },

    // This method will merge anonymous cart with user cart upon login
    mergeAnonymousCart: async () => {
        const anonymousCartId = shopService.getAnonymousCartId();

        if (anonymousCartId) {
            // First, check if the cart has any items
            try {
                const cartDetails = await shopService.getCartDetails();

                // Only merge if cart has items
                if (cartDetails && cartDetails.items && cartDetails.items.length > 0) {
                    await api.post('/shop/cart/merge/', { anonymous_cart_id: anonymousCartId });
                }
            } catch (error) {
                // Error checking cart before merge - silently handle in production
            } finally {
                // Always clear the cookie after attempting merge or if cart is empty
                Cookies.remove('anonymous_cart_id');
            }
        }
    },

    checkout: async (shippingInfo: ShippingInfo) => {
        const anonymousCartId = shopService.getAnonymousCartId();
        const payload: {
            shipping_info: ShippingInfo;
            anonymous_cart_id?: string;
        } = {
            shipping_info: shippingInfo,
        };

        if (anonymousCartId) {
            payload.anonymous_cart_id = anonymousCartId;
        }

        const response = await api.post('/shop/cart/checkout/', payload);
        return response.data;
    },

    requestPayment: async (orderId: string, gateway: string) => {
        const response = await api.post(`/shop/payments/request/${orderId}/`, {
            "gateway": gateway
        });
        return response.data;
    },

    verifyPayment: async (orderId: string, transactionId: string) => {
        try {
            const response = await api.post('/shop/payments/verify/', {
                order_id: orderId,
                transaction_id: transactionId,
            });

            return response.data;
        } catch (error: unknown) {
            // Extract error details from the API response if available
            let errorCode = 'unknown';
            let errorMessage = 'خطا در تایید پرداخت';

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { error_code?: string; error_message?: string } } };
                if (axiosError.response?.data) {
                    errorCode = axiosError.response.data.error_code || errorCode;
                    errorMessage = axiosError.response.data.error_message || errorMessage;
                }
            }

            // Throw a structured error object that includes error details
            throw {
                status: 'failed',
                error_code: errorCode,
                error_message: errorMessage
            };
        }
    },

    uploadPaymentReceipt: async (orderId: string, receiptImage: File) => {
        const formData = new FormData();
        formData.append('receipt_image', receiptImage);
        formData.append('order_id', orderId);

        const response = await api.post('/shop/payments/upload-receipt/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getOrderById: async (orderId: string) => {
        const response = await api.get(`/shop/orders/${orderId}/`);
        return response.data;
    }
};