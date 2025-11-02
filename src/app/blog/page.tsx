import React from 'react';
import { Metadata } from 'next';
import BlogPost from '../../components/blog/BlogPost';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import logoImage from '@/assets/images/logo2.png';
import styles from './page.module.scss';

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

const BlogPage: React.FC = () => {
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
                    <BlogPost />
                </main>
            </div>
        </>
    );
};

export default BlogPage;
