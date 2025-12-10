'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./stories.module.scss";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import placeholderImage from "@/assets/images/story.png";
import StoryPreviewV2 from "@/components/story/StoryPreviewV2";
import { toast, Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import logo from '@/assets/images/logo2.png';

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
            </div>

            {/* Story Preview Modal - Rendered outside container to avoid z-index stacking context issues */}
            {selectedStory && (
                <StoryPreviewV2
                    story={selectedStory}
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                />
            )}

            <Footer />
        </>
    );
};

export default StoriesPage;
