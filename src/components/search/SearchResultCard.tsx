'use client';

import React from 'react';
import Link from 'next/link';
import { SearchResult, isBlogResult, isProductResult } from '@/types/search';
import { FaBook, FaShoppingBag, FaClock, FaCalendar, FaTag } from 'react-icons/fa';
import styles from './SearchResultCard.module.scss';

interface SearchResultCardProps {
  result: SearchResult;
}

/**
 * SearchResultCard Component
 * Displays a unified card for both blog and product search results
 */
const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  const { title, description, url, similarity } = result;

  // Format similarity as percentage
  const relevancePercentage = Math.round(similarity * 100);

  // Render blog-specific details
  const renderBlogDetails = () => {
    if (!isBlogResult(result)) return null;

    return (
      <div className={styles.metadata}>
        <span className={styles.metadataItem}>
          <FaCalendar className={styles.icon} />
          {new Date(result.date).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <span className={styles.metadataItem}>
          <FaClock className={styles.icon} />
          {result.reading_time} دقیقه مطالعه
        </span>
        {result.featured && (
          <span className={styles.badge}>ویژه</span>
        )}
      </div>
    );
  };

  // Render product-specific details
  const renderProductDetails = () => {
    if (!isProductResult(result)) return null;

    const price = parseInt(result.price);
    const formattedPrice = price.toLocaleString('fa-IR');

    return (
      <div className={styles.metadata}>
        <span className={styles.price}>{formattedPrice} تومان</span>
        <span className={styles.metadataItem}>
          <FaTag className={styles.icon} />
          {result.sku}
        </span>
        {result.stock > 0 ? (
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
            موجود ({result.stock})
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeError}`}>
            ناموجود
          </span>
        )}
      </div>
    );
  };

  return (
    <Link href={url} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.typeIndicator}>
          {isBlogResult(result) ? (
            <>
              <FaBook className={styles.typeIcon} />
              <span>مقاله</span>
            </>
          ) : (
            <>
              <FaShoppingBag className={styles.typeIcon} />
              <span>محصول</span>
            </>
          )}
        </div>
        <div className={styles.relevance}>
          <span className={styles.relevanceLabel}>مرتبط:</span>
          <span className={styles.relevanceValue}>{relevancePercentage}%</span>
        </div>
      </div>

      <h3 className={styles.title}>{title}</h3>

      {isBlogResult(result) && result.subtitle && (
        <p className={styles.subtitle}>{result.subtitle}</p>
      )}

      <p className={styles.description}>
        {description.length > 200
          ? `${description.substring(0, 200)}...`
          : description}
      </p>

      {isBlogResult(result) ? renderBlogDetails() : renderProductDetails()}
    </Link>
  );
};

export default SearchResultCard;
