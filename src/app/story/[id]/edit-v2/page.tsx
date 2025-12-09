'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StoryEditorV2 from '@/components/story/StoryEditorV2';
import { storyService } from '@/services/storyService';
import { Story } from '@/types/story';
import { toast, Toaster } from 'react-hot-toast';
import styles from './StoryEditV2Page.module.scss';

/**
 * StoryEditorV2 Page Component
 *
 * Edit mode for stories with V2 responsive layouts
 *
 * URL Pattern: /story/[id]/edit-v2
 *
 * Features:
 * - Full editing capabilities with textarea
 * - Same responsive layouts as preview V2
 * - Auto-save support
 * - Unsaved changes warning
 * - Back navigation
 */
const StoryEditV2Page = () => {
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

  const handleSave = async (updatedTexts: string[]) => {
    if (!story) return;

    try {
      // Update each part's text
      for (let i = 0; i < story.parts.length; i++) {
        const part = story.parts[i];
        if (part.text !== updatedTexts[i]) {
          // Call API to update this part
          await storyService.addStoryPart(
            story.id,
            part.story_part_template,
            updatedTexts[i]
          );
        }
      }

      // Update local state
      const updatedStory = {
        ...story,
        parts: story.parts.map((part, index) => ({
          ...part,
          text: updatedTexts[index],
        })),
      };
      setStory(updatedStory);

      toast.success('تغییرات با موفقیت ذخیره شد');
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('خطا در ذخیره‌سازی تغییرات');
      throw error;
    }
  };

  const handleClose = () => {
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

  // Render editor
  return (
    <div className={styles.pageContainer}>
      <Toaster position="top-center" />

      <StoryEditorV2
        story={story}
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        isFullPage={true}
      />
    </div>
  );
};

export default StoryEditV2Page;
