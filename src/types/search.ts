/**
 * Global Search Types
 * Defines types for the unified search functionality across blogs and products
 */

export type SearchResultType = 'blog' | 'product';

/**
 * Base result interface with common fields
 */
interface BaseSearchResult {
  id: string | number;
  type: SearchResultType;
  title: string;
  description: string;
  slug: string;
  similarity: number;
  url: string;
}

/**
 * Blog-specific search result
 */
export interface BlogSearchResult extends BaseSearchResult {
  type: 'blog';
  id: number;
  subtitle: string;
  date: string;
  featured: boolean;
  hero: boolean;
  reading_time: number;
}

/**
 * Product-specific search result
 */
export interface ProductSearchResult extends BaseSearchResult {
  type: 'product';
  id: string;
  price: string;
  sku: string;
  stock: number;
  is_available: boolean;
}

/**
 * Union type for all search results
 */
export type SearchResult = BlogSearchResult | ProductSearchResult;

/**
 * Search metadata
 */
export interface SearchMetadata {
  query: string;
  threshold: number;
  total_results: number;
  blog_count: number;
  product_count: number;
  results: SearchResult[];
}

/**
 * Complete search response from API
 */
export interface GlobalSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SearchMetadata;
}

/**
 * Search filters for frontend
 */
export interface SearchFilters {
  type?: 'all' | 'blog' | 'product';
  sortBy?: 'relevance' | 'date' | 'price_low' | 'price_high';
  minSimilarity?: number;
}

/**
 * Type guard to check if result is a blog
 */
export function isBlogResult(result: SearchResult): result is BlogSearchResult {
  return result.type === 'blog';
}

/**
 * Type guard to check if result is a product
 */
export function isProductResult(result: SearchResult): result is ProductSearchResult {
  return result.type === 'product';
}
