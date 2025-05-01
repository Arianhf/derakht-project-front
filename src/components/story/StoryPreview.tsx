'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaTimes, FaArrowRight, FaArrowLeft, FaColumns, FaLayerGroup, FaImage, FaCog } from 'react-icons/fa';
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
    coverImage?: string | null;
    backgroundImage?: string | null;
    onCoverImageUpload?: (file: File) => void;
    onBackgroundImageUpload?: (file: File) => void;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({
                                                       parts,
                                                       isOpen,
                                                       onClose,
                                                       isFullPage = false,
                                                       storyId,
                                                       storyTitle,
                                                       coverImage,
                                                       backgroundImage,
                                                       onCoverImageUpload,
                                                       onBackgroundImageUpload
                                                   }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'overlay' | 'sideBySide'>('overlay');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
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

    const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !storyId || !onCoverImageUpload) return;

        const file = e.target.files[0];
        onCoverImageUpload(file);
    };

    const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !storyId || !onBackgroundImageUpload) return;

        const file = e.target.files[0];
        onBackgroundImageUpload(file);
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
                {storyId && (
                    <button
                        className={styles.settingsButton}
                        onClick={() => setIsSettingsModalOpen(true)}
                        title="تنظیمات داستان"
                    >
                        <FaCog />
                    </button>
                )}
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
            <div
                className={`${styles.previewContent} ${styles[viewMode]}`}
                style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
            >
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

            {/* Settings Modal */}
            {isSettingsModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsSettingsModalOpen(false)}>
                    <div className={styles.settingsModal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.settingsTitle}>تنظیمات داستان</h3>
                        <button
                            className={styles.closeModalButton}
                            onClick={() => setIsSettingsModalOpen(false)}
                        >
                            <FaTimes />
                        </button>

                        <div className={styles.settingsContent}>
                            <div className={styles.settingItem}>
                                <label htmlFor="cover-image-upload">تصویر جلد:</label>
                                <div className={styles.imagePreviewUpload}>
                                    {coverImage ? (
                                        <div className={styles.imagePreviewContainer}>
                                            <Image
                                                src={coverImage}
                                                alt="تصویر جلد"
                                                width={120}
                                                height={80}
                                                className={styles.imagePreview}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.noImage}>بدون تصویر</div>
                                    )}
                                    <input
                                        id="cover-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className={styles.fileInput}
                                        onChange={handleCoverImageUpload}
                                    />
                                    <label htmlFor="cover-image-upload" className={styles.uploadButton}>
                                        انتخاب تصویر
                                    </label>
                                </div>
                            </div>

                            <div className={styles.settingItem}>
                                <label htmlFor="background-image-upload">تصویر پس‌زمینه:</label>
                                <div className={styles.imagePreviewUpload}>
                                    {backgroundImage ? (
                                        <div className={styles.imagePreviewContainer}>
                                            <Image
                                                src={backgroundImage}
                                                alt="تصویر پس‌زمینه"
                                                width={120}
                                                height={80}
                                                className={styles.imagePreview}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.noImage}>بدون تصویر</div>
                                    )}
                                    <input
                                        id="background-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className={styles.fileInput}
                                        onChange={handleBackgroundImageUpload}
                                    />
                                    <label htmlFor="background-image-upload" className={styles.uploadButton}>
                                        انتخاب تصویر
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.modalButton}
                                onClick={() => setIsSettingsModalOpen(false)}
                            >
                                بستن
                            </button>
                        </div>
                    </div>
                </div>
            )}
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