import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { FaUserCircle, FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';
import styles from "./BlogPage.module.scss";
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import { UI_CONSTANTS } from '@/constants';
import { formatJalaliDate, toPersianNumber } from "@/utils/convertToPersianNumber";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";

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
        {tags.map((tag, index) => (
            <span
                key={index}
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

// Enhanced Hero Post component with subtitle and intro
interface HeroPostProps {
  blog: BlogPost;
  onNavigate: (id: number) => void;
  onTagClick: (tag: string) => void;
}

const HeroPostCard: React.FC<HeroPostProps> = ({ blog, onNavigate, onTagClick }) => (
    <div
        className={styles.heroSection}
        onClick={() => onNavigate(blog.id)}
        style={{ cursor: 'pointer' }}
    >
      <Image
          src={blog.header_image?.meta?.download_url || "/default-image.jpg"}
          alt={blog.header_image?.title || blog.title}
          className={styles.headerImage}
          fill
          priority
          sizes="100vw"
      />
      <div className={styles.imageOverlay}></div>
      <div className={styles.overlay}>
        <div className={styles.heroContent}>
          {blog.tags && blog.tags.length > 0 && (
              <div className={styles.headerTags}>
                {blog.tags.map((tag, index) => (
                    <span
                        key={index}
                        className={styles.tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTagClick(tag);
                        }}
                    >
                    {tag}
                  </span>
                ))}
              </div>
          )}
          <h1 className={styles.headerTitle}>{blog.title}</h1>
          {blog.subtitle && (
              <p className={styles.headerSubtitle}>{blog.subtitle}</p>
          )}
          {blog.intro && (
              <p className={styles.headerIntro}>{blog.intro}</p>
          )}
          <div className={styles.authorInfo}>
            <FaUserCircle className={styles.authorIcon} />
            <div className={styles.authorDetails}>
              <div className={styles.authorName}>
                نویسنده: {blog.owner?.first_name}
              </div>
              <div className={styles.authorMeta}>
                <span>
                  <FaCalendarAlt style={{ marginLeft: '5px' }} />
                  نوشته شده در {formatJalaliDate(blog.jalali_date || "")}
                </span>
                {blog.reading_time && (
                    <span>
                      <FaClock style={{ marginLeft: '5px' }} />
                      {toPersianNumber(blog.reading_time)} دقیقه مطالعه
                    </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);

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

const BlogPostList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [heroPost, setHeroPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [regularPosts, featuredPosts] = await Promise.all([
          blogService.getAllPosts(),
          blogService.getFeaturedPosts()
        ]);

        setBlogs(regularPosts.items);

        // Filter featured posts that are not hero posts
        const featured = featuredPosts.items.filter(post => post.featured && !post.hero);
        setFeaturedBlogs(featured);

        // Find the hero post
        const hero = featuredPosts.items.find(post => post.hero);
        if (hero) {
          setHeroPost(hero);
        } else if (featured.length > 0) {
          setHeroPost(featured[0]);
          setFeaturedBlogs(featured.slice(1));
        }
      } catch (err) {
        console.error(err);
        setError(UI_CONSTANTS.ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleNavigate = (id: number) => {
    router.push(`/blog/${id}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/blog/tag?tag=${tag}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if ((blogs.length === 0) && (featuredBlogs.length === 0) && !heroPost) {
    return <p className={styles.noBlogs}>هیچ مقاله‌ای یافت نشد.</p>;
  }

  return (
      <div className={styles.blogPageContainer}>
        <div className={styles.contentWrapper}>
          {/* Hero Post */}
          {heroPost && (
              <HeroPostCard
                  blog={heroPost}
                  onNavigate={handleNavigate}
                  onTagClick={handleTagClick}
              />
          )}

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

export default BlogPostList;