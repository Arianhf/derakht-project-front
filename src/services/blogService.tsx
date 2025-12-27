import publicApi from './publicApi';
import { BlogPost, HeroPost, Category } from '@/types';

// Blog service uses publicApi (no auth required) to enable static page generation
export const blogService = {
    getHeroPosts: async (): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await publicApi.get('blog/posts/hero/');
        return response.data;
    },

    getAllPosts: async (): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await publicApi.get('blog/posts/');
        return response.data;
    },

    getFeaturedPosts: async (): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await publicApi.get('blog/posts/featured/');
        return response.data;
    },

    getPostById: async (id: string): Promise<BlogPost> => {
        const response = await publicApi.get(`blog/posts/${id}/`);
        return response.data;
    },

    getPostBySlug: async (slug: string): Promise<BlogPost> => {
        const response = await publicApi.get(`blog/posts/${slug}/`);
        return response.data;
    },

    // New function to get posts by tag
    getPostsByTag: async (tag: string): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await publicApi.get(`blog/posts/?tag=${tag}`);
        return response.data;
    },

    getAllCategories: async (): Promise<CategoryServiceResponse> => {
        const response = await publicApi.get('blog/categories/');
        return response.data;
    },

    getPostsByCategory: async (categorySlug: string): Promise<BlogServiceResponse<BlogPost>> => {
        const response = await publicApi.get(`blog/posts/?category=${categorySlug}`);
        return response.data;
    },

    getRelatedPosts: async (postId: string): Promise<RelatedPost[]> => {
        const response = await publicApi.get(`blog/related-posts/${postId}`);
        return response.data;
    },

    // New function to get all post slugs for sitemap
    getAllPostSlugs: async (): Promise<PostSlugResponse[]> => {
        const response = await publicApi.get('blog/posts/slugs/');
        return response.data.items || response.data;
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
    meta_title?: string;
    meta_description?: string;
}

export interface CategoryServiceResponse {
    items: BlogCategory[];
    total: number;
    page: number;
    size: number;
}

export interface PostSlugResponse {
    slug: string;
    updated_date?: string;
}