'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import StoryPreviewV2 from '@/components/story/StoryPreviewV2';
import { Story } from '@/types/story';
import { Toaster } from 'react-hot-toast';
import styles from './StoryPage.module.scss';

interface StoryPageClientProps {
    story: Story;
}

const StoryPageClient: React.FC<StoryPageClientProps> = ({ story }) => {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    // Check if story has parts
    if (!story.parts || story.parts.length === 0) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>📖</div>
                    <h2>داستان خالی است</h2>
                    <p>این داستان هنوز محتوایی ندارد</p>
                    <button
                        className={styles.backButton}
                        onClick={handleClose}
                    >
                        بازگشت
                    </button>
                </div>
            </div>
        );
    }

    // Render story with StoryPreviewV2
    return (
        <div className={styles.pageContainer}>
            <Toaster position="top-center" />

            <StoryPreviewV2
                story={story}
                isOpen={true}
                onClose={handleClose}
                isFullPage={true}
            />
        </div>
    );
};

export default StoryPageClient;
