// src/app/shop/category/[slug]/page.tsx
import { Metadata } from 'next';
import CategoryPage from './CategoryPage';

// Generate metadata dynamically based on the category
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // You can fetch category data here if needed for more specific metadata
    // For now, we'll use a generic title and description
    return {
        title: `فروشگاه درخت | دسته‌بندی ${params.slug}`,
        description: `محصولات دسته‌بندی ${params.slug} در فروشگاه درخت`,
    };
}

export default function Page({ params }: { params: { slug: string } }) {
    return <CategoryPage params={params} />;
}