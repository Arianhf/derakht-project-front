import StoryEditPageClient from './StoryEditPageClient';
import { storyService } from '@/services/storyService';
import { notFound } from 'next/navigation';
import styles from './StoryEditPage.module.scss';

export const metadata = {
    title: 'ویرایش داستان | درخت',
    description: 'ویرایش داستان خود',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    console.log('[StoryEdit] Received params:', params);
    const { id } = await params;
    console.log('[StoryEdit] Awaited id:', id);
    try {
        console.log('[StoryEdit] Fetching story with id:', id);
        const story = await storyService.getStoryById(id);
        console.log('[StoryEdit] Story fetched successfully:', story ? 'found' : 'not found');

        if (!story) {
            notFound();
        }

        return <StoryEditPageClient initialStory={story} />;
    } catch (error) {
        console.error('[StoryEdit] Error fetching story:', error);
        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>خطا</h2>
                    <p>خطا در دریافت داستان. لطفا دوباره تلاش کنید.</p>
                </div>
            </div>
        );
    }
}
