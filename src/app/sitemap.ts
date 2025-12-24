import { MetadataRoute } from 'next';
import { blogService } from '@/services/blogService';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://derakht.com';

    try {
        // Fetch all post slugs and categories in parallel
        const [postSlugs, categoriesResponse] = await Promise.all([
            blogService.getAllPostSlugs().catch(() => []),
            blogService.getAllCategories().catch(() => ({ items: [], total: 0, page: 1, size: 0 })),
        ]);

        // Static pages
        const staticPages: MetadataRoute.Sitemap = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/shop`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/template`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/story`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/qesse-khooneh`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/search`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.5,
            },
        ];

        // Blog post pages
        const blogPages: MetadataRoute.Sitemap = postSlugs.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updated_date ? new Date(post.updated_date) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        // Category pages
        const categoryPages: MetadataRoute.Sitemap = categoriesResponse.items.map((category) => ({
            url: `${baseUrl}/blog/category/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...staticPages, ...blogPages, ...categoryPages];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Return at least the static pages if API calls fail
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/shop`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
        ];
    }
}
