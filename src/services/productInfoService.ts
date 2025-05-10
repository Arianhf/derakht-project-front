import api from './api';

export interface ProductInfoItem {
    id: number;
    meta: {
        type: string;
        detail_url: string;
        html_url: string;
        slug: string;
        first_published_at: string;
    };
    title: string;
    product_code: string;
    intro: string;
    body: string;
    product_image?: {
        id: number;
        title: string;
        meta: {
            download_url: string;
        };
    };
}

export interface ProductInfoResponse {
    meta: {
        total_count: number;
    };
    items: ProductInfoItem[];
}

export const productInfoService = {
    getAllProductInfo: async (): Promise<ProductInfoResponse> => {
        const response = await api.get('/v2/product-info/');
        return response.data;
    },

    getProductInfoById: async (id: string): Promise<ProductInfoItem> => {
        const response = await api.get(`/v2/product-info/${id}/`);
        return response.data;
    },

    getProductInfoByCode: async (code: string): Promise<ProductInfoItem> => {
        const response = await api.get(`/v2/product-info/by-code/?code=${code}`);
        return response.data;
    }
};

export default productInfoService;