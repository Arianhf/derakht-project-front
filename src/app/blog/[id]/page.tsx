'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, useParams} from 'next/navigation';
import BlogDetails from '@/components/blog/BlogDetails';
import {blogService} from '@/services/blogService';
import {BlogPost} from '@/types';
import logo from '@/assets/images/logo2.png';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import {Navbar} from '@/components/shared/Navbar/Navbar';
import styles from '../page.module.scss';

const BlogDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const blogId = params?.id as string;

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(blogId);
                setBlog(data);
            } catch (err) {
                console.error(err);
                setError('مشکلی در دریافت مقاله رخ داده است.');
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchBlogDetails();
        }
    }, [blogId]);

    if (loading) return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <LoadingSpinner message="در حال بارگذاری مقاله..."/>
            </main>
        </div>
    );

    if (error) return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <ErrorMessage message={error}/>
            </main>
        </div>
    );

    if (!blog) return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <ErrorMessage message="مقاله مورد نظر یافت نشد"/>
            </main>
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
    }
    return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <BlogDetails blog={blogDetailsData} logo={logo}/>
            </main>
        </div>
    );
};

export default BlogDetailPage;