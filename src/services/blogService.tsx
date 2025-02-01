import api from './api';
import { BlogPost, HeroPost } from '../types';

export const blogService = {
    getHeroPost: async (): Promise<HeroPost> => {
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
    }
}

export interface BlogServiceResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}
