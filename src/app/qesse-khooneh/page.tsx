'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./qesseKhooneh.module.scss";
import { storyService } from "@/services/storyService";
import { Story, Author } from "@/types/story";
import placeholderImage from "@/assets/images/story.png";
import { toast, Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import logo from '@/assets/images/logo2.png';

const QesseKhoonehPage: React.FC = () => {
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchStories = useCallback(async (page: number, append: boolean = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const response = await storyService.getCompletedStories(page, 12);

            if (append) {
                setStories(prev => [...prev, ...response.results]);
            } else {
                setStories(response.results);
            }

            setHasMore(response.next !== null);
        } catch (err) {
            // Stop pagination when an error occurs to prevent infinite loops
            setHasMore(false);

            // Only show error toast if this is the first page
            // For subsequent pages, silently fail to avoid spamming the user
            if (page === 1) {
                setError("مشکلی در دریافت داستان‌ها رخ داده است.");
                toast.error("مشکلی در دریافت داستان‌ها رخ داده است.");
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchStories(1);
    }, [fetchStories]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    setCurrentPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loadingMore, loading]);

    useEffect(() => {
        if (currentPage > 1) {
            fetchStories(currentPage, true);
        }
    }, [currentPage, fetchStories]);

    const handleViewStory = (storyId: string) => {
        router.push(`/story/${storyId}`);
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

    return (
        <>
            <Navbar logo={logo} />
            <Toaster position="top-center" />
            <div className={styles.container}>
                {error && (
                    <p className={styles.error}>{error}</p>
                )}

                {loading && stories.length === 0 ? (
                    <p className={styles.loading}>در حال بارگذاری...</p>
                ) : (
                    <>
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
                                                <Image
                                                    src={getAuthorAvatar(story.author).image!}
                                                    alt={getAuthorName(story.author)}
                                                    width={40}
                                                    height={40}
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
                                        {story.parts[0]?.canvas_text_data ? "قصه آماده است..." : "بدون متن"}
                                    </p>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.viewButton}
                                            onClick={() => handleViewStory(story.id)}
                                        >
                                            مشاهده داستان
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                        </div>

                        {/* Infinite scroll trigger */}
                        <div ref={observerTarget} className={styles.scrollTrigger} />

                        {/* Loading indicator for infinite scroll */}
                        {loadingMore && (
                            <div className={styles.loadingMore}>
                                <p>در حال بارگذاری داستان‌های بیشتر...</p>
                            </div>
                        )}

                        {/* End of results indicator */}
                        {!hasMore && stories.length > 0 && (
                            <div className={styles.endMessage}>
                                <p>همه داستان‌ها نمایش داده شدند</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </>
    );
};

export default QesseKhoonehPage;
