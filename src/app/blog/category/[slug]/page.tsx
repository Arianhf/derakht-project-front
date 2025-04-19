// src/app/blog/category/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import { blogService, BlogCategory } from '@/services/blogService';
import { BlogPost } from '@/types';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { FaArrowRight } from 'react-icons/fa';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import logoImage from '@/assets/images/logo2.png';
import Image from 'next/image';
import styles from './page.module.scss';

const CategoryPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const categorySlug = params?.slug as string;

    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [category, setCategory] = useState<BlogCategory | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!categorySlug) {
            router.push('/blog');
            return;
        }

        const fetchCategoryAndPosts = async () => {
            try {
                setLoading(true);

                // Fetch all categories to find the current one
                const categoriesResponse = await blogService.getAllCategories();
                const foundCategory = categoriesResponse.items.find(cat => cat.slug === categorySlug);

                if (!foundCategory) {
                    setError('دسته‌بندی مورد نظر یافت نشد.');
                    setLoading(false);
                    return;
                }

                setCategory(foundCategory);

                // Fetch posts for this category
                const postsResponse = await blogService.getPostsByCategory(categorySlug);
                setBlogs(postsResponse.items);
            } catch (err) {
                console.error(err);
                setError('مشکلی در دریافت اطلاعات رخ داده است.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndPosts();
    }, [categorySlug, router]);

    const handleNavigate = (id: number) => {
        router.push(`/blog/${id}`);
    };

    const handleTagClick = (tag: string) => {
        router.push(`/blog/tag?tag=${tag}`);
    };

    if (loading) return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logoImage} />
            <div className={styles.container}>
                <LoadingSpinner message="در حال بارگذاری مقالات..." />
            </div>
            <Footer />
        </div>
    );

    if (error || !category) return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logoImage} />
            <div className={styles.container}>
                <ErrorMessage message={error || 'دسته‌بندی مورد نظر یافت نشد.'} />
            </div>
            <Footer />
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logoImage} />

            <div className={styles.container}>
                <div className={styles.categoryHeader}>
                    <div className={styles.categoryHeaderContent}>
                        <h1 className={styles.categoryTitle}>{category.name}</h1>

                        {category.description && (
                            <p className={styles.categoryDescription}>{category.description}</p>
                        )}

                        <div className={styles.categoryMeta}>
              <span className={styles.postCount}>
                {toPersianNumber(blogs.length)} مقاله در این دسته‌بندی
              </span>
                        </div>
                    </div>

                    {category.icon && (
                        <div className={styles.categoryImageWrapper}>
                            <Image
                                src={category.icon}
                                alt={category.name}
                                className={styles.categoryImage}
                                width={120}
                                height={120}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.controlsBar}>
                    <button
                        onClick={() => router.push('/blog')}
                        className={styles.backButton}
                    >
                        <FaArrowRight className={styles.backIcon} />
                        بازگشت به همه مقالات
                    </button>
                </div>

                {blogs.length > 0 ? (
                    <div className={styles.blogsGrid}>
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className={styles.blogCard}
                                onClick={() => handleNavigate(blog.id)}
                            >
                                <div className={styles.imageContainer}>
                                    <Image
                                        src={blog.header_image?.meta?.download_url || "/default-image.jpg"}
                                        alt={blog.title || "Blog Image"}
                                        className={styles.blogImage}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className={styles.blogContent}>
                                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className={styles.tagContainer}>
                                            {blog.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={styles.tag}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTagClick(tag);
                                                    }}
                                                >
                          {tag}
                        </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className={styles.blogMeta}>
                                        نوشته شده توسط{" "}
                                        <span className={styles.authorName}>
                      {blog.owner?.first_name}
                    </span>{" "}
                                        · {blog.jalali_date || "تاریخ نامشخص"}
                                    </p>
                                    <button
                                        className={styles.readButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNavigate(blog.id);
                                        }}
                                    >
                                        مطالعه
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyMessage}>مقاله‌ای در این دسته‌بندی یافت نشد.</p>
                        <button
                            className={styles.backButton}
                            onClick={() => router.push('/blog')}
                        >
                            بازگشت به همه مقالات
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CategoryPage;