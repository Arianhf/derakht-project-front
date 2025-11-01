'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./stories.module.scss";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import placeholderImage from "@/assets/images/story.png";
import StoryPreview from "@/components/story/StoryPreview";
import { toast, Toaster } from 'react-hot-toast';

const StoriesPage: React.FC = () => {
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await storyService.getApiStories();
                setStories(response.results);
            } catch (err) {
                setError("مشکلی در دریافت داستان‌ها رخ داده است.");
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    const handleViewStory = (story: Story) => {
        setSelectedStory(story);
        setIsPreviewOpen(true);
    };

    const handleCoverImageUpload = async (file: File) => {
        if (!selectedStory) return;

        try {
            const response = await storyService.uploadStoryCoverImage(selectedStory.id, file);
            setSelectedStory(response);
            // Update the story in the list
            setStories(stories.map(s => s.id === response.id ? response : s));
            toast.success('تصویر جلد با موفقیت آپلود شد');
        } catch (error) {
            console.error('Error uploading cover image:', error);
            toast.error('خطا در آپلود تصویر جلد');
        }
    };

    const handleColorChange = async (backgroundColor?: string, fontColor?: string) => {
        if (!selectedStory) return;

        try {
            const response = await storyService.setStoryConfig(selectedStory.id, {
                background_color: backgroundColor || null,
                font_color: fontColor || null
            });
            setSelectedStory(response);
            // Update the story in the list
            setStories(stories.map(s => s.id === response.id ? response : s));
            toast.success('رنگ‌ها با موفقیت ذخیره شدند');
        } catch (error) {
            console.error('Error updating story colors:', error);
            toast.error('خطا در ذخیره رنگ‌ها');
        }
    };

    if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <Toaster position="top-center" />
            <h1 className={styles.title}>داستان‌های شما</h1>
            <div className={styles.grid}>
                {stories.length === 0 ? (
                    <p className={styles.noStories}>هنوز داستانی ثبت نشده است.</p>
                ) : (
                    stories.map((story) => (
                        <div key={story.id} className={styles.storyCard}>
                            <Image
                                src={story.cover_image || placeholderImage}
                                alt={story.title}
                                width={300}
                                height={200}
                                className={styles.storyImage}
                            />
                            <h2 className={styles.storyTitle}>{story.title}</h2>
                            <p className={styles.storyExcerpt}>{story.parts[0]?.text.substring(0, 50) || "بدون متن"}...</p>
                            <div className={styles.actions}>
                                <button
                                    className={styles.viewButton}
                                    onClick={() => handleViewStory(story)}
                                >
                                    مشاهده داستان
                                </button>
                                <button
                                    className={styles.editButton}
                                    onClick={() => router.push(`/story/${story.id}`)}
                                    aria-label="ویرایش داستان"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Story Preview Modal */}
            {selectedStory && (
                <StoryPreview
                    parts={selectedStory.parts.map((part) => ({
                        illustration: part.illustration || "/placeholder-image.jpg",
                        text: part.text || "متنی وارد نشده است.",
                    }))}
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    storyId={selectedStory.id}
                    storyTitle={selectedStory.title}
                    coverImage={selectedStory.cover_image}
                    backgroundColor={selectedStory.background_color}
                    fontColor={selectedStory.font_color}
                    onCoverImageUpload={handleCoverImageUpload}
                    onColorChange={handleColorChange}
                    modalTitle={selectedStory.title}
                />
            )}
        </div>
    );
};

export default StoriesPage;
