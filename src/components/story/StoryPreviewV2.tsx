'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import styles from './StoryPreviewV2.module.scss';
import { Story, StoryOrientation, StorySize } from '@/types/story';
import TextCanvasViewer from './TextCanvasViewer';

interface StoryPreviewV2Props {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
  isFullPage?: boolean;
}

// Layout configuration type
type LayoutType = 'square' | 'landscapeRectangle' | 'portraitRectangle' | 'default';

// View type for mobile navigation
type ViewType = 'text' | 'image';

/**
 * Determines the layout type based on story size and orientation
 * This helps us decide which rendering strategy to use
 */
const getLayoutType = (size: StorySize, orientation: StoryOrientation): LayoutType => {
  // Square layouts (20x20 or 25x25)
  if (size === '20x20' || size === '25x25') {
    return 'square';
  }

  // Rectangle layouts (15x23)
  if (size === '15x23') {
    if (orientation === 'LANDSCAPE') {
      return 'landscapeRectangle';
    } else if (orientation === 'PORTRAIT') {
      return 'portraitRectangle';
    }
  }

  // Fallback for null or unknown values
  return 'default';
};

/**
 * Returns the aspect ratio for CSS aspect-ratio property
 */
const getAspectRatio = (layoutType: LayoutType): string => {
  switch (layoutType) {
    case 'square':
      return '1 / 1';
    case 'landscapeRectangle':
      return '23 / 15';
    case 'portraitRectangle':
      return '15 / 23';
    case 'default':
      return '4 / 3';
    default:
      return '1 / 1';
  }
};

