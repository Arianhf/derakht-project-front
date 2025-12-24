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
    console.log('[StoryView] ========== Story View Page Start ==========');
    console.log('[StoryView] Story ID:', id);

    try {
        console.log('[StoryView] Fetching story for public view...');
        const story = await storyService.getStoryById(id);
        console.log('[StoryView] Story fetched:', {
            exists: !!story,
            id: story?.id,
            title: story?.title
        });

        if (!story) {
            console.error('[StoryView] Story not found');
            notFound();
        }

        console.log('[StoryView] Rendering story view');
        return <StoryPageClient story={story} />;
    } catch (error: any) {
        console.error('[StoryView] ========== Error ==========');
        console.error('[StoryView] Error code:', error?.code);
        console.error('[StoryView] Error message:', error?.message);
        console.error('[StoryView] Error response status:', error?.response?.status);
        console.error('[StoryView] Full error:', error);

        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>خطا در دریافت داستان</h2>
                    <p>
                        {error?.code === 'USER_NOT_FOUND'
                            ? 'داستان مورد نظر یافت نشد.'
                            : error?.code === 'PERMISSION_DENIED'
                            ? 'شما به این داستان دسترسی ندارید.'
                            : 'خطا در دریافت داستان. لطفا دوباره تلاش کنید.'}
                    </p>
                    {error?.code && (
                        <p style={{ fontSize: '0.9em', opacity: 0.7, marginTop: '10px' }}>
                            کد خطا: {error.code}
                        </p>
                    )}
                </div>
            </div>
        );
    }
}
