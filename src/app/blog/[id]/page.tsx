import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetails from '@/components/blog/BlogDetails';
import { blogService } from '@/services/blogService';
import logo from '@/assets/images/logo2.png';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import styles from './page.module.scss';

interface BlogDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

// Allow dynamic params for new blog posts
export const dynamicParams = true;

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
    try {
        const posts = await blogService.getAllPosts();
        return posts.items.map((post) => ({
            id: post.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params for blog posts:', error);
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const blog = await blogService.getPostById(id);

        if (!blog) {
            return {
                title: 'مقاله یافت نشد',
            };
        }

        const metaTitle = blog.meta_title || blog.title;
        const metaDescription = blog.meta_description || blog.excerpt || blog.intro || 'خواندن این مقاله در درخت';
        const imageUrl = blog.og_image || blog.header_image?.meta?.download_url || '/images/default-og-image.jpg';
        const canonicalUrl = blog.canonical_url || `https://derakht.com/blog/${blog.slug || blog.id}`;
        const publishedDate = blog.published_date;
        const updatedDate = blog.updated_date;
        const authorName = blog.owner?.full_name || blog.owner?.first_name || 'درخت';

        return {
            title: metaTitle,
            description: metaDescription,
            keywords: blog.meta_keywords?.join(', '),
            authors: blog.owner?.full_name ? [{ name: blog.owner.full_name }] : undefined,
            openGraph: {
                type: 'article',
                title: metaTitle,
                description: metaDescription,
                url: canonicalUrl,
                siteName: 'درخت',
                locale: 'fa_IR',
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: blog.header_image?.title || blog.title,
                    },
                ],
                publishedTime: publishedDate,
                modifiedTime: updatedDate,
                authors: [authorName],
                tags: blog.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: [imageUrl],
                creator: blog.owner?.social_links?.twitter,
            },
            alternates: {
                canonical: canonicalUrl,
            },
            robots: {
                index: !blog.noindex,
                follow: !blog.noindex,
                googleBot: {
                    index: !blog.noindex,
                    follow: !blog.noindex,
                },
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'درخت - بلاگ کودکان',
        };
    }
}

// Fetch blog data server-side
const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
    const { id } = await params;
    let blog;
    let relatedPosts;

    try {
        // Fetch blog details and related posts in parallel
        [blog, relatedPosts] = await Promise.all([
            blogService.getPostById(id),
            blogService.getRelatedPosts(id).catch(() => []),
        ]);

        if (!blog) {
            notFound();
        }
    } catch (error) {
        console.error('Error fetching blog:', error);
        notFound();
    }

    const blogDetailsData = {
        title: blog.title,
        subtitle: blog.subtitle,
        intro: blog.intro,
        author: {
            first_name: blog.owner?.first_name || 'نویسنده',
            full_name: blog.owner?.full_name,
            bio: blog.owner?.bio,
            profile_url: blog.owner?.profile_url,
        },
        jalali_date: blog.jalali_date,
        published_date: blog.published_date,
        updated_date: blog.updated_date,
        reading_time: blog.reading_time,
        word_count: blog.word_count,
        content: blog.body || '',
        tags: blog.tags,
        category: blog.category,
        header_image: blog.header_image ? {
            meta: {
                download_url: blog.header_image.meta?.download_url || ''
            },
            title: blog.header_image.title
        } : undefined,
        featured: blog.featured,
        hero: blog.hero,
        slug: blog.slug,
    };

    // Structured Data (JSON-LD) for Article
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: blog.meta_description || blog.excerpt || blog.intro,
        image: blog.og_image || blog.header_image?.meta?.download_url,
        datePublished: blog.published_date,
        dateModified: blog.updated_date || blog.published_date,
        author: {
            '@type': 'Person',
            name: blog.owner?.full_name || blog.owner?.first_name || 'نویسنده',
            url: blog.owner?.profile_url,
        },
        publisher: {
            '@type': 'Organization',
            name: 'درخت',
            logo: {
                '@type': 'ImageObject',
                url: 'https://derakht.com/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': blog.canonical_url || `https://derakht.com/blog/${blog.slug || blog.id}`,
        },
        articleSection: blog.category?.name,
        keywords: blog.tags?.join(', '),
        wordCount: blog.word_count,
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
            ...(blog.category ? [{
                '@type': 'ListItem',
                position: 3,
                name: blog.category.name,
                item: `https://derakht.com/blog/category/${blog.category.slug}`,
            }] : []),
            {
                '@type': 'ListItem',
                position: blog.category ? 4 : 3,
                name: blog.title,
                item: blog.canonical_url || `https://derakht.com/blog/${blog.slug || blog.id}`,
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

            <div className={styles.blogPageWrapper}>
                <Navbar logo={logo}/>
                <main className={styles.mainContent}>
                    <BlogDetails
                        blog={blogDetailsData}
                        relatedPosts={relatedPosts}
                        logo={logo}
                    />
                </main>
                <Footer/>
            </div>
        </>
    );
};

export default BlogDetailPage;
