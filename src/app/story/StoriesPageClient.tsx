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

interface StoriesPageClientProps {
    initialStories: Story[];
    hasMoreInitial: boolean;
}

const StoriesPageClient: React.FC<StoriesPageClientProps> = ({ initialStories, hasMoreInitial }) => {
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>(initialStories);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
    const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(hasMoreInitial);
    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchStories = useCallback(async (page: number) => {
        try {
            setLoadingMore(true);
            const response = await storyService.getApiStories(page, 12);
            setStories(prev => [...prev, ...response.results]);
            setHasMore(response.next !== null);
        } catch (err) {
            setError("مشکلی در دریافت داستان‌ها رخ داده است.");
        } finally {
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
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
    }, [hasMore, loadingMore]);

    useEffect(() => {
        if (currentPage > 1) {
            fetchStories(currentPage);
        }
    }, [currentPage, fetchStories]);

    const handleViewStory = (storyId: string) => {
        router.push(`/story/${storyId}`);
    };

    const handleDeleteClick = (storyId: string) => {
        setStoryToDelete(storyId);
        setDeleteConfirmOpen(true);
    };

    const handleCancelDelete = () => {
        setDeleteConfirmOpen(false);
        setStoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!storyToDelete) return;

        try {
            setDeleting(true);
            await storyService.deleteStory(storyToDelete);

            // Remove the deleted story from the list
            setStories(prev => prev.filter(story => story.id !== storyToDelete));

            toast.success('داستان با موفقیت حذف شد');
            setDeleteConfirmOpen(false);
            setStoryToDelete(null);
        } catch (err) {
            console.error('Error deleting story:', err);
            toast.error('خطا در حذف داستان. لطفا دوباره تلاش کنید.');
        } finally {
            setDeleting(false);
        }
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
                                <p className={styles.storyExcerpt}>{story.parts[0]?.canvas_text_data ? "قصه آماده است..." : "بدون متن"}</p>
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
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteClick(story.id)}
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
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className={styles.modalOverlay} onClick={handleCancelDelete}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>تأیید حذف</h2>
                        <p className={styles.modalText}>آیا از حذف این داستان اطمینان دارید؟ این عملیات قابل بازگشت نیست.</p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.confirmButton}
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'در حال حذف...' : 'بله، حذف شود'}
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancelDelete}
                                disabled={deleting}
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default StoriesPageClient;
