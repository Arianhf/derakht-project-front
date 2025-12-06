'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./qesseKhooneh.module.scss";
import { storyService } from "@/services/storyService";
import { Story, Author } from "@/types/story";
import placeholderImage from "@/assets/images/story.png";
import StoryPreview from "@/components/story/StoryPreview";
import { toast, Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import logo from '@/assets/images/logo2.png';

const QesseKhoonehPage: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);

    const fetchStories = async (page: number) => {
        setLoading(true);
        try {
            const response = await storyService.getCompletedStories(page);
            setStories(response.results);
            setTotalCount(response.count);
            setHasNext(response.next !== null);
            setHasPrevious(response.previous !== null);
        } catch (err) {
            setError("مشکلی در دریافت داستان‌ها رخ داده است.");
            toast.error("مشکلی در دریافت داستان‌ها رخ داده است.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories(currentPage);
    }, [currentPage]);

    const handleViewStory = (story: Story) => {
        setSelectedStory(story);
        setIsPreviewOpen(true);
    };

    const handleNextPage = () => {
        if (hasNext) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousPage = () => {
        if (hasPrevious) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getAuthorName = (author: number | Author): string => {
        if (typeof author === 'number') {
            return 'نویسنده';
        }
        return author.full_name || `${author.first_name} ${author.last_name}`;
    };

    const getAuthorAvatar = (author: number | Author) => {
        if (typeof author === 'number') {
            return { image: null, initial: 'ن' };
        }
        const initial = author.first_name?.charAt(0) || author.full_name?.charAt(0) || 'ن';
        return { image: author.profile_image, initial };
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
                                <div className={styles.cardContent}>
                                    <h2 className={styles.storyTitle}>{story.title}</h2>
                                    <div className={styles.authorInfo}>
                                        <div className={styles.authorAvatar}>
                                            {getAuthorAvatar(story.author).image ? (
                                                <img
                                                    src={getAuthorAvatar(story.author).image!}
                                                    alt={getAuthorName(story.author)}
                                                />
                                            ) : (
                                                getAuthorAvatar(story.author).initial
                                            )}
                                        </div>
                                        <p className={styles.authorName}>
                                            نویسنده: {getAuthorName(story.author)}
                                        </p>
                                    </div>
                                    <p className={styles.storyExcerpt}>
                                        {story.parts[0]?.text.substring(0, 50) || "بدون متن"}...
                                    </p>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.viewButton}
                                            onClick={() => handleViewStory(story)}
                                        >
                                            مشاهده داستان
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {(hasNext || hasPrevious) && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.paginationButton}
                            onClick={handlePreviousPage}
                            disabled={!hasPrevious}
                        >
                            صفحه قبل
                        </button>
                        <span className={styles.pageInfo}>صفحه {currentPage}</span>
                        <button
                            className={styles.paginationButton}
                            onClick={handleNextPage}
                            disabled={!hasNext}
                        >
                            صفحه بعد
                        </button>
                    </div>
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
                    readOnly={true}
                    storyId={selectedStory.id}
                    storyTitle={selectedStory.title}
                    coverImage={selectedStory.cover_image}
                    backgroundColor={selectedStory.background_color}
                    fontColor={selectedStory.font_color}
                    modalTitle={selectedStory.title}
                />
            )}

            <Footer />
        </>
    );
};

export default QesseKhoonehPage;
