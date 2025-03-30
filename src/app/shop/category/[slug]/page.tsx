// src/app/shop/category/[slug]/page.tsx
import { Metadata } from 'next';
import CategoryPage from './CategoryPage';

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
    return <CategoryPage params={{ slug }} />;
}