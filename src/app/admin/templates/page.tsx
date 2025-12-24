import TemplatesListPageClient from './TemplatesListPageClient';
import { storyService } from '@/services/storyService';

export const metadata = {
    title: 'مدیریت قالب‌ها | پنل مدیریت درخت',
    description: 'مدیریت قالب‌های داستان',
};

export default async function Page() {
    // Fetch initial templates on server
    const response = await storyService.getTemplates();

    return <TemplatesListPageClient initialTemplates={response.results} />;
}