const StoryPreviewV2: React.FC<StoryPreviewV2Props> = ({
  story,
  isOpen,
  onClose,
  isFullPage = false,
}) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentView, setCurrentView] = useState<ViewType>('image'); // Start with image first
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isInteractingWithCanvas, setIsInteractingWithCanvas] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px) to trigger navigation
  const MIN_SWIPE_DISTANCE = 50;

  // Determine layout type
  const layoutType = getLayoutType(story.size || null, story.orientation || null);
  const aspectRatio = getAspectRatio(layoutType);

  // Check if we should show single-page view on mobile (for rectangle layouts)
  const isSinglePageMobile = layoutType.includes('Rectangle');

  // Navigation handlers - defined early to be used in useEffect
  const handleNext = useCallback(() => {
    if (isMobile && isSinglePageMobile) {
      // Mobile single-page navigation: image → text → next image
      if (currentView === 'image') {
        // Move from image to text
        setCurrentView('text');
      } else {
        // Move from text to next part's image (or finish)
        if (currentPartIndex < story.parts.length - 1) {
          setCurrentPartIndex(currentPartIndex + 1);
          setCurrentView('image'); // Next part starts with image
        }
      }
    } else {
      // Desktop or square mobile: navigate through parts
      if (currentPartIndex < story.parts.length - 1) {
        setCurrentPartIndex(currentPartIndex + 1);
      }
    }
  }, [isMobile, isSinglePageMobile, currentView, currentPartIndex, story.parts.length]);

  const handlePrevious = useCallback(() => {
    if (isMobile && isSinglePageMobile) {
      // Mobile single-page navigation: text ← image ← previous text
      if (currentView === 'text') {
        // Move from text to image
        setCurrentView('image');
      } else {
        // Move from image to previous part's text (or do nothing if first)
        if (currentPartIndex > 0) {
          setCurrentPartIndex(currentPartIndex - 1);
          setCurrentView('text'); // Previous part shows text
        }
      }
    } else {
      // Desktop or square mobile: navigate through parts
      if (currentPartIndex > 0) {
        setCurrentPartIndex(currentPartIndex - 1);
      }
    }
  }, [isMobile, isSinglePageMobile, currentView, currentPartIndex]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPartIndex(0);
      setCurrentView('image'); // Reset to image first
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen && !isFullPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isFullPage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePrevious();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'Escape' && !isFullPage) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPartIndex, currentView, isMobile, isFullPage, handleNext, handlePrevious, onClose]);

  if (!isOpen) return null;

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    // Check if touch started on a canvas element
    const target = e.target as HTMLElement;
    const isCanvas = target.tagName === 'CANVAS' || target.closest('canvas');

    if (isCanvas) {
      setIsInteractingWithCanvas(true);
    }

    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    // Don't navigate if user is interacting with canvas
    if (isInteractingWithCanvas) {
      setIsInteractingWithCanvas(false);
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  const isFirstPage = currentPartIndex === 0 && (isMobile && isSinglePageMobile ? currentView === 'image' : true);
  const isLastPage = currentPartIndex === story.parts.length - 1 && (isMobile && isSinglePageMobile ? currentView === 'text' : true);

  const currentPart = story.parts[currentPartIndex];

  // Calculate current page number for display
  const getCurrentPageNumber = (): string => {
    if (isMobile && isSinglePageMobile) {
      const pageNum = currentPartIndex * 2 + (currentView === 'image' ? 1 : 2);
      const totalPages = story.parts.length * 2;
      return `${pageNum} از ${totalPages}`;
    } else {
      return `${currentPartIndex + 1} از ${story.parts.length}`;
    }
  };

  /**
   * Renders a content box (text or image) with proper aspect ratio
   */
  const renderContentBox = (type: ViewType, part = currentPart) => {
    const content = type === 'text'
      ? (part?.canvas_text_data ? JSON.stringify(part.canvas_text_data) : '')
      : (part?.canvas_illustration_data ? JSON.stringify(part.canvas_illustration_data) : '');

    return (
      <div
        className={`${styles.contentBox} ${styles[layoutType]} ${styles[type]}`}
        style={{ aspectRatio }}
      >
        <div className={styles.contentInner}>
          {type === 'text' ? (
            // Render canvas viewer if canvas_text_data exists
            part?.canvas_text_data ? (
              <div className={styles.canvasViewerWrapper}>
                <TextCanvasViewer
                  key={`canvas-part-${currentPartIndex}`}
                  canvasData={typeof part.canvas_text_data === 'string' ? part.canvas_text_data : JSON.stringify(part.canvas_text_data)}
                  backgroundColor={story.background_color || '#FFFFFF'}
                />
              </div>
            ) : (
              <div
                className={styles.textContent}
                style={{
                  backgroundColor: story.background_color || '#FFF9F5',
                  color: story.font_color || '#2B463C',
                }}
              >
                {content || 'متنی وارد نشده است.'}
              </div>
            )
          ) : (
            // Render canvas viewer if canvas_illustration_data exists
            part?.canvas_illustration_data ? (
              <div className={styles.canvasViewerWrapper}>
                <TextCanvasViewer
                  key={`canvas-illustration-part-${currentPartIndex}`}
                  canvasData={typeof part.canvas_illustration_data === 'string' ? part.canvas_illustration_data : JSON.stringify(part.canvas_illustration_data)}
                  backgroundColor={story.background_color || '#FFFFFF'}
                />
              </div>
            ) : (
              <div className={styles.imageContent}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: story.background_color || '#FFF9F5',
                    color: story.font_color || '#2B463C',
                  }}
                >
                  تصویری وارد نشده است.
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders mobile view based on layout type
   */
  const renderMobileView = () => {
    if (isSinglePageMobile) {
      // Single-page view for rectangle layouts
      return (
        <div className={styles.singlePageView}>
          {renderContentBox(currentView)}
        </div>
      );
    } else {
      // Stacked view for square layouts
      return (
        <div className={styles.stackedView}>
          {renderContentBox('text')}
          {renderContentBox('image')}
        </div>
      );
    }
  };

  /**
   * Renders desktop view (always side-by-side)
   * In RTL: first element appears on the right, second on the left
   * So: image first (right), text second (left)
   */
  const renderDesktopView = () => {
    return (
      <div className={styles.sideBySideView}>
        {renderContentBox('image')}
        {renderContentBox('text')}
      </div>
    );
  };

  const previewContent = (
    <div className={`${styles.previewContainer} ${isFullPage ? styles.fullPage : ''}`}>
      {/* Close button - only in modal mode */}
      {!isFullPage && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="بستن پیش‌نمایش"
        >
          <FaTimes />
        </button>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <button
            className={styles.backButton}
            onClick={onClose}
            aria-label="بازگشت"
          >
            <FaArrowRight className={styles.backIcon} />
            <span>بازگشت</span>
          </button>
          <h2 className={styles.title}>{story.title || 'پیش‌نمایش داستان'}</h2>
        </div>
        <div className={styles.pageIndicator}>
          صفحه {getCurrentPageNumber()}
        </div>
      </div>

      {/* Content area with swipe support */}
      <div
        ref={contentRef}
        className={styles.content}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>

      {/* Navigation controls - large, colorful, kid-friendly buttons */}
      <div className={styles.navigation}>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={handlePrevious}
          disabled={isFirstPage}
          aria-label="صفحه قبلی"
        >
          <FaChevronRight className={styles.navIcon} />
          <span className={styles.navText}>قبلی</span>
        </button>

        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={handleNext}
          disabled={isLastPage}
          aria-label="صفحه بعدی"
        >
          <span className={styles.navText}>بعدی</span>
          <FaChevronLeft className={styles.navIcon} />
        </button>
      </div>
    </div>
  );

  // Render with or without overlay based on mode
  if (isFullPage) {
    return previewContent;
  }

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-preview-title"
    >
      <div onClick={(e) => e.stopPropagation()}>
        {previewContent}
      </div>
    </div>
  );
};

export default StoryPreviewV2;
