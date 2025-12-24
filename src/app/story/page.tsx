import StoriesPageClient from './StoriesPageClient';
import { storyService } from '@/services/storyService';

export const metadata = {
    title: 'داستان‌های من | درخت',
    description: 'مشاهده و مدیریت داستان‌های خود',
};

export default async function Page() {
    // Fetch initial stories on server
    const response = await storyService.getApiStories(1, 12);

    return (
        <StoriesPageClient
            initialStories={response.results}
            hasMoreInitial={response.next !== null}
        />
    );
}
