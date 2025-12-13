'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
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
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
    const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
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

            const response = await storyService.getApiStories(page, 12);

            if (append) {
                setStories(prev => [...prev, ...response.results]);
            } else {
                setStories(response.results);
            }

            setHasMore(response.next !== null);
        } catch (err) {
            setError("مشکلی در دریافت داستان‌ها رخ داده است.");
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


    const handleViewStory = (story: Story) => {
        // If story is completed, go to view page
        if (story.status === 'COMPLETED') {
            router.push(`/story/${story.id}`);
            return;
        }

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

    return (
        <>
            <Navbar logo={logo} />
            <Toaster position="top-center" />
            <div className={styles.container}>
                <h1 className={styles.title}>داستان‌های شما</h1>

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
                                <h2 className={styles.storyTitle}>{story.title}</h2>
                                <p className={styles.storyExcerpt}>{story.parts[0]?.text.substring(0, 50) || "بدون متن"}...</p>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.viewButton}
                                        onClick={() => handleViewStory(story.id)}
                                    >
                                        مشاهده داستان
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

export default StoriesPage;
