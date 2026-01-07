import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import { blogService } from '@/services/blogService';
import { CategoryPageClient } from '@/components/blog';
import logoImage from '@/assets/images/logo2.png';
import styles from './page.module.scss';

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    try {
        const { slug } = await params;
        const categoriesResponse = await blogService.getAllCategories();
        const category = categoriesResponse.items.find(cat => cat.slug === slug);

        if (!category) {
            return {
                title: 'دسته‌بندی یافت نشد',
            };
        }

        const metaTitle = category.meta_title || `${category.name} | بلاگ درخت`;
        const metaDescription = category.meta_description || category.description || `مقالات دسته‌بندی ${category.name}`;
        const canonicalUrl = `https://derakht.com/blog/category/${category.slug}`;

        return {
            title: metaTitle,
            description: metaDescription,
            openGraph: {
                type: 'website',
                title: metaTitle,
                description: metaDescription,
                url: canonicalUrl,
                siteName: 'درخت',
                locale: 'fa_IR',
                images: category.icon ? [
                    {
                        url: category.icon,
                        width: 800,
                        height: 600,
                        alt: category.name,
                    },
                ] : undefined,
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: category.icon ? [category.icon] : undefined,
            },
            alternates: {
                canonical: canonicalUrl,
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                },
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'دسته‌بندی | بلاگ درخت',
        };
    }
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
    const { slug } = await params;
    let category;
    let blogs;

    try {
        // Fetch categories and posts in parallel
        const [categoriesResponse, postsResponse] = await Promise.all([
            blogService.getAllCategories(),
            blogService.getPostsByCategory(slug),
        ]);

        category = categoriesResponse.items.find(cat => cat.slug === slug);

        if (!category) {
            notFound();
        }

        blogs = postsResponse.items;
    } catch (error) {
        console.error('Error fetching category data:', error);
        notFound();
    }

    // Structured Data for Category Page
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: category.name,
        description: category.description || `مقالات دسته‌بندی ${category.name}`,
        url: `https://derakht.com/blog/category/${category.slug}`,
        publisher: {
            '@type': 'Organization',
            name: 'درخت',
            logo: {
                '@type': 'ImageObject',
                url: 'https://derakht.com/logo.png',
            },
        },
        inLanguage: 'fa-IR',
    };

    // Breadcrumb structured data
    const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'خانه',
                item: 'https://derakht.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'بلاگ',
                item: 'https://derakht.com/blog',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: `https://derakht.com/blog/category/${category.slug}`,
            },
        ],
    };

    return (
        <>
            {/* Structured Data Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />

            <div className={styles.pageWrapper}>
                <Navbar logo={logoImage} />
                <CategoryPageClient
                    category={category}
                    initialBlogs={blogs}
                    categorySlug={slug}
                />
                <Footer />
            </div>
        </>
    );
};

export default CategoryPage;
