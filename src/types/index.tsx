// src/types/index.tsx

export interface Author {
    id: string | number;
    first_name: string;
    last_name?: string;
    full_name?: string;
    bio?: string;
    profile_url?: string;
    profile_image?: string | null;
    email?: string;
    age?: number;
    social_links?: {
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
}

export interface Category {
    id: string | number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    post_count?: number;
    meta_title?: string;
    meta_description?: string;
}

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    subtitle?: string;
    intro?: string;
    excerpt?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    header_image?: {
        meta?: {
            download_url: string;
        };
        title?: string;
    };
    og_image?: string;
    category?: Category;
    owner?: Author;
    jalali_date?: string;
    published_date?: string;
    updated_date?: string;
    reading_time?: number;
    word_count?: number;
    tags?: string[];
    body?: string;
    featured?: boolean;
    hero?: boolean;
    alternative_titles?: string[];
    canonical_url?: string;
    noindex?: boolean;
}

export interface HeroPost extends BlogPost {
    tags: string[];
}

// Export canvas types
export * from './canvas';