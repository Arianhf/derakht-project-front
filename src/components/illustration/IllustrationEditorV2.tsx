'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight, FaArrowRight, FaSave, FaCheck } from 'react-icons/fa';
import styles from './IllustrationEditorV2.module.scss';
import { Story, StoryOrientation, StorySize, StoryPart } from '@/types/story';
import DrawingCanvas, { DrawingCanvasRef } from './DrawingCanvas';

interface IllustrationEditorV2Props {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
  onSave: (illustrations: { [key: number]: { canvasData: string; imageData: string } }) => Promise<void>;
  isFullPage?: boolean;
}

// Layout configuration type
type LayoutType = 'square' | 'landscapeRectangle' | 'portraitRectangle' | 'default';

// View type for mobile navigation
type ViewType = 'drawing' | 'text';

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

const IllustrationEditorV2: React.FC<IllustrationEditorV2Props> = ({
  story,
  isOpen,
  onClose,
  onSave,
  isFullPage = false,
}) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentView, setCurrentView] = useState<ViewType>('text');
  const [isMobile, setIsMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [canvasStates, setCanvasStates] = useState<{ [key: number]: string }>({});
  const canvasRefsMap = useRef<{ [key: number]: DrawingCanvasRef | null }>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const MIN_SWIPE_DISTANCE = 50;

  const layoutType = getLayoutType(story.size || null, story.orientation || null);
  const aspectRatio = getAspectRatioPadding(layoutType);
  const isSinglePageMobile = layoutType.includes('Rectangle');

  // Navigation handlers
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('شما تغییراتی ذخیره نشده دارید. آیا مطمئن هستید؟');
      if (!confirmed) return;
    }
    onClose();
  }, [hasUnsavedChanges, onClose]);

  const handleNext = useCallback(() => {
    if (isMobile && isSinglePageMobile) {
      if (currentView === 'text') {
        setCurrentView('drawing');
      } else {
        if (currentPartIndex < story.parts.length - 1) {
          setCurrentPartIndex(currentPartIndex + 1);
          setCurrentView('text');
        }
      }
    } else {
      if (currentPartIndex < story.parts.length - 1) {
        setCurrentPartIndex(currentPartIndex + 1);
      }
    }
  }, [isMobile, isSinglePageMobile, currentView, currentPartIndex, story.parts.length]);

  const handlePrevious = useCallback(() => {
    if (isMobile && isSinglePageMobile) {
      if (currentView === 'drawing') {
        setCurrentView('text');
      } else {
        if (currentPartIndex > 0) {
          setCurrentPartIndex(currentPartIndex - 1);
          setCurrentView('drawing');
        }
      }
    } else {
      if (currentPartIndex > 0) {
        setCurrentPartIndex(currentPartIndex - 1);
      }
    }
  }, [isMobile, isSinglePageMobile, currentView, currentPartIndex]);

  // Initialize canvas states from story parts
  useEffect(() => {
    if (story.parts) {
      const initialCanvasStates: { [key: number]: string } = {};
      story.parts.forEach((part, index) => {
        if (part.canvas_data) {
          initialCanvasStates[index] = part.canvas_data;
        }
      });
      setCanvasStates(initialCanvasStates);
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
      setCurrentView('text');
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
  }, [isOpen, currentPartIndex, currentView, isMobile, isFullPage, handleClose, handleNext, handlePrevious]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Collect all canvas states and export as images
      const illustrations: { [key: number]: { canvasData: string; imageData: string } } = {};

      // Export each canvas as image
      story.parts.forEach((part, index) => {
        const canvasRef = canvasRefsMap.current[index];
        if (canvasRef) {
          const imageData = canvasRef.exportAsImage();
          const canvasData = canvasRef.getCanvasJSON();

          if (imageData && canvasData !== '{}') {
            illustrations[index] = {
              canvasData,
              imageData
            };
          }
        }
      });

      await onSave(illustrations);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving illustrations:', error);
      alert('خطا در ذخیره‌سازی تصاویر');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCanvasChange = (index: number, canvasJSON: string) => {
    const newCanvasStates = { ...canvasStates };
    newCanvasStates[index] = canvasJSON;
    setCanvasStates(newCanvasStates);
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

  const isFirstPage = currentPartIndex === 0 && (isMobile && isSinglePageMobile ? currentView === 'text' : true);
  const isLastPage = currentPartIndex === story.parts.length - 1 && (isMobile && isSinglePageMobile ? currentView === 'drawing' : true);

  const currentPart = story.parts[currentPartIndex];

  const getCurrentPageNumber = (): string => {
    if (isMobile && isSinglePageMobile) {
      const pageNum = currentPartIndex * 2 + (currentView === 'text' ? 1 : 2);
      const totalPages = story.parts.length * 2;
      return `${pageNum} از ${totalPages}`;
    } else {
      return `${currentPartIndex + 1} از ${story.parts.length}`;
    }
  };

  /**
   * Renders a content box (drawing canvas or text prompt) with proper aspect ratio
   */
  const renderContentBox = (type: ViewType, part = currentPart, index = currentPartIndex) => {
    return (
      <div
        className={`${styles.contentBox} ${styles[layoutType]} ${styles[type]}`}
        style={{ paddingBottom: aspectRatio }}
      >
        <div className={styles.contentInner}>
          {type === 'drawing' ? (
            <div className={styles.drawingCanvasWrapper}>
              <DrawingCanvas
                ref={(ref) => {
                  canvasRefsMap.current[index] = ref;
                }}
                key={`canvas-${index}`}
                initialState={canvasStates[index]}
                onChange={(canvasJSON) => handleCanvasChange(index, canvasJSON)}
                backgroundColor={story.background_color || '#FFFFFF'}
              />
            </div>
          ) : (
            <div className={styles.textPrompt}>
              <p>{part?.text || 'متن داستان'}</p>
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
          {renderContentBox('drawing')}
        </div>
      );
    }
  };

  /**
   * Renders desktop view (always side-by-side)
   * In RTL: drawing right, text left
   */
  const renderDesktopView = () => {
    return (
      <div className={styles.sideBySideView}>
        {renderContentBox('drawing')}
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
            {story.title || 'تصویرسازی داستان'}
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
      aria-labelledby="illustration-editor-title"
    >
      <div onClick={(e) => e.stopPropagation()}>
        {editorContent}
      </div>
    </div>
  );
};

export default IllustrationEditorV2;
