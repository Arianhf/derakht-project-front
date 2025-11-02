'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { BlogPost, Category } from '@/types';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import styles from '../../app/blog/category/[slug]/page.module.scss';

interface CategoryPageClientProps {
    category: Category;
    initialBlogs: BlogPost[];
    categorySlug: string;
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({
    category,
    initialBlogs,
    categorySlug,
}) => {
    const router = useRouter();

    const handleNavigate = (id: number) => {
        router.push(`/blog/${id}`);
    };

    const handleTagClick = (tag: string) => {
        router.push(`/blog/tag?tag=${tag}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.categoryHeader}>
                <div className={styles.categoryHeaderContent}>
                    <h1 className={styles.categoryTitle}>{category.name}</h1>

                    {category.description && (
                        <p className={styles.categoryDescription}>{category.description}</p>
                    )}

                    <div className={styles.categoryMeta}>
                        <span className={styles.postCount}>
                            {toPersianNumber(initialBlogs.length)} مقاله در این دسته‌بندی
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

            {initialBlogs.length > 0 ? (
                <div className={styles.blogsGrid}>
                    {initialBlogs.map((blog) => (
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
    );
};

export default CategoryPageClient;
