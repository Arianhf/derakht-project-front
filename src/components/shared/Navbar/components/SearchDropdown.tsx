'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchResult, isBlogResult, isProductResult } from '@/types/search';
import { FaBook, FaShoppingBag, FaImage, FaSearch } from 'react-icons/fa';
import styles from './SearchDropdown.module.scss';

interface SearchDropdownProps {
  results: SearchResult[];
  loading: boolean;
  query: string;
  onClose: () => void;
}

/**
 * SearchDropdown Component
 * Displays live search results in a dropdown with thumbnails
 */
const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  loading,
  query,
  onClose,
}) => {
  if (!query.trim()) {
    return null;
  }

  const blogResults = results.filter(isBlogResult);
  const productResults = results.filter(isProductResult);

  const getImageUrl = (result: SearchResult): string | null => {
    if (isBlogResult(result)) {
      // Handle both string and object formats for header_image
      if (typeof result.header_image === 'string') {
        return result.header_image;
      }
      return result.header_image?.meta?.download_url || null;
    } else if (isProductResult(result)) {
      return result.feature_image || result.images?.[0]?.image_url || null;
    }
    return null;
  };

  const renderResult = (result: SearchResult) => {
    const imageUrl = getImageUrl(result);
    const isBlog = isBlogResult(result);

    return (
      <Link
        key={`${result.type}-${result.id}`}
        href={result.url}
        className={styles.resultItem}
        onClick={onClose}
      >
        <div className={styles.thumbnail}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={result.title}
              width={60}
              height={60}
              className={styles.thumbnailImage}
            />
          ) : (
            <div className={styles.noImage}>
              <FaImage />
            </div>
          )}
        </div>
        <div className={styles.resultContent}>
          <div className={styles.resultHeader}>
            {isBlog ? (
              <FaBook className={styles.typeIcon} />
            ) : (
              <FaShoppingBag className={styles.typeIcon} />
            )}
            <h4 className={styles.resultTitle}>{result.title}</h4>
          </div>
          <p className={styles.resultDescription}>
            {result.description.length > 80
              ? `${result.description.substring(0, 80)}...`
              : result.description}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className={styles.dropdown}>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>در حال جستجو...</span>
        </div>
      ) : results.length > 0 ? (
        <>
          {blogResults.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FaBook /> مقالات ({blogResults.length})
              </h3>
              <div className={styles.resultsList}>
                {blogResults.slice(0, 3).map(renderResult)}
              </div>
            </div>
          )}

          {productResults.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FaShoppingBag /> محصولات ({productResults.length})
              </h3>
              <div className={styles.resultsList}>
                {productResults.slice(0, 3).map(renderResult)}
              </div>
            </div>
          )}

          {results.length > 6 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className={styles.viewAll}
              onClick={onClose}
            >
              <FaSearch />
              مشاهده همه نتایج ({results.length})
            </Link>
          )}
        </>
      ) : (
        <div className={styles.noResults}>
          <FaSearch />
          <p>نتیجه‌ای یافت نشد</p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
