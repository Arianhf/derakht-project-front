'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaTimes, FaArrowRight, FaArrowLeft, FaColumns, FaLayerGroup } from 'react-icons/fa';
import styles from "./StoryPreview.module.scss";

interface StoryPreviewProps {
    parts: { illustration: string; text: string }[];
    isOpen: boolean;
    onClose: () => void;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({ parts, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'overlay' | 'sideBySide'>('overlay');
    const router = useRouter();

    // Reset page index and maintain view mode when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setCurrentIndex(0);
        }
    }, [isOpen]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentIndex < parts.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            router.push('/stories');
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const isLastPage = currentIndex === parts.length - 1;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.previewContainer}>
                {/* Close button */}
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes />
                </button>

                {/* View mode toggle */}
                <div className={styles.viewModeToggle}>
                    <button
                        className={`${styles.viewModeButton} ${viewMode === 'overlay' ? styles.active : ''}`}
                        onClick={() => setViewMode('overlay')}
                        title="نمایش متن روی تصویر"
                    >
                        <FaLayerGroup />
                    </button>
                    <button
                        className={`${styles.viewModeButton} ${viewMode === 'sideBySide' ? styles.active : ''}`}
                        onClick={() => setViewMode('sideBySide')}
                        title="نمایش متن کنار تصویر"
                    >
                        <FaColumns />
                    </button>
                </div>

                {/* Header with page indicator */}
                <div className={styles.previewHeader}>
                    <h2>پیش‌نمایش داستان</h2>
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
                    >
                        <span>{isLastPage ? "پایان" : "بعدی"}</span>
                        {!isLastPage && <FaArrowLeft className={styles.buttonIcon} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryPreview;