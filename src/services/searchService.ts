/**
 * Global Search Service
 * Handles API calls for unified search across blogs and products
 */

import apiClient from './api';
import { GlobalSearchResponse } from '@/types/search';

export interface SearchParams {
  query: string;
  threshold?: number;
}

const searchService = {
  /**
   * Perform global search across blogs and products
   * @param params Search parameters
   * @returns Promise with search results
   */
  globalSearch: async (params: SearchParams): Promise<GlobalSearchResponse> => {
    const { query, threshold = 0.1 } = params;

    const queryParams = new URLSearchParams({
      q: query,
      threshold: threshold.toString(),
    });

    const response = await apiClient.get<GlobalSearchResponse>(
      `/search/?${queryParams.toString()}`
    );

    return response.data;
  },
};

export default searchService;
