'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserCircle, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BlogPost } from '@/types';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import styles from './HeroCarousel.module.scss';

interface HeroCarouselProps {
  heroPosts: BlogPost[];
  onTagClick: (tag: string) => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ heroPosts, onTagClick }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto transition every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (heroPosts.length > 1) {
        goToNextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, heroPosts.length]);

  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(prevIndex =>
      prevIndex === heroPosts.length - 1 ? 0 : prevIndex + 1
    );

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  }, [heroPosts.length, isTransitioning]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? heroPosts.length - 1 : prevIndex - 1
    );

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  }, [heroPosts.length, isTransitioning]);

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleSlideClick = (id: number) => {
    router.push(`/blog/${id}`);
  };

  if (!heroPosts || heroPosts.length === 0) {
    return null;
  }

  const currentPost = heroPosts[currentIndex];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        {/* Navigation arrows */}
        {heroPosts.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevSlide();
              }}
              aria-label="مقاله قبلی"
            >
              <FaChevronRight />
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={(e) => {
                e.stopPropagation();
                goToNextSlide();
              }}
              aria-label="مقاله بعدی"
            >
              <FaChevronLeft />
            </button>
          </>
        )}

        {/* Hero slide */}
        <div
          className={styles.heroSlide}
          onClick={() => handleSlideClick(currentPost.id)}
          style={{ cursor: 'pointer' }}
        >
          <Image
            src={currentPost.header_image?.meta?.download_url || "/default-image.jpg"}
            alt={currentPost.title}
            fill
            priority
            sizes="100vw"
            className={styles.headerImage}
          />
          <div className={styles.imageOverlay}></div>
          <div className={styles.overlay}>
            <div className={styles.heroContent}>
              {currentPost.tags && currentPost.tags.length > 0 && (
                <div className={styles.headerTags}>
                  {currentPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={styles.tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className={styles.headerTitle}>{currentPost.title}</h1>
              {currentPost.subtitle && (
                <p className={styles.headerSubtitle}>{currentPost.subtitle}</p>
              )}
              {currentPost.intro && (
                <p className={styles.headerIntro}>{currentPost.intro}</p>
              )}
              <div className={styles.authorInfo}>
                <FaUserCircle className={styles.authorIcon} />
                <div className={styles.authorDetails}>
                  <div className={styles.authorName}>
                    نویسنده: {currentPost.owner?.first_name}
                  </div>
                  <div className={styles.authorMeta}>
                    <span>
                      <FaCalendarAlt style={{ marginLeft: '5px' }} />
                      {toPersianNumber(currentPost.jalali_date || "")}
                    </span>
                    {currentPost.reading_time && (
                      <span>
                        <FaClock style={{ marginLeft: '5px' }} />
                        {toPersianNumber(currentPost.reading_time)} دقیقه مطالعه
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        {heroPosts.length > 1 && (
          <div className={styles.paginationDots}>
            {heroPosts.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(index);
                }}
                aria-label={`مقاله ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCarousel;