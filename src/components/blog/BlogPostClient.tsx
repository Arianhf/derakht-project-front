// src/components/blog/BlogPostClient.tsx
'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { FaUserCircle, FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';
import styles from "./BlogPage.module.scss";
import { BlogPost } from '@/types';
import { formatJalaliDate, toPersianNumber } from "@/utils/convertToPersianNumber";
import HeroCarousel from "./HeroCarousel";
import CategoriesSection from "./CategoriesSection";

// Updated TagList component with onTagClick handler
interface TagListProps {
  tags: string[];
  onTagClick: (tag: string) => void;
  className?: string;
  tagClassName?: string;
}

const TagList: React.FC<TagListProps> = ({ tags, onTagClick, className, tagClassName }) => {
  if (!tags || tags.length === 0) return null;

  return (
      <div className={className || styles.tagContainer}>
        {tags.map((tag) => (
            <span
                key={tag}
                className={tagClassName || styles.tag}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling up
                  onTagClick(tag);
                }}
            >
              {tag}
            </span>
        ))}
      </div>
  );
};

// Featured Blog Card component
interface FeaturedBlogProps {
  blog: BlogPost;
  onNavigate: (id: number) => void;
  onTagClick: (tag: string) => void;
}

const FeaturedBlogCard: React.FC<FeaturedBlogProps> = ({ blog, onNavigate, onTagClick }) => (
    <div
        className={styles.featuredBlog}
        onClick={() => onNavigate(blog.id)}
        style={{ cursor: "pointer" }}
    >
      <div className={styles.featuredContent}>
        <div className={styles.featuredTitle}>
          {blog.featured && <FaStar className={styles.featuredIcon} />}
          <h2>{blog.title}</h2>
        </div>
        {blog.subtitle && (
            <p className={styles.featuredSubtitle}>{blog.subtitle}</p>
        )}
        {blog.tags && blog.tags.length > 0 && (
            <TagList
                tags={blog.tags}
                onTagClick={onTagClick}
                className={styles.featuredTagContainer}
                tagClassName={styles.featuredTag}
            />
        )}
        {blog.intro && (
            <p className={styles.featuredIntro}>{blog.intro}</p>
        )}
        <div className={styles.authorInfo}>
          <div className={styles.authorDetails}>
            <div className={styles.authorName}>
              <FaUserCircle style={{marginLeft: '5px'}}/>
              نویسنده: {blog.owner?.first_name}
            </div>
            <div className={styles.blogMeta}>
              <span className={styles.blogMetaDetail}>
                <FaCalendarAlt style={{marginLeft: '5px'}}/>
                نوشته شده در {formatJalaliDate(blog.jalali_date || "")}
              </span>
              {blog.reading_time && (
                  <span className={styles.blogMetaDetail}>
                    <FaClock style={{marginLeft: '5px'}}/>
                    {toPersianNumber(blog.reading_time)} دقیقه مطالعه
                  </span>
              )}
            </div>
          </div>
        </div>
        <button
            className={styles.featuredButton}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(blog.id);
            }}
        >
          مطالعه مقاله
        </button>
      </div>
      <div className={styles.featuredImageContainer}>
        <Image
            src={blog.header_image?.meta?.download_url || "/default-image.jpg"}
            alt={blog.header_image?.title || blog.title || "Featured Blog Image"}
            className={styles.featuredImage}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
);

interface RegularBlogCardProps {
  blog: BlogPost;
  onNavigate: (id: number) => void;
  onTagClick: (tag: string) => void;
}

const RegularBlogCard: React.FC<RegularBlogCardProps> = ({blog, onNavigate, onTagClick}) => (
    <div
        className={styles.blogCard}
        onClick={() => onNavigate(blog.id)}
        style={{cursor: "pointer"}}
    >
      <div className={styles.blogCardImageContainer}>
        <Image
            src={blog.header_image?.meta?.download_url || "/default-image.jpg"}
            alt={blog.title || "Blog Image"}
            className={styles.blogCardImage}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {blog.featured && (
            <span className={styles.cardFeaturedBadge}>
            <FaStar />
          </span>
        )}
      </div>
      <div className={styles.blogCardContent}>
        <h3 className={styles.blogCardTitle}>{blog.title}</h3>
        {blog.subtitle && (
            <p className={styles.blogCardSubtitle}>{blog.subtitle}</p>
        )}
        {blog.tags && blog.tags.length > 0 && (
            <TagList
                tags={blog.tags}
                onTagClick={onTagClick}
                className={styles.blogCardTagContainer}
                tagClassName={styles.blogCardTag}
            />
        )}
        {blog.intro && (
            <p className={styles.blogCardIntro}>{blog.intro}</p>
        )}
        <div className={styles.authorInfo}>
          <div className={styles.authorDetails}>
            <div className={styles.authorName}>
              <FaUserCircle style={{marginLeft: '5px' }}/>
              نویسنده: {blog.owner?.first_name}
            </div>
            <div className={styles.blogMeta}>
              <span className={styles.blogMetaDetail}>
                <FaCalendarAlt style={{marginLeft: '5px'}}/>
                نوشته شده در {formatJalaliDate(blog.jalali_date || "")}
              </span>
              {blog.reading_time && (
                  <span className={styles.blogMetaDetail}>
                    <FaClock style={{marginLeft: '5px'}}/>
                    {toPersianNumber(blog.reading_time)} دقیقه مطالعه
                  </span>
              )}
            </div>
          </div>
        </div>
        <button
            className={styles.readButton}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(blog.id);
            }}
        >
          مطالعه
        </button>
      </div>
    </div>
);

// Props interface for the client component
interface BlogPostClientProps {
  blogs: BlogPost[];
  featuredBlogs: BlogPost[];
  heroPosts: BlogPost[];
}

// Main BlogPostClient component - receives data as props
const BlogPostClient: React.FC<BlogPostClientProps> = ({ blogs, featuredBlogs, heroPosts }) => {
  const router = useRouter();

  const handleNavigate = (id: number) => {
    router.push(`/blog/${id}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/blog/tag?tag=${tag}`);
  };

  // If there are no blog posts of any kind, show empty state
  if (blogs.length === 0 && featuredBlogs.length === 0 && heroPosts.length === 0) {
    return <p className={styles.noBlogs}>هیچ مقاله‌ای یافت نشد.</p>;
  }

  return (
      <div className={styles.blogPageContainer}>
        <div className={styles.contentWrapper}>
          {/* Hero Carousel - renders multiple hero posts */}
          {heroPosts.length > 0 && (
              <HeroCarousel
                  heroPosts={heroPosts}
                  onTagClick={handleTagClick}
              />
          )}

          {/* Categories Section */}
          <CategoriesSection />

          {/* Featured Blogs Section */}
          {featuredBlogs.length > 0 && (
              <section className={styles.featuredSection}>
                <h2 className={styles.sectionTitle}>مقالات ویژه</h2>
                <div className={styles.featuredGrid}>
                  {featuredBlogs.map((blog) => (
                      <FeaturedBlogCard
                          key={blog.id}
                          blog={blog}
                          onNavigate={handleNavigate}
                          onTagClick={handleTagClick}
                      />
                  ))}
                </div>
              </section>
          )}

          {/* Regular Blogs */}
          {blogs.length > 0 && (
              <section className={styles.latestBlogs}>
                <h2 className={styles.sectionTitle}>آخرین مقاله‌ها</h2>
                <div className={styles.latestBlogsGrid}>
                  {blogs.map((blog) => (
                      <RegularBlogCard
                          key={blog.id}
                          blog={blog}
                          onNavigate={handleNavigate}
                          onTagClick={handleTagClick}
                      />
                  ))}
                </div>
              </section>
          )}
        </div>
      </div>
  );
};

export default BlogPostClient;
