'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import StoryPreviewV2 from '@/components/story/StoryPreviewV2';
import { storyService } from '@/services/storyService';
import { Story, StorySize, StoryOrientation } from '@/types/story';
import { toast, Toaster } from 'react-hot-toast';
import styles from './StoryV2Page.module.scss';

/**
 * StoryPreviewV2 Page Component
 *
 * This page displays a story using the new StoryPreviewV2 component.
 *
 * URL Pattern: /story/[id]/v2
 *
 * Query Parameters (optional):
 * - size: '20x20' | '25x25' | '15x23' (override story size)
 * - orientation: 'LANDSCAPE' | 'PORTRAIT' (override story orientation)
 *
 * Examples:
 * - /story/123/v2 (use story's default size/orientation)
 * - /story/123/v2?size=20x20 (force square 20x20)
 * - /story/123/v2?size=15x23&orientation=LANDSCAPE (force landscape rectangle)
 * - /story/123/v2?size=15x23&orientation=PORTRAIT (force portrait rectangle)
 */
const StoryV2Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get size and orientation from URL params (for testing different layouts)
  const sizeParam = searchParams.get('size') as StorySize;
  const orientationParam = searchParams.get('orientation') as StoryOrientation;

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) {
        setError('شناسه داستان نامعتبر است');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await storyService.getStoryById(id);

        // Override size/orientation with URL params if provided
        const storyWithOverrides: Story = {
          ...response,
          size: sizeParam || response.size,
          orientation: orientationParam || response.orientation,
        };

        setStory(storyWithOverrides);
      } catch (err) {
        console.error('Error fetching story:', err);
        setError('خطا در دریافت داستان. لطفا دوباره تلاش کنید.');
        toast.error('خطا در دریافت داستان');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, sizeParam, orientationParam]);

  const handleClose = () => {
    // Navigate back to story list or previous page
    router.push('/story');
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>در حال بارگذاری داستان...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !story) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>خطا</h2>
          <p>{error || 'داستان یافت نشد'}</p>
          <button
            className={styles.backButton}
            onClick={handleClose}
          >
            بازگشت به لیست داستان‌ها
          </button>
        </div>
      </div>
    );
  }

  // Check if story has parts
  if (!story.parts || story.parts.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>📖</div>
          <h2>داستان خالی است</h2>
          <p>این داستان هنوز محتوایی ندارد</p>
          <button
            className={styles.backButton}
            onClick={handleClose}
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  // Render story with StoryPreviewV2
  return (
    <div className={styles.pageContainer}>
      <Toaster position="top-center" />

      {/* Debug info (only visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.debugInfo}>
          <details>
            <summary>🔧 Debug Info (Development Only)</summary>
            <div className={styles.debugContent}>
              <p><strong>Story ID:</strong> {story.id}</p>
              <p><strong>Size:</strong> {story.size || 'null (default)'}</p>
              <p><strong>Orientation:</strong> {story.orientation || 'null (default)'}</p>
              <p><strong>Parts:</strong> {story.parts.length}</p>
              <div className={styles.testLinks}>
                <p><strong>Test different layouts:</strong></p>
                <a href={`/story/${id}/v2?size=20x20`}>Square 20x20</a>
                <a href={`/story/${id}/v2?size=25x25`}>Square 25x25</a>
                <a href={`/story/${id}/v2?size=15x23&orientation=LANDSCAPE`}>Landscape 15x23</a>
                <a href={`/story/${id}/v2?size=15x23&orientation=PORTRAIT`}>Portrait 15x23</a>
                <a href={`/story/${id}/v2`}>Default (from story data)</a>
              </div>
            </div>
          </details>
        </div>
      )}

      <StoryPreviewV2
        story={story}
        isOpen={true}
        onClose={handleClose}
        isFullPage={true}
      />
    </div>
  );
};

export default StoryV2Page;
