export interface ProductImage {
    id: string;
    image: string;
    image_url: string;
    alt_text: string;
    is_feature: boolean;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    price_in_toman: number;
    stock: number;
    sku: string;
    is_available: boolean;
    slug: string;
    meta_title?: string;
    meta_description?: string;
    min_age?: number | null;
    max_age?: number | null;
    age_range?: string;
    images?: ProductImage[];
    feature_image?: string;
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
}

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    status: string;
    total_amount: number;
    currency: string;
    shipping_address: string;
    phone_number: string;
    items: OrderItem[];
    created_at: string;
}

export interface AgeFilter {
    min?: number;
    max?: number;
}

export interface PriceFilter {
    min?: number;
    max?: number;
}

export interface ShopFilters {
    age?: AgeFilter;
    price?: PriceFilter;
    category?: string;
    searchTerm?: string;
    sort?: 'price_low' | 'price_high';
}