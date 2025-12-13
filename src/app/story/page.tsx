'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./stories.module.scss";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import placeholderImage from "@/assets/images/story.png";
import { toast, Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import logo from '@/assets/images/logo2.png';

const StoriesPage: React.FC = () => {
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
        // If story is completed, go to view page
        if (story.status === 'COMPLETED') {
            router.push(`/story/${story.id}`);
            return;
        }

        // For draft stories, go to edit page based on activity type
        if (story.activity_type === 'ILLUSTRATE') {
            router.push(`/story/illustrate/${story.id}`);
        } else {
            // Default for WRITE_FOR_DRAWING drafts
            router.push(`/story/${story.id}/edit`);
        }
    };

    const handleDeleteStory = async (storyId: string, e: React.MouseEvent) => {
        // Prevent event bubbling
        e.stopPropagation();

        // Ask for confirmation
        const confirmed = window.confirm('آیا مطمئن هستید که می‌خواهید این داستان را حذف کنید؟');
        if (!confirmed) return;

        try {
            await storyService.deleteStory(storyId);
            // Remove the story from the local state
            setStories(prevStories => prevStories.filter(story => story.id !== storyId));
            toast.success('داستان با موفقیت حذف شد');
        } catch (err) {
            console.error('Error deleting story:', err);
            toast.error('خطا در حذف داستان. لطفا دوباره تلاش کنید.');
        }
    };

    if (loading) return (
        <>
            <Navbar logo={logo} />
            <div className={styles.container}>
                <p className={styles.loading}>در حال بارگذاری...</p>
            </div>
            <Footer />
        </>
    );

    if (error) return (
        <>
            <Navbar logo={logo} />
            <div className={styles.container}>
                <p className={styles.error}>{error}</p>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Navbar logo={logo} />
            <Toaster position="top-center" />
            <div className={styles.container}>
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
                                        {story.status === 'COMPLETED' ? 'مشاهده داستان' : 'ادامه نوشتن'}
                                    </button>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => router.push(`/story/${story.id}/edit`)}
                                        aria-label="ویرایش داستان"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={(e) => handleDeleteStory(story.id, e)}
                                        aria-label="حذف داستان"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default StoriesPage;
