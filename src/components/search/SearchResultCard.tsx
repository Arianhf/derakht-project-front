'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchResult, isBlogResult, isProductResult } from '@/types/search';
import { FaBook, FaShoppingBag, FaClock, FaCalendar, FaTag, FaImage } from 'react-icons/fa';
import styles from './SearchResultCard.module.scss';

interface SearchResultCardProps {
  result: SearchResult;
}

/**
 * SearchResultCard Component
 * Displays a unified card for both blog and product search results
 */
const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  const { title, description, url } = result;

  // Get image URL based on result type
  const getImageUrl = (): string | null => {
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

  const imageUrl = getImageUrl();

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
      <div className={styles.cardContent}>
        {/* Image Section */}
        <div className={styles.imageContainer}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={200}
              height={150}
              className={styles.image}
              objectFit="cover"
            />
          ) : (
            <div className={styles.noImage}>
              <FaImage />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={styles.contentSection}>
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
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
