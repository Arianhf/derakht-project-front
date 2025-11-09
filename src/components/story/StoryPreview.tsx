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
    modalTitle?: string; // Custom title for the modal header
}

// Preset colors for background
const BACKGROUND_PRESET_COLORS = [
    { color: '#FFFFFF', label: 'سفید' },
    { color: '#FFF9F5', label: 'کرم روشن' },
    { color: '#E8F6FF', label: 'آبی روشن' },
    { color: '#FFF7E5', label: 'زرد روشن' },
    { color: '#2B463C', label: 'سبز تیره' },
];

// Preset colors for font
const FONT_PRESET_COLORS = [
    { color: '#2B463C', label: 'سبز تیره' },
    { color: '#000000', label: 'مشکی' },
    { color: '#FFFFFF', label: 'سفید' },
    { color: '#345BC0', label: 'آبی' },
    { color: '#FF6F61', label: 'مرجانی' },
];

// Skeleton loader component for images
const ImageSkeleton: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <div className={styles.skeleton} style={style} />
);

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
                                                       onColorChange,
                                                       modalTitle
                                                   }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'overlay' | 'sideBySide'>('overlay');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});
    const [isMobile, setIsMobile] = useState(false);
    const [mobilePageIndex, setMobilePageIndex] = useState(0); // Index for mobile pagination (0 = first image, 1 = first text, 2 = second image, etc.)
    const settingsModalRef = React.useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Helper function to convert hex color to rgba with opacity
    const hexToRgba = (hex: string, alpha: number): string => {
        // Remove # if present
        hex = hex.replace('#', '');

        // Handle 3-digit hex
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Generate line pattern based on font color
    const getLinePattern = (color: string | null | undefined): string => {
        if (!color) {
            return 'linear-gradient(transparent 29px, rgba(0, 0, 0, 0.1) 30px)';
        }
        const lineColor = hexToRgba(color, 0.15);
        return `linear-gradient(transparent 29px, ${lineColor} 30px)`;
    };

    // Mobile pagination helper functions
    const getTotalMobilePages = () => parts.length * 2; // Each part has 2 pages: image and text

    const getCurrentPartIndex = () => Math.floor(mobilePageIndex / 2);

    const isImagePage = () => mobilePageIndex % 2 === 0;

    const getMobilePageType = (): 'image' | 'text' => isImagePage() ? 'image' : 'text';

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset page index and maintain view mode when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setCurrentIndex(0);
            setMobilePageIndex(0);
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

    // Focus management for settings modal
    useEffect(() => {
        if (isSettingsModalOpen && settingsModalRef.current) {
            // Focus the settings modal when it opens
            const focusableElements = settingsModalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }

            // Trap focus within the modal
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setIsSettingsModalOpen(false);
                }

                if (e.key === 'Tab') {
                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isSettingsModalOpen]);

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
        if (isMobile) {
            // Mobile pagination: navigate through image/text pages
            if (mobilePageIndex < getTotalMobilePages() - 1) {
                setMobilePageIndex(mobilePageIndex + 1);
            } else {
                // Last mobile page - finish story
                if (!isFullPage) {
                    handleFinishStory();
                }
            }
        } else {
            // Desktop: navigate through parts
            if (currentIndex < parts.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                if (!isFullPage) {
                    handleFinishStory();
                }
            }
        }
    };

    const handlePrev = () => {
        if (isMobile) {
            // Mobile pagination: go back through image/text pages
            if (mobilePageIndex > 0) {
                setMobilePageIndex(mobilePageIndex - 1);
            }
        } else {
            // Desktop: go back through parts
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
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

    const isLastPage = isMobile
        ? mobilePageIndex === getTotalMobilePages() - 1
        : currentIndex === parts.length - 1;

    const previewContent = (
        <div className={`${styles.previewContainer} ${isFullPage ? styles.fullPageContainer : ''}`}>
            {/* Close button - only show in modal mode */}
            {!isFullPage && (
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="بستن پیش‌نمایش"
                >
                    <FaTimes />
                </button>
            )}

            {/* Header with page indicator */}
            <div className={styles.previewHeader}>
                <h2 id="preview-modal-title">{modalTitle || 'پیش‌نمایش داستان'}</h2>
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
                {/* View mode toggle - hide on mobile */}
                {!isMobile && (
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
                )}
                <div className={styles.pageCount}>
                    {isMobile ? (
                        <>صفحه {mobilePageIndex + 1} از {getTotalMobilePages()}</>
                    ) : (
                        <>صفحه {currentIndex + 1} از {parts.length}</>
                    )}
                </div>
            </div>

            {/* Content area - changes based on view mode or mobile pagination */}
            <div className={`${styles.previewContent} ${isMobile ? styles.mobileView : styles[viewMode]}`}>
                {isMobile ? (
                    // Mobile single-page view: show either image or text
                    <div className={styles.mobilePageView}>
                        {getMobilePageType() === 'image' ? (
                            // Show only image
                            <div className={styles.mobileImagePage}>
                                {!imageLoadingStates[`mobile-${mobilePageIndex}`] && (
                                    <ImageSkeleton style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
                                )}
                                <Image
                                    src={parts[getCurrentPartIndex()]?.illustration || "/placeholder-image.jpg"}
                                    alt={`تصویر داستان - صفحه ${mobilePageIndex + 1}`}
                                    fill
                                    className={styles.storyImage}
                                    style={{ opacity: imageLoadingStates[`mobile-${mobilePageIndex}`] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                                    onLoad={() => handleImageLoad(`mobile-${mobilePageIndex}`)}
                                />
                            </div>
                        ) : (
                            // Show only text
                            <div className={styles.mobileTextPage}>
                                <div
                                    className={styles.mobileTextContent}
                                    style={{
                                        backgroundColor: backgroundColor || '#fff8dc',
                                        color: fontColor || '#2B463C',
                                        backgroundImage: getLinePattern(fontColor),
                                        backgroundSize: '100% 30px'
                                    }}
                                >
                                    {parts[getCurrentPartIndex()]?.text || "متنی وارد نشده است."}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Desktop view modes
                    <>
                        {viewMode === 'overlay' ? (
                            // Overlay mode
                            <div className={styles.overlayView}>
                                <div className={styles.imageContainer}>
                                    {!imageLoadingStates[`overlay-${currentIndex}`] && (
                                        <ImageSkeleton style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5 }} />
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
                                        <div
                                            className={styles.storyText}
                                            style={{
                                                backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.5)',
                                                color: fontColor || '#2B463C'
                                            }}
                                        >
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
                                        <ImageSkeleton style={{ width: '100%', height: '400px', position: 'absolute' }} />
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
                                    <div
                                        className={styles.sideText}
                                        style={{
                                            backgroundColor: backgroundColor || '#fff8dc',
                                            color: fontColor || '#2B463C',
                                            backgroundImage: getLinePattern(fontColor),
                                            backgroundSize: '100% 30px'
                                        }}
                                    >
                                        {parts[currentIndex]?.text || "متنی وارد نشده است."}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Navigation controls */}
            <div className={styles.navigationControls}>
                <button
                    className={styles.prevButton}
                    onClick={handlePrev}
                    disabled={isMobile ? mobilePageIndex === 0 : currentIndex === 0}
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
                <div
                    className={styles.modalOverlay}
                    onClick={() => setIsSettingsModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="settings-modal-title"
                >
                    <div
                        ref={settingsModalRef}
                        className={styles.settingsModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 id="settings-modal-title" className={styles.settingsTitle}>تنظیمات داستان</h3>
                        <button
                            className={styles.closeModalButton}
                            onClick={() => setIsSettingsModalOpen(false)}
                            aria-label="بستن تنظیمات"
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
                                                <ImageSkeleton style={{ width: '120px', height: '80px', position: 'absolute', top: 0, left: 0 }} />
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
                                    {/* Preset colors */}
                                    <div className={styles.presetColors}>
                                        {BACKGROUND_PRESET_COLORS.map((preset) => (
                                            <button
                                                key={preset.color}
                                                className={`${styles.presetColorCircle} ${backgroundColor === preset.color ? styles.active : ''}`}
                                                style={{ backgroundColor: preset.color }}
                                                onClick={() => handleColorChange('background', preset.color)}
                                                title={preset.label}
                                            />
                                        ))}
                                    </div>

                                    {/* Custom color picker */}
                                    <div className={styles.customColorInputs}>
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
                            </div>

                            <div className={styles.settingItem}>
                                <label htmlFor="font-color-picker">رنگ متن:</label>
                                <div className={styles.colorPickerContainer}>
                                    {/* Preset colors */}
                                    <div className={styles.presetColors}>
                                        {FONT_PRESET_COLORS.map((preset) => (
                                            <button
                                                key={preset.color}
                                                className={`${styles.presetColorCircle} ${fontColor === preset.color ? styles.active : ''}`}
                                                style={{ backgroundColor: preset.color }}
                                                onClick={() => handleColorChange('font', preset.color)}
                                                title={preset.label}
                                            />
                                        ))}
                                    </div>

                                    {/* Custom color picker */}
                                    <div className={styles.customColorInputs}>
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
        <div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
        >
            {previewContent}
        </div>
    );
};

export default StoryPreview;