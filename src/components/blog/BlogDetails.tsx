'use client';

import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCalendarAlt, FaUserCircle, FaClock, FaComment, FaStar } from 'react-icons/fa';
import styles from './BlogDetails.module.scss';
import RelatedPosts from './RelatedPosts';
import { RelatedPost } from '@/services/blogService';
import TableOfContents from './TableOfContents';
import {toPersianNumber} from "@/utils/convertToPersianNumber";

interface BlogDetailsProps {
    blog: {
        title: string;
        subtitle?: string;
        intro?: string;
        author: {
            first_name: string;
        };
        jalali_date?: string;
        reading_time?: number;
        content: string;
        tags?: string[];
        header_image?: {
            meta?: {
                download_url: string;
            };
            title?: string;
        };
        featured?: boolean;
        hero?: boolean;
    };
    relatedPosts?: RelatedPost[];
    logo: StaticImageData | string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ blog, relatedPosts = [], logo }) => {
    const router = useRouter();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Array<{id: string; author: string; date: string; text: string}>>([]);
    const [processedContent, setProcessedContent] = useState(blog.content);

    // Function to process the blog content
    useEffect(() => {
        const processContent = (content: string) => {
            // Create a DOM parser to work with the HTML
            if (typeof window !== 'undefined') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');

                // Add IDs to headings for the table of contents
                const headings = doc.querySelectorAll('h1, h2, h3, h4');
                headings.forEach((heading, index) => {
                    // Skip the main title (usually the first h1)
                    if (heading.tagName === 'H1' && index === 0) return;

                    // Generate a unique ID for this heading if it doesn't have one
                    if (!heading.id) {
                        const headingText = heading.textContent || `heading-${index}`;
                        heading.id = headingText
                            .toLowerCase()
                            .replace(/[^\w\s]/g, '')  // Remove special characters
                            .replace(/\s+/g, '-');    // Replace spaces with hyphens
                    }
                });

                // Function to check if an element is a right or left aligned image
                const isFloatedImage = (element: Element) => {
                    if (element.tagName === 'IMG') {
                        const classNames = element.className.split(' ');
                        return classNames.includes('right') || classNames.includes('left');
                    }
                    return false;
                };

                // Find consecutive floated images with no substantial content between them
                const paragraphs = doc.querySelectorAll('p');

                for (let i = 0; i < paragraphs.length; i++) {
                    const paragraph = paragraphs[i];
                    const images = paragraph.querySelectorAll('img');

                    // If this paragraph contains a floated image
                    if (images.length > 0 && isFloatedImage(images[0])) {
                        // Check if the next paragraph also starts with a floated image
                        if (i < paragraphs.length - 1) {
                            const nextParagraph = paragraphs[i + 1];
                            const nextImages = nextParagraph.querySelectorAll('img');

                            if (nextImages.length > 0 && isFloatedImage(nextImages[0])) {
                                // There's a floated image in the next paragraph
                                // Check if there's enough text content in this paragraph
                                const textContent = paragraph.textContent?.trim() || '';

                                // If there's not enough text to provide spacing
                                if (textContent.length < 100) {
                                    // Insert a break-float div to clear the floats
                                    const breakDiv = document.createElement('div');
                                    breakDiv.className = 'break-float';
                                    paragraph.appendChild(breakDiv);
                                }
                            }
                        }
                    }
                }

                return doc.body.innerHTML;
            }

            return content;
        };

        setProcessedContent(processContent(blog.content));
    }, [blog.content]);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            const newComment = {
                id: `${Date.now()}-${Math.random()}`,
                author: 'کاربر',
                date: new Date().toLocaleDateString('fa-IR'),
                text: comment
            };
            setComments([...comments, newComment]);
            setComment('');
        }
    };

    return (
        <div className={styles.blogContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.backButtonContainer}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/blog')}
                    >
                        <FaArrowRight /> بازگشت به صفحه بلاگ
                    </button>
                </div>

                <article className={styles.blogArticle}>
                    <header className={styles.blogHeader}>
                        {/* Added featured badge */}
                        {blog.featured && (
                            <div className={styles.featuredBadge}>
                                <FaStar /> مقاله ویژه
                            </div>
                        )}

                        <h1 className={styles.blogTitle}>{blog.title}</h1>

                        {/* Added subtitle */}
                        {blog.subtitle && (
                            <h2 className={styles.blogSubtitle}>{blog.subtitle}</h2>
                        )}

                        <div className={styles.blogMeta}>
                            {blog.author && (
                                <div className={styles.metaItem}>
                                    <FaUserCircle size={18} />
                                    <span className={styles.author}>{blog.author.first_name || 'نویسنده'}</span>
                                </div>
                            )}
                            {blog.jalali_date && (
                                <div className={styles.metaItem}>
                                    <FaCalendarAlt size={16} />
                                    <span>{toPersianNumber(blog.jalali_date)}</span>
                                </div>
                            )}
                            {blog.reading_time && (
                                <div className={styles.metaItem}>
                                    <FaClock size={16} />
                                    <span>{toPersianNumber(blog.reading_time)} دقیقه مطالعه</span>
                                </div>
                            )}
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className={styles.tagContainer}>
                                {blog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={styles.tag}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/blog/tag?tag=${tag}`);
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {blog.header_image && (
                        <div className={styles.headerImageContainer}>
                            <Image
                                src={blog.header_image.meta?.download_url || '/default-image.jpg'}
                                alt={blog.header_image.title || blog.title}
                                fill
                                className={styles.headerImage}
                                priority
                            />
                        </div>
                    )}

                    {/* Added intro section */}
                    {blog.intro && (
                        <div className={styles.blogIntro}>
                            <p>{blog.intro}</p>
                        </div>
                    )}

                    {/* Table of Contents - Added here */}
                    <TableOfContents content={processedContent} />

                    <div className={styles.blogContent}>
                        {/* We use the processedContent now */}
                        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                    </div>
                </article>

                {/* Comments Section */}
                <section className={styles.commentsSection}>
                    <h2 className={styles.commentsTitle}>
                        <FaComment style={{ marginLeft: '8px' }} />
                        نظرات
                    </h2>

                    {comments.length > 0 ? (
                        <div className={styles.commentsList}>
                            {comments.map((cmt) => (
                                <div key={cmt.id} className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.commentAuthor}>{cmt.author}</span>
                                        <span className={styles.commentDate}>{cmt.date}</span>
                                    </div>
                                    <p className={styles.commentText}>{cmt.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noComments}>هنوز نظری برای این مقاله ثبت نشده است. اولین نفری باشید که نظر می‌دهد!</div>
                    )}

                    <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                        <textarea
                            className={styles.commentInput}
                            placeholder="نظر خود را بنویسید..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit" className={styles.submitButton}>ارسال نظر</button>
                    </form>
                </section>

                {relatedPosts.length > 0 && (
                    <RelatedPosts posts={relatedPosts} />
                )}
            </div>
        </div>
    );
};

export default BlogDetails;