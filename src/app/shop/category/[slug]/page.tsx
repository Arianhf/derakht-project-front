// src/app/shop/category/[slug]/page.tsx
import { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';
import { categoryService } from '@/services/categoryService';
import { shopService } from '@/services/shopService';
import { notFound } from 'next/navigation';

export type CategoryParams = Promise<{ slug: string }>;

// Update generateMetadata to also handle params as a Promise
export async function generateMetadata({ params }: { params: CategoryParams }): Promise<Metadata> {
    // Await the params Promise to get the slug
    const { slug } = await params;

    return {
        title: `فروشگاه درخت | دسته‌بندی ${slug}`,
        description: `محصولات دسته‌بندی ${slug} در فروشگاه درخت`,
    };
}

export default async function Page({ params }: { params: CategoryParams }) {
    const { slug } = await params;

    try {
        // Fetch category and products on server
        const [category, productsData] = await Promise.all([
            categoryService.getCategoryBySlug(slug),
            shopService.getProductsByCategory(slug, { sort: 'newest' })
        ]);

        if (!category) {
            notFound();
        }

        return (
            <CategoryPageClient
                category={category}
                initialProducts={productsData.results || []}
                categorySlug={slug}
            />
        );
    } catch (error) {
        notFound();
    }
}