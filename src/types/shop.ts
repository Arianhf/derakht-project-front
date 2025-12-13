// src/types/shop.ts

export interface ProductImage {
    id: string;
    image: string;
    image_url: string;
    alt_text: string;
    is_feature: boolean;
}

export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parent_id?: string | null;
    image_url?: string;
    children?: ProductCategory[];
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    is_available: boolean;
    slug: string;
    meta_title?: string;
    meta_description?: string;
    min_age?: number | null;
    max_age?: number | null;
    age_range?: string;
    category_id?: string;
    category?: ProductCategory;
    images?: ProductImage[];
    feature_image?: string;
    created_at?: string;
    popularity?: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
    price: number;
    total_price: number;
}

export interface CartDetails {
    items_count: number;
    total_amount: number;
    items: CartItem[];
    applied_promo?: {
        code: string;
        discount_amount: number;
    };
    shipping_cost?: number;
}

// Order types remain the same

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    price: number;
    total_price: number;
}

export interface ShippingInfo {
    address: string;
    city: string;
    province: string;
    postal_code: string;
    recipient_name: string;
    phone_number: string;
}

export interface PaymentInfo {
    method: 'online' | 'cash' | 'card_to_card';
    transaction_id?: string;
    payment_date?: string;
    status: 'pending' | 'completed' | 'failed';
    receipt_image?: string;
}

export interface TrackingInfo {
    tracking_number?: string;
    carrier?: string;
    status: 'processing' | 'shipped' | 'delivered' | 'canceled';
    estimated_delivery?: string;
    shipping_date?: string;
    delivery_date?: string;
    updates?: {
        status: string;
        timestamp: string;
        location?: string;
        message?: string;
    }[];
}

export interface Order {
    id: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'canceled';
    total_amount: number;
    currency: string;
    shipping_address: string;
    phone_number: string;
    items: OrderItem[];
    created_at: string;
    shipping_info?: ShippingInfo;
    payment_info?: PaymentInfo;
    tracking_info?: TrackingInfo;
    notes?: string;
}

export interface OrdersResponse {
    items: Order[];
    total: number;
    page: number;
    pages: number;
}

// Enhanced filter types

export interface AgeFilter {
    min?: number;
    max?: number;
}

export interface PriceFilter {
    min?: number;
    max?: number;
}

export type SortOption = 'price_low' | 'price_high' | 'newest' | 'popular';

export interface ShopFilters {
    age?: AgeFilter;
    price?: PriceFilter;
    category?: string; // Category ID or slug
    searchTerm?: string;
    sort?: SortOption;
}

// Breadcrumb navigation type
export interface Breadcrumb {
    label: string;
    href: string;
    isActive?: boolean;
}

// Comment types for product reviews/comments
export interface ProductComment {
    id: string;
    product_id: string;
    user_id?: string;
    user_name?: string;
    text: string;
    created_at: string;
    updated_at?: string;
    is_approved?: boolean;
}

export interface CreateCommentRequest {
    product_id: string;
    text: string;
}

export interface CommentsResponse {
    items: ProductComment[];
    total: number;
    page?: number;
    pages?: number;
}