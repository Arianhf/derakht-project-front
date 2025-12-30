import React from 'react';
import { Metadata } from 'next';
import BlogPostClient from '../../components/blog/BlogPostClient';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import logoImage from '@/assets/images/logo2.png';
import styles from './page.module.scss';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';

export const dynamic = 'force-dynamic';

// SEO Metadata for blog listing page
export const metadata: Metadata = {
    title: 'بلاگ درخت | مقالات آموزشی کودکان',
    description: 'مجموعه کامل مقالات آموزشی، داستان‌ها و محتوای سرگرم‌کننده برای کودکان. آموزش خلاقانه و جذاب برای رشد فکری و شخصیتی کودکان',
    keywords: 'بلاگ کودکان، مقالات آموزشی، داستان کودکانه، آموزش خلاقانه، محتوای کودک',
    openGraph: {
        type: 'website',
        title: 'بلاگ درخت | مقالات آموزشی کودکان',
        description: 'مجموعه کامل مقالات آموزشی، داستان‌ها و محتوای سرگرم‌کننده برای کودکان',
        url: 'https://derakht.com/blog',
        siteName: 'درخت',
        locale: 'fa_IR',
        images: [
            {
                url: 'https://derakht.com/images/blog-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'بلاگ درخت',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'بلاگ درخت | مقالات آموزشی کودکان',
        description: 'مجموعه کامل مقالات آموزشی، داستان‌ها و محتوای سرگرم‌کننده برای کودکان',
        images: ['https://derakht.com/images/blog-og-image.jpg'],
    },
    alternates: {
        canonical: 'https://derakht.com/blog',
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

const BlogPage = async () => {
    let blogs: BlogPost[] = [];
    let featuredBlogs: BlogPost[] = [];
    let heroPosts: BlogPost[] = [];

    try {
        // Fetch all three types of blog posts on server
        const [regularPosts, featuredPosts, heroPostsResponse] = await Promise.all([
            blogService.getAllPosts(),
            blogService.getFeaturedPosts(),
            blogService.getHeroPosts()
        ]);

        blogs = regularPosts.items;

        // Filter featured posts that are not hero posts
        featuredBlogs = featuredPosts.items.filter(post =>
            post.featured && !post.hero);

        // Set hero posts from the updated API
        heroPosts = heroPostsResponse.items || [];
    } catch (error) {
        // Log error for debugging
        console.error('Error fetching blog posts:', error);
        // Return empty arrays as fallback - page will still render with empty state
    }
    // Structured Data for Blog Page
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'بلاگ درخت',
        description: 'مجموعه کامل مقالات آموزشی و داستان‌های کودکانه',
        url: 'https://derakht.com/blog',
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
                <Navbar logo={logoImage} />
                <main className={styles.mainContent}>
                    <BlogPostClient
                        blogs={blogs}
                        featuredBlogs={featuredBlogs}
                        heroPosts={heroPosts}
                    />
                </main>
            </div>
        </>
    );
};

export default BlogPage;
