'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StoryEditorV2 from '@/components/story/StoryEditorV2';
import { storyService } from '@/services/storyService';
import { Story } from '@/types/story';
import { toast, Toaster } from 'react-hot-toast';
import styles from './StoryEditPage.module.scss';

interface StoryEditPageClientProps {
    initialStory: Story;
}

const StoryEditPageClient: React.FC<StoryEditPageClientProps> = ({ initialStory }) => {
    const router = useRouter();
    const [story, setStory] = useState<Story>(initialStory);

    const handleSave = async (
        textCanvasData: { [key: number]: object },
        illustrationCanvasData: { [key: number]: object }
    ) => {
        try {
            // Update each part's canvas data
            for (let i = 0; i < story.parts.length; i++) {
                const part = story.parts[i];
                const hasTextCanvas = textCanvasData[i] !== undefined;
                const hasIllustrationCanvas = illustrationCanvasData[i] !== undefined;

                if (hasTextCanvas || hasIllustrationCanvas) {
                    await storyService.addStoryPart(
                        story.id,
                        part.story_part_template,
                        hasTextCanvas ? textCanvasData[i] : undefined,
                        hasIllustrationCanvas ? illustrationCanvasData[i] : undefined
                    );
                }
            }

            // Update local state
            const updatedStory = {
                ...story,
                parts: story.parts.map((part, index) => ({
                    ...part,
                    canvas_text_data: textCanvasData[index] || part.canvas_text_data,
                    canvas_illustration_data: illustrationCanvasData[index] || part.canvas_illustration_data,
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

    const handleFinish = async () => {
        try {
            await storyService.finishStory(story.id, story.title || 'داستان من');
            toast.success('داستان شما با موفقیت نهایی شد!');
            router.push('/story');
        } catch (error) {
            console.error('Error finishing story:', error);
            toast.error('خطا در نهایی‌سازی داستان');
            throw error;
        }
    };

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
                onFinish={handleFinish}
                isFullPage={true}
            />
        </div>
    );
};

export default StoryEditPageClient;
