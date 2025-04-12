'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaTimes, FaArrowRight, FaArrowLeft, FaColumns, FaLayerGroup } from 'react-icons/fa';
import styles from "./StoryPreview.module.scss";
import { storyService } from '@/services/storyService';
import { toast } from 'react-hot-toast';

interface StoryPreviewProps {
    parts: { illustration: string; text: string }[];
    isOpen: boolean;
    onClose: () => void;
    isFullPage?: boolean;
    storyId?: string;
    storyTitle?: string;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({
                                                       parts,
                                                       isOpen,
                                                       onClose,
                                                       isFullPage = false,
                                                       storyId,
                                                       storyTitle
                                                   }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'overlay' | 'sideBySide'>('overlay');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Reset page index and maintain view mode when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setCurrentIndex(0);
        }
    }, [isOpen]);

    // Prevent background scrolling when modal is open and not in full-page mode
    useEffect(() => {
        if (isOpen && !isFullPage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, isFullPage]);

    if (!isOpen) return null;

    const handleFinishStory = async () => {
        if (!storyId || !storyTitle || isFullPage) {
            // If no storyId or storyTitle provided, or if we're in full-page mode, just navigate
            router.push('/story');
            return;
        }

        try {
            setIsSubmitting(true);
            await storyService.finishStory(storyId, storyTitle);
            toast.success('داستان با موفقیت ذخیره شد');
            router.push('/story');
        } catch (error) {
            console.error('Error finishing story:', error);
            toast.error('خطا در ذخیره‌سازی داستان');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < parts.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            if (!isFullPage) {
                handleFinishStory();
            }
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const isLastPage = currentIndex === parts.length - 1;

    const previewContent = (
        <div className={`${styles.previewContainer} ${isFullPage ? styles.fullPageContainer : ''}`}>
            {/* Close button - only show in modal mode */}
            {!isFullPage && (
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes />
                </button>
            )}

            {/* Header with page indicator */}
            <div className={styles.previewHeader}>
                <h2>پیش‌نمایش داستان</h2>
            </div>

            <div className={styles.previewConfig}>
                {/* View mode toggle */}
                <div className={styles.viewModeToggle}>
                    <button
                        className={`${styles.viewModeButton} ${viewMode === 'overlay' ? styles.active : ''}`}
                        onClick={() => setViewMode('overlay')}
                        title="نمایش متن روی تصویر"
                    >
                        <FaLayerGroup/>
                    </button>
                    <button
                        className={`${styles.viewModeButton} ${viewMode === 'sideBySide' ? styles.active : ''}`}
                        onClick={() => setViewMode('sideBySide')}
                        title="نمایش متن کنار تصویر"
                    >
                        <FaColumns/>
                    </button>
                </div>
                <div className={styles.pageCount}>
                    صفحه {currentIndex + 1} از {parts.length}
                </div>
            </div>

            {/* Content area - changes based on view mode */}
            <div className={`${styles.previewContent} ${styles[viewMode]}`}>
                {viewMode === 'overlay' ? (
                    // Overlay mode
                    <div className={styles.overlayView}>
                        <div className={styles.imageContainer}>
                            <Image
                                src={parts[currentIndex]?.illustration || "/placeholder-image.jpg"}
                                alt={`تصویر داستان - صفحه ${currentIndex + 1}`}
                                fill
                                className={styles.storyImage}
                            />
                            <div className={styles.gradientOverlay}></div>
                            <div className={styles.textContainer}>
                                <div className={styles.storyText}>
                                    {parts[currentIndex]?.text || "متنی وارد نشده است."}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Side by side mode
                    <div className={styles.sideBySideView}>
                        <div className={styles.imagePane}>
                            <Image
                                src={parts[currentIndex]?.illustration || "/placeholder-image.jpg"}
                                alt={`تصویر داستان - صفحه ${currentIndex + 1}`}
                                width={500}
                                height={400}
                                layout="responsive"
                                className={styles.sideImage}
                            />
                        </div>
                        <div className={styles.textPane}>
                            <div className={styles.sideText}>
                                {parts[currentIndex]?.text || "متنی وارد نشده است."}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation controls */}
            <div className={styles.navigationControls}>
                <button
                    className={styles.prevButton}
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    <FaArrowRight className={styles.buttonIcon} />
                    <span>قبلی</span>
                </button>

                <button
                    className={styles.nextButton}
                    onClick={handleNext}
                    disabled={isSubmitting}
                >
                    <span>{isLastPage ? (isSubmitting ? "در حال ذخیره..." : "پایان") : "بعدی"}</span>
                    {!isLastPage && <FaArrowLeft className={styles.buttonIcon} />}
                </button>
            </div>
        </div>
    );

    // If it's a full-page view, render without the overlay
    if (isFullPage) {
        return previewContent;
    }

    // Otherwise, render with the modal overlay
    return (
        <div className={styles.modalOverlay}>
            {previewContent}
        </div>
    );
};

export default StoryPreview;