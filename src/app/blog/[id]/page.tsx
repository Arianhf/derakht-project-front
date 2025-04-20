// Modified version of src/app/blog/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogDetails from '@/components/blog/BlogDetails';
import { blogService } from '@/services/blogService';
import { RelatedPost } from '@/services/blogService';
import { BlogPost } from '@/types';
import logo from '@/assets/images/logo2.png';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import styles from './page.module.scss';


const BlogDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const blogId = params?.id as string;

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogDetailsAndRelated = async () => {
            try {
                setLoading(true);

                // Fetch blog details and related posts in parallel
                const [blogData, relatedData] = await Promise.all([
                    blogService.getPostById(blogId),
                    blogService.getRelatedPosts(blogId)
                ]);

                setBlog(blogData);
                setRelatedPosts(relatedData);
            } catch (err) {
                console.error(err);
                setError('مشکلی در دریافت مقاله رخ داده است.');
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchBlogDetailsAndRelated();
        }
    }, [blogId]);

    if (loading) return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <LoadingSpinner message="در حال بارگذاری مقاله..." fullPage/>
            </main>
            <Footer/>
        </div>
    );

    if (error) return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <ErrorMessage message={error}/>
            </main>
            <Footer/>
        </div>
    );

    if (!blog) return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <ErrorMessage message="مقاله مورد نظر یافت نشد"/>
            </main>
            <Footer/>
        </div>
    );

    const blogDetailsData = {
        title: blog.title,
        subtitle: blog.subtitle,
        intro: blog.intro,
        author: {
            first_name: blog.owner?.first_name || 'نویسنده'
        },
        jalali_date: blog.jalali_date,
        reading_time: blog.reading_time,
        content: blog.body || '',
        tags: blog.tags,
        header_image: blog.header_image ? {
            meta: {
                download_url: blog.header_image.meta?.download_url || ''
            },
            title: blog.header_image.title
        } : undefined,
        featured: blog.featured,
        hero: blog.hero
    };

    return (
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
    );
};

export default BlogDetailPage;