'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight, FaArrowRight, FaSave } from 'react-icons/fa';
import styles from './StoryEditorV2.module.scss';
import { Story, StoryOrientation, StorySize, StoryPart } from '@/types/story';

interface StoryEditorV2Props {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTexts: string[]) => Promise<void>;
  isFullPage?: boolean;
}

// Layout configuration type
type LayoutType = 'square' | 'landscapeRectangle' | 'portraitRectangle' | 'default';

// View type for mobile navigation
type ViewType = 'text' | 'image';

/**
 * Determines the layout type based on story size and orientation
 */
const getLayoutType = (size: StorySize, orientation: StoryOrientation): LayoutType => {
  if (size === '20x20' || size === '25x25') {
    return 'square';
  }

  if (size === '15x23') {
    if (orientation === 'LANDSCAPE') {
      return 'landscapeRectangle';
    } else if (orientation === 'PORTRAIT') {
      return 'portraitRectangle';
    }
  }

  return 'default';
};

/**
 * Returns the aspect ratio padding percentage for maintaining aspect ratios
 */
const getAspectRatioPadding = (layoutType: LayoutType): string => {
  switch (layoutType) {
    case 'square':
      return '100%';
    case 'landscapeRectangle':
      return `${(15 / 23) * 100}%`;
    case 'portraitRectangle':
      return `${(23 / 15) * 100}%`;
    case 'default':
      return '75%';
    default:
      return '100%';
  }
};

const StoryEditorV2: React.FC<StoryEditorV2Props> = ({
  story,
  isOpen,
  onClose,
  onSave,
  isFullPage = false,
}) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentView, setCurrentView] = useState<ViewType>('image');
  const [isMobile, setIsMobile] = useState(false);
  const [texts, setTexts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MIN_SWIPE_DISTANCE = 50;

  const layoutType = getLayoutType(story.size || null, story.orientation || null);
  const aspectRatio = getAspectRatioPadding(layoutType);
  const isSinglePageMobile = layoutType.includes('Rectangle');

  // Initialize texts from story parts
  useEffect(() => {
    if (story.parts) {
      setTexts(story.parts.map(part => part.text || ''));
    }
  }, [story.parts]);

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
      setCurrentView('image');
      setHasUnsavedChanges(false);
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
      // Don't navigate if user is typing in textarea
      if (document.activeElement === textareaRef.current) {
        return;
      }

      if (e.key === 'ArrowRight') {
        handlePrevious();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'Escape' && !isFullPage) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPartIndex, currentView, isMobile, isFullPage]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('شما تغییراتی ذخیره نشده دارید. آیا مطمئن هستید؟');
      if (!confirmed) return;
    }
    onClose();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(texts);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving story:', error);
      alert('خطا در ذخیره‌سازی داستان');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
    setHasUnsavedChanges(true);
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  const handleNext = () => {
    if (isMobile && isSinglePageMobile) {
      if (currentView === 'image') {
        setCurrentView('text');
      } else {
        if (currentPartIndex < story.parts.length - 1) {
          setCurrentPartIndex(currentPartIndex + 1);
          setCurrentView('image');
        }
      }
    } else {
      if (currentPartIndex < story.parts.length - 1) {
        setCurrentPartIndex(currentPartIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (isMobile && isSinglePageMobile) {
      if (currentView === 'text') {
        setCurrentView('image');
      } else {
        if (currentPartIndex > 0) {
          setCurrentPartIndex(currentPartIndex - 1);
          setCurrentView('text');
        }
      }
    } else {
      if (currentPartIndex > 0) {
        setCurrentPartIndex(currentPartIndex - 1);
      }
    }
  };

  const isFirstPage = currentPartIndex === 0 && (isMobile && isSinglePageMobile ? currentView === 'image' : true);
  const isLastPage = currentPartIndex === story.parts.length - 1 && (isMobile && isSinglePageMobile ? currentView === 'text' : true);

  const currentPart = story.parts[currentPartIndex];

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
   * Renders a content box (text editor or image) with proper aspect ratio
   */
  const renderContentBox = (type: ViewType, part = currentPart, index = currentPartIndex) => {
    return (
      <div
        className={`${styles.contentBox} ${styles[layoutType]} ${styles[type]}`}
        style={{ paddingBottom: aspectRatio }}
      >
        <div className={styles.contentInner}>
          {type === 'text' ? (
            <div className={styles.textEditorWrapper}>
              <textarea
                ref={currentView === 'text' && isMobile ? textareaRef : null}
                className={styles.textEditor}
                value={texts[index] || ''}
                onChange={(e) => handleTextChange(index, e.target.value)}
                placeholder="متن داستان خود را اینجا بنویسید..."
                style={{
                  backgroundColor: story.background_color || '#FFF9F5',
                  color: story.font_color || '#2B463C',
                }}
              />
            </div>
          ) : (
            <div className={styles.imageContent}>
              <Image
                src={part?.illustration || '/placeholder-image.jpg'}
                alt={`تصویر داستان - بخش ${index + 1}`}
                fill
                className={styles.storyImage}
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </div>
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
      return (
        <div className={styles.singlePageView}>
          {renderContentBox(currentView)}
        </div>
      );
    } else {
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
   * In RTL: image right, text left
   */
  const renderDesktopView = () => {
    return (
      <div className={styles.sideBySideView}>
        {renderContentBox('image')}
        {renderContentBox('text')}
      </div>
    );
  };

  const editorContent = (
    <div className={`${styles.editorContainer} ${isFullPage ? styles.fullPage : ''}`}>
      {/* Close button - only in modal mode */}
      {!isFullPage && (
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="بستن ویرایشگر"
        >
          <FaTimes />
        </button>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <button
            className={styles.backButton}
            onClick={handleClose}
            aria-label="بازگشت"
          >
            <FaArrowRight className={styles.backIcon} />
            <span>بازگشت</span>
          </button>
          <h2 className={styles.title}>
            {story.title || 'ویرایش داستان'}
            {hasUnsavedChanges && <span className={styles.unsavedIndicator}>*</span>}
          </h2>
        </div>
        <div className={styles.headerLeft}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            aria-label="ذخیره تغییرات"
          >
            <FaSave className={styles.saveIcon} />
            <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره'}</span>
          </button>
          <div className={styles.pageIndicator}>
            صفحه {getCurrentPageNumber()}
          </div>
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

      {/* Navigation controls */}
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
    return editorContent;
  }

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-editor-title"
    >
      <div onClick={(e) => e.stopPropagation()}>
        {editorContent}
      </div>
    </div>
  );
};

export default StoryEditorV2;
