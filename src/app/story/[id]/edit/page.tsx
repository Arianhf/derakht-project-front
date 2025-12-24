import StoryEditPageClient from './StoryEditPageClient';
import { storyService } from '@/services/storyService';
import { notFound } from 'next/navigation';
import styles from './StoryEditPage.module.scss';

export const metadata = {
    title: 'ویرایش داستان | درخت',
    description: 'ویرایش داستان خود',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    console.log('[StoryEdit] ========== Story Edit Page Start ==========');
    console.log('[StoryEdit] Received params (type):', typeof params);
    console.log('[StoryEdit] Received params (value):', params);

    const { id } = await params;
    console.log('[StoryEdit] Awaited id:', id);
    console.log('[StoryEdit] ID type:', typeof id);
    console.log('[StoryEdit] ID length:', id?.length);

    try {
        console.log('[StoryEdit] Calling storyService.getStoryById with id:', id);
        const story = await storyService.getStoryById(id);

        console.log('[StoryEdit] Story fetch result:', {
            exists: !!story,
            storyId: story?.id,
            storyTitle: story?.title,
            partsCount: story?.parts?.length,
            fullStoryData: JSON.stringify(story).substring(0, 200) + '...'
        });

        if (!story) {
            console.error('[StoryEdit] Story is null/undefined, calling notFound()');
            notFound();
        }

        console.log('[StoryEdit] ========== Rendering StoryEditPageClient ==========');
        return <StoryEditPageClient initialStory={story} />;
    } catch (error: any) {
        console.error('[StoryEdit] ========== Error Caught ==========');
        console.error('[StoryEdit] Error type:', typeof error);
        console.error('[StoryEdit] Error constructor:', error?.constructor?.name);
        console.error('[StoryEdit] Full error object:', error);
        console.error('[StoryEdit] Error code:', error?.code);
        console.error('[StoryEdit] Error message:', error?.message);
        console.error('[StoryEdit] Error severity:', error?.severity);
        console.error('[StoryEdit] Error stack:', error?.stack);

        // Determine error message based on error type
        let errorTitle = 'خطا در دریافت داستان';
        let errorMessage = 'خطا در دریافت داستان. لطفا دوباره تلاش کنید.';

        if (error?.code === 'USER_NOT_FOUND' || error?.code === 'NOT_FOUND') {
            errorTitle = 'داستان پیدا نشد';
            errorMessage = 'داستان مورد نظر یافت نشد یا شما به آن دسترسی ندارید.';
        } else if (error?.code === 'PERMISSION_DENIED' || error?.code === 'FORBIDDEN') {
            errorTitle = 'عدم دسترسی';
            errorMessage = 'شما اجازه ویرایش این داستان را ندارید.';
        } else if (error?.code === 'NETWORK_ERROR') {
            errorTitle = 'خطای شبکه';
            errorMessage = 'مشکل در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.';
        }

        console.error('[StoryEdit] Displaying error UI with message:', errorMessage);

        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>{errorTitle}</h2>
                    <p>{errorMessage}</p>
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
