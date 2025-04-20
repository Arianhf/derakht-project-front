import api from './api';
import { BlogPost, HeroPost } from '@/types';

export const blogService = {
    getHeroPosts: async (): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await api.get('v2/posts/hero/');
        return response.data;
    },

    getAllPosts: async (): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await api.get('v2/posts/');
        return response.data;
    },

    getFeaturedPosts: async (): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await api.get('v2/posts/featured/');
        return response.data;
    },

    getPostById: async (id: string) => {
        const response = await api.get(`v2/posts/${id}/`);
        return response.data;
    },

    // New function to get posts by tag
    getPostsByTag: async (tag: string): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await api.get(`v2/posts/?tag=${tag}`);
        return response.data;
    },

    getAllCategories: async (): Promise<CategoryServiceResponse> => {
        const response = await api.get('v2/categories/');
        return response.data;
    },

    getPostsByCategory: async (categorySlug: string): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await api.get(`v2/posts/?category=${categorySlug}`);
        return response.data;
    },

    getRelatedPosts: async (postId: string): Promise<RelatedPost[]> => {
        const response = await api.get(`v2/related-posts/${postId}`);
        return response.data;
    },
}

export interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    intro?: string;
    header_image: string;
    date: string;
    jalali_date?: string;
    reading_time?: number;
    relationship_type?: string;
}

export interface BlogServiceResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    post_count?: number;
}

export interface CategoryServiceResponse {
    items: BlogCategory[];
    total: number;
    page: number;
    size: number;
}