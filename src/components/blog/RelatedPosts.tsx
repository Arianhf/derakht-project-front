// src/components/blog/RelatedPosts.tsx
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaLink } from 'react-icons/fa';
import { RelatedPost } from '@/services/blogService';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import styles from './RelatedPosts.module.scss';


interface RelatedPostsProps {
    posts: RelatedPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
    const router = useRouter();

    if (!posts || posts.length === 0) {
        return null;
    }

    const handlePostClick = (id: number) => {
        router.push(`/blog/${id}`);
    };

    return (
        <div className={styles.relatedPosts}>
            <h2 className={styles.relatedTitle}>مقالات مرتبط</h2>
            <div className={styles.relatedGrid}>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={styles.relatedCard}
                        onClick={() => handlePostClick(post.id)}
                    >
                        <div className={styles.relatedImageContainer}>
                            <Image
                                src={post.header_image || "/default-image.jpg"}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className={styles.relatedImage}
                            />
                            {post.relationship_type === 'explicit' && (
                                <div className={styles.relationshipBadge}>
                                    <FaLink /> مرتبط
                                </div>
                            )}
                        </div>
                        <div className={styles.relatedContent}>
                            <h3 className={styles.relatedCardTitle}>{post.title}</h3>
                            <div className={styles.relatedMeta}>
                                <span className={styles.metaItem}>
                                    <FaCalendarAlt size={14} />
                                    {post.jalali_date ? toPersianNumber(post.jalali_date) : toPersianNumber(post.date)}
                                </span>
                                {post.reading_time && (
                                    <span className={styles.metaItem}>
                                        <FaClock size={14} />
                                        {toPersianNumber(post.reading_time)} دقیقه مطالعه
                                    </span>
                                )}
                            </div>
                            {post.intro && (
                                <p className={styles.relatedIntro}>{post.intro}</p>
                            )}
                            <button
                                className={styles.relatedButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePostClick(post.id);
                                }}
                            >
                                مطالعه
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;