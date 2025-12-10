'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StoryEditorV2 from '@/components/story/StoryEditorV2';
import { storyService } from '@/services/storyService';
import { Story } from '@/types/story';
import { toast, Toaster } from 'react-hot-toast';
import styles from './StoryEditPage.module.scss';

/**
 * Story Editor Page Component
 *
 * Edit mode for stories with responsive layouts
 *
 * URL Pattern: /story/[id]/edit
 *
 * Features:
 * - Full editing capabilities with textarea
 * - Same responsive layouts as preview
 * - Auto-save support
 * - Unsaved changes warning
 * - Back navigation
 */
const StoryEditPage = () => {
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

  const handleSave = async (updatedTexts: string[], canvasData: { [key: number]: string }) => {
    if (!story) return;

    try {
      // Update each part's text and canvas data
      for (let i = 0; i < story.parts.length; i++) {
        const part = story.parts[i];
        const hasTextChanged = part.text !== updatedTexts[i];
        const hasCanvasData = canvasData[i] !== undefined && canvasData[i] !== '';

        if (hasTextChanged || hasCanvasData) {
          // Call API to update this part with text and canvas data
          await storyService.addStoryPart(
            story.id,
            part.story_part_template,
            updatedTexts[i],
            hasCanvasData ? canvasData[i] : undefined // Pass canvas data if it exists
          );
        }
      }

      // Update local state
      const updatedStory = {
        ...story,
        parts: story.parts.map((part, index) => ({
          ...part,
          text: updatedTexts[index],
          canvas_data: canvasData[index] || part.canvas_data, // Preserve or update canvas data
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

  const handleCoverImageUpload = async (file: File) => {
    if (!story) return;

    try {
      const updatedStory = await storyService.uploadStoryCoverImage(story.id, file);
      setStory(updatedStory);
      toast.success('تصویر جلد با موفقیت آپلود شد');
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error('خطا در آپلود تصویر جلد');
    }
  };

  const handleCoverImageSelect = async (imageUrl: string) => {
    if (!story) return;

    try {
      const updatedStory = await storyService.setCoverImageFromUrl(story.id, imageUrl);
      setStory(updatedStory);
      toast.success('تصویر جلد با موفقیت انتخاب شد');
    } catch (error) {
      console.error('Error selecting cover image:', error);
      toast.error('خطا در انتخاب تصویر جلد');
    }
  };

  const handleColorChange = async (backgroundColor?: string, fontColor?: string) => {
    if (!story) return;

    try {
      const config: { background_color?: string | null; font_color?: string | null } = {};

      if (backgroundColor !== undefined) {
        config.background_color = backgroundColor;
      }

      if (fontColor !== undefined) {
        config.font_color = fontColor;
      }

      const updatedStory = await storyService.setStoryConfig(story.id, config);
      setStory(updatedStory);
      toast.success('رنگ‌ها با موفقیت تغییر کردند');
    } catch (error) {
      console.error('Error updating story colors:', error);
      toast.error('خطا در تغییر رنگ‌ها');
    }
  };

  const handleTitleChange = async (title: string) => {
    if (!story) return;

    try {
      const updatedStory = await storyService.updateStoryTitle(story.id, title);
      setStory(updatedStory);
      toast.success('عنوان با موفقیت تغییر کرد');
    } catch (error) {
      console.error('Error updating story title:', error);
      toast.error('خطا در تغییر عنوان');
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
        onCoverImageUpload={handleCoverImageUpload}
        onCoverImageSelect={handleCoverImageSelect}
        onColorChange={handleColorChange}
        onTitleChange={handleTitleChange}
        isFullPage={true}
      />
    </div>
  );
};

export default StoryEditPage;
