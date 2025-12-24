import StoryEditPageClient from './StoryEditPageClient';
import { storyService } from '@/services/storyService';
import { notFound } from 'next/navigation';
import styles from './StoryEditPage.module.scss';

export const metadata = {
    title: 'ویرایش داستان | درخت',
    description: 'ویرایش داستان خود',
};

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const story = await storyService.getStoryById(params.id);

        if (!story) {
            notFound();
        }

        return <StoryEditPageClient initialStory={story} />;
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
