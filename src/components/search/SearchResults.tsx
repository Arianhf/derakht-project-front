'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import searchService from '@/services/searchService';
import {
  GlobalSearchResponse,
  SearchResult,
  SearchFilters,
  isBlogResult,
  isProductResult,
} from '@/types/search';
import SearchResultCard from './SearchResultCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from './SearchResults.module.scss';

/**
 * SearchResults Component
 * Main search results page with filtering and sorting capabilities
 */
const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchData, setSearchData] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    sortBy: 'relevance',
    minSimilarity: 0.1,
  });

  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await searchService.globalSearch({
          query,
          threshold: filters.minSimilarity,
        });
        setSearchData(data);
      } catch (err) {
        console.error('Search error:', err);
        setError('خطا در جستجو. لطفا دوباره تلاش کنید.');
        toast.error('خطا در جستجو');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, filters.minSimilarity]);

  // Filter and sort results based on selected filters
  const filteredAndSortedResults = useMemo(() => {
    if (!searchData?.results?.results) return [];

    let results = [...searchData.results.results];

    // Filter by type
    if (filters.type !== 'all') {
      results = results.filter((result) => result.type === filters.type);
    }

    // Sort results
    switch (filters.sortBy) {
      case 'relevance':
        results.sort((a, b) => b.similarity - a.similarity);
        break;

      case 'date':
        results.sort((a, b) => {
          if (isBlogResult(a) && isBlogResult(b)) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return 0;
        });
        break;

      case 'price_low':
        results.sort((a, b) => {
          if (isProductResult(a) && isProductResult(b)) {
            return parseInt(a.price) - parseInt(b.price);
          }
          return 0;
        });
        break;

      case 'price_high':
        results.sort((a, b) => {
          if (isProductResult(a) && isProductResult(b)) {
            return parseInt(b.price) - parseInt(a.price);
          }
          return 0;
        });
        break;

      default:
        break;
    }

    return results;
  }, [searchData, filters]);

  // Handle filter changes
  const handleTypeFilter = (type: SearchFilters['type']) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  // Render empty state
  if (!query.trim()) {
    return (
      <div className={styles.emptyState}>
        <FaSearch className={styles.emptyIcon} />
        <h2>جستجو کنید</h2>
        <p>برای جستجو، کلمه کلیدی خود را وارد کنید</p>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>در حال جستجو...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.errorState}>
        <h2>خطا در جستجو</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Render no results state
  if (!searchData || filteredAndSortedResults.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaSearch className={styles.emptyIcon} />
        <h2>نتیجه‌ای یافت نشد</h2>
        <p>برای «{query}» نتیجه‌ای پیدا نکردیم</p>
        <p className={styles.suggestion}>لطفا کلمه کلیدی دیگری امتحان کنید</p>
      </div>
    );
  }

  const { blog_count = 0, product_count = 0 } = searchData.results;

  return (
    <div className={styles.container}>
      {/* Search Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          نتایج جستجو برای «<span className={styles.query}>{query}</span>»
        </h1>
        <p className={styles.resultCount}>
          {filteredAndSortedResults.length} نتیجه یافت شد
          {filters.type === 'all' && (
            <span className={styles.breakdown}>
              ({blog_count} مقاله، {product_count} محصول)
            </span>
          )}
        </p>
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <button
        className={styles.filterToggle}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter />
        فیلترها
        {showFilters ? <FaTimes /> : null}
      </button>

      {/* Filters Section */}
      <div className={`${styles.filters} ${showFilters ? styles.filtersActive : ''}`}>
        {/* Type Filters */}
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>نوع محتوا</h3>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                filters.type === 'all' ? styles.filterButtonActive : ''
              }`}
              onClick={() => handleTypeFilter('all')}
            >
              همه ({blog_count + product_count})
            </button>
            <button
              className={`${styles.filterButton} ${
                filters.type === 'blog' ? styles.filterButtonActive : ''
              }`}
              onClick={() => handleTypeFilter('blog')}
            >
              مقالات ({blog_count})
            </button>
            <button
              className={`${styles.filterButton} ${
                filters.type === 'product' ? styles.filterButtonActive : ''
              }`}
              onClick={() => handleTypeFilter('product')}
            >
              محصولات ({product_count})
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>مرتب‌سازی</h3>
          <select
            className={styles.sortSelect}
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
          >
            <option value="relevance">مرتبط‌ترین</option>
            {filters.type !== 'product' && <option value="date">جدیدترین</option>}
            {filters.type !== 'blog' && (
              <>
                <option value="price_low">ارزان‌ترین</option>
                <option value="price_high">گران‌ترین</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className={styles.results}>
        {filteredAndSortedResults.map((result) => (
          <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
