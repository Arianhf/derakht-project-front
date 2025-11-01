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
    backgroundColor?: string | null;
    fontColor?: string | null;
    onCoverImageUpload?: (file: File) => void;
    onColorChange?: (backgroundColor?: string, fontColor?: string) => void;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({
                                                       parts,
                                                       isOpen,
                                                       onClose,
                                                       isFullPage = false,
                                                       storyId,
                                                       storyTitle,
                                                       coverImage,
                                                       backgroundColor,
                                                       fontColor,
                                                       onCoverImageUpload,
                                                       onColorChange
                                                   }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'overlay' | 'sideBySide'>('overlay');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});
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

    const handleColorChange = (type: 'background' | 'font', color: string) => {
        if (!onColorChange) return;

        if (type === 'background') {
            onColorChange(color, fontColor || undefined);
        } else {
            onColorChange(backgroundColor || undefined, color);
        }
    };

    const handleImageLoad = (imageKey: string) => {
        setImageLoadingStates(prev => ({ ...prev, [imageKey]: true }));
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
                style={{
                    backgroundColor: backgroundColor || undefined,
                    color: fontColor || undefined
                }}
            >
                {viewMode === 'overlay' ? (
                    // Overlay mode
                    <div className={styles.overlayView}>
                        <div className={styles.imageContainer}>
                            {!imageLoadingStates[`overlay-${currentIndex}`] && (
                                <div className={styles.skeleton} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5 }} />
                            )}
                            <Image
                                src={parts[currentIndex]?.illustration || "/placeholder-image.jpg"}
                                alt={`تصویر داستان - صفحه ${currentIndex + 1}`}
                                fill
                                className={styles.storyImage}
                                style={{ opacity: imageLoadingStates[`overlay-${currentIndex}`] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                                onLoad={() => handleImageLoad(`overlay-${currentIndex}`)}
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
                            {!imageLoadingStates[`sidebyside-${currentIndex}`] && (
                                <div className={styles.skeleton} style={{ width: '100%', height: '400px', position: 'absolute' }} />
                            )}
                            <Image
                                src={parts[currentIndex]?.illustration || "/placeholder-image.jpg"}
                                alt={`تصویر داستان - صفحه ${currentIndex + 1}`}
                                width={500}
                                height={400}
                                className={styles.sideImage}
                                style={{ width: '100%', height: 'auto', opacity: imageLoadingStates[`sidebyside-${currentIndex}`] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                                onLoad={() => handleImageLoad(`sidebyside-${currentIndex}`)}
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
                                        <div className={styles.imagePreviewContainer} style={{ position: 'relative' }}>
                                            {!imageLoadingStates['cover-preview'] && (
                                                <div className={styles.skeleton} style={{ width: '120px', height: '80px', position: 'absolute', top: 0, left: 0 }} />
                                            )}
                                            <Image
                                                src={coverImage}
                                                alt="تصویر جلد"
                                                width={120}
                                                height={80}
                                                className={styles.imagePreview}
                                                style={{ opacity: imageLoadingStates['cover-preview'] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                                                onLoad={() => handleImageLoad('cover-preview')}
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
                                <label htmlFor="background-color-picker">رنگ پس‌زمینه:</label>
                                <div className={styles.colorPickerContainer}>
                                    <input
                                        id="background-color-picker"
                                        type="color"
                                        value={backgroundColor || '#FFFFFF'}
                                        onChange={(e) => handleColorChange('background', e.target.value)}
                                        className={styles.colorInput}
                                    />
                                    <input
                                        type="text"
                                        value={backgroundColor || ''}
                                        onChange={(e) => handleColorChange('background', e.target.value)}
                                        placeholder="#FFFFFF"
                                        className={styles.colorTextInput}
                                    />
                                    {backgroundColor && (
                                        <button
                                            onClick={() => onColorChange && onColorChange(undefined, fontColor || undefined)}
                                            className={styles.clearButton}
                                        >
                                            پاک کردن
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.settingItem}>
                                <label htmlFor="font-color-picker">رنگ متن:</label>
                                <div className={styles.colorPickerContainer}>
                                    <input
                                        id="font-color-picker"
                                        type="color"
                                        value={fontColor || '#000000'}
                                        onChange={(e) => handleColorChange('font', e.target.value)}
                                        className={styles.colorInput}
                                    />
                                    <input
                                        type="text"
                                        value={fontColor || ''}
                                        onChange={(e) => handleColorChange('font', e.target.value)}
                                        placeholder="#000000"
                                        className={styles.colorTextInput}
                                    />
                                    {fontColor && (
                                        <button
                                            onClick={() => onColorChange && onColorChange(backgroundColor || undefined, undefined)}
                                            className={styles.clearButton}
                                        >
                                            پاک کردن
                                        </button>
                                    )}
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