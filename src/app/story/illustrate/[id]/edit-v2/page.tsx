'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { storyService } from '@/services/storyService';
import { Story } from '@/types/story';
import styles from './EditV2Page.module.scss';
import { Toaster, toast } from 'react-hot-toast';
import IllustrationEditorV2 from '@/components/illustration/IllustrationEditorV2';

/**
 * Canvas-based illustration editor page
 * Allows users to draw illustrations for each story part using a canvas
 */
const IllustrateEditV2Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await storyService.getStoryById(id);
        setStory(response);
      } catch (err) {
        setError('خطا در دریافت داستان');
        console.error(err);
        toast.error('خطا در دریافت داستان');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  /**
   * Save illustrations to backend
   * For each part with canvas data, we need to:
   * 1. Export canvas as image
   * 2. Upload image to backend
   * 3. Save canvas JSON state
   */
  const handleSave = async (illustrations: { [key: number]: { canvasData: string; imageData: string } }) => {
    if (!story) return;

    try {
      setIsSaving(true);

      let uploadedCount = 0;

      // For each illustration, upload to backend
      for (const [indexStr, data] of Object.entries(illustrations)) {
        const index = parseInt(indexStr);
        const part = story.parts[index];

        if (!part) continue;

        // If we have image data, convert data URL to blob and upload
        if (data.imageData) {
          try {
            // Convert data URL to blob
            const response = await fetch(data.imageData);
            const blob = await response.blob();

            // Create FormData for upload
            const formData = new FormData();
            formData.append('part_position', (index + 1).toString());
            formData.append('story_id', id);
            formData.append('image', blob, `illustration-${index + 1}.png`);

            // Upload to backend
            await storyService.uploadImageForPart(formData);
            uploadedCount++;

            console.log(`✓ Part ${index + 1} uploaded successfully`);
          } catch (uploadErr) {
            console.error(`Error uploading part ${index + 1}:`, uploadErr);
            toast.error(`خطا در آپلود بخش ${index + 1}`);
          }
        }
      }

      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} تصویر با موفقیت ذخیره شد`);

        // Refresh story data
        const updatedStory = await storyService.getStoryById(id);
        setStory(updatedStory);
      } else {
        toast.error('هیچ تصویری برای ذخیره وجود ندارد');
      }
    } catch (err) {
      console.error('Error saving illustrations:', err);
      toast.error('خطا در ذخیره تصاویر');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    router.push('/story');
  };

  /**
   * Handle title change
   */
  const handleTitleChange = async (newTitle: string) => {
    if (!story) return;

    try {
      // Update story title via backend API
      await storyService.updateStoryTitle(id, newTitle);

      // Update local story state
      setStory({ ...story, title: newTitle });

      toast.success('عنوان با موفقیت به‌روزرسانی شد');
    } catch (err) {
      console.error('Error updating title:', err);
      toast.error('خطا در به‌روزرسانی عنوان');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>خطا</h2>
          <p>{error || 'داستان یافت نشد'}</p>
          <button onClick={() => router.push('/story')} className={styles.backButton}>
            بازگشت به داستان‌ها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.illustrateV2Page}>
      <Toaster position="top-center" />

      <IllustrationEditorV2
        story={story}
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        onTitleChange={handleTitleChange}
        isFullPage={true}
      />
    </div>
  );
};

export default IllustrateEditV2Page;
