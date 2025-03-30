import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import { UI_CONSTANTS } from '@/constants';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { FaArrowRight } from 'react-icons/fa';
import styles from './TagPage.module.scss';
import logoImage from '@/assets/images/logo2.png';

const TagPage: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tag = searchParams.get('tag');

    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tag) {
            router.push('/blog');
            return;
        }

        const fetchBlogsByTag = async () => {
            try {
                setLoading(true);
                const response = await blogService.getPostsByTag(tag);
                setBlogs(response.items);
            } catch (err) {
                console.error(err);
                setError(UI_CONSTANTS.ERROR_MESSAGE);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogsByTag();
    }, [tag, router]);

    const handleNavigate = (id: number) => {
        router.push(`/blog/${id}`);
    };

    const handleTagClick = (clickedTag: string) => {
        if (clickedTag !== tag) {
            router.push(`/blog/tag?tag=${clickedTag}`);
        }
    };

    if (!tag) return null;

    return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logoImage} />

            <div className={styles.tagPageContainer}>
                <div className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.tagTitle}>
                            مقالات با برچسب <span className={styles.highlightTag}>{tag}</span>
                        </h1>
                        <p className={styles.tagDescription}>
                            تمام مطالبی که برچسب {tag} دارند در این صفحه نمایش داده می‌شوند
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <>
                        <div className={styles.controlsBar}>
                            <div className={styles.resultsInfo}>
                                <span>تعداد مقالات یافت شده: </span>
                                <span className={styles.resultsCount}>{toPersianNumber(blogs.length)}</span>
                            </div>
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
                                                    {blog.tags.map((blogTag, index) => (
                                                        <span
                                                            key={index}
                                                            className={`${styles.tag} ${blogTag === tag ? styles.activeTag : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTagClick(blogTag);
                                                            }}
                                                        >
                              {blogTag}
                            </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className={styles.blogMeta}>
                                                نوشته شده توسط{" "}
                                                <span className={styles.authorName}>
                          {blog.owner?.first_name}
                        </span>{" "}
                                                · {toPersianNumber(blog.jalali_date || "تاریخ نامشخص")}
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
                                <p className={styles.emptyMessage}>مقاله‌ای با این برچسب یافت نشد.</p>
                                <button
                                    className={styles.backButton}
                                    onClick={() => router.push('/blog')}
                                >
                                    بازگشت به همه مقالات
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TagPage;