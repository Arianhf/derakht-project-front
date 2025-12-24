import StoryPageClient from './StoryPageClient';
import { storyService } from '@/services/storyService';
import { notFound } from 'next/navigation';
import styles from './StoryPage.module.scss';

export const metadata = {
    title: 'مشاهده داستان | درخت',
    description: 'مشاهده داستان',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const story = await storyService.getStoryById(id);

        if (!story) {
            notFound();
        }

        return <StoryPageClient story={story} />;
    } catch (error) {
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
