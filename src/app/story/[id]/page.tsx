'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StoryPreviewV2 from '@/components/story/StoryPreviewV2';
import { storyService } from '@/services/storyService';
import { Story } from '@/types/story';
import { toast, Toaster } from 'react-hot-toast';
import styles from './StoryPage.module.scss';

/**
 * Story Page Component
 *
 * This page displays a story using the StoryPreviewV2 component.
 *
 * URL Pattern: /story/[id]
 */
const StoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setStory(response);
      } catch (err) {
        console.error('Error fetching story:', err);
        setError('خطا در دریافت داستان. لطفا دوباره تلاش کنید.');
        toast.error('خطا در دریافت داستان');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleClose = () => {
    router.back();
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

      <StoryPreviewV2
        story={story}
        isOpen={true}
        onClose={handleClose}
        isFullPage={true}
      />
    </div>
  );
};

export default StoryPage;
