import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { FaUserCircle, FaCalendarAlt, FaClock } from 'react-icons/fa';
import styles from "./BlogPage.module.scss";
import { blogService } from '@/services/blogService';
import { Loading } from '../shared/Loading';
import { ErrorMessage } from '../shared/ErrorMessage';
import { BlogPost } from '@/types';
import { UI_CONSTANTS } from '@/constants';
import { formatJalaliDate, toPersianNumber } from "@/utils/convertToPersianNumber";

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
        <h2 className={styles.featuredTitle}>{blog.title}</h2>
        {blog.tags && blog.tags.length > 0 && (
            <TagList
                tags={blog.tags}
                onTagClick={onTagClick}
                className={styles.featuredTagContainer}
                tagClassName={styles.featuredTag}
            />
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
            alt={blog.header_image?.title || "Featured Blog Image"}
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
      </div>
      <div className={styles.blogCardContent}>
        <h3 className={styles.blogCardTitle}>{blog.title}</h3>
        {blog.tags && blog.tags.length > 0 && (
            <TagList tags={blog.tags} onTagClick={onTagClick} className={styles.blogCardTagContainer} tagClassName={styles.blogCardTag}/>
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
        setFeaturedBlogs(featuredPosts.items);
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

  // New function to handle tag clicks
  const handleTagClick = (tag: string) => {
    router.push(`/blog/tag?tag=${tag}`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if ((blogs.length === 0) && (featuredBlogs.length === 0)) return <p className={styles.noBlogs}>هیچ مقاله‌ای یافت نشد.</p>;

  return (
      <div className={styles.blogPageContainer}>
        <div className={styles.contentWrapper}>
          {/* Hero Post */}
          {featuredBlogs.length > 0 && (
              <div
                  className={styles.heroSection}
                  onClick={() => handleNavigate(featuredBlogs[0].id)}
                  style={{ cursor: "pointer" }}
              >
                <Image
                    src={featuredBlogs[0].header_image?.meta?.download_url || "/default-image.jpg"}
                    alt={featuredBlogs[0].title}
                    className={styles.headerImage}
                    fill
                    priority
                    sizes="100vw"
                />
                <div className={styles.imageOverlay}></div>
                <div className={styles.overlay}>
                  <div className={styles.heroContent}>
                    {featuredBlogs[0].tags && featuredBlogs[0].tags.length > 0 && (
                        <div className={styles.headerTags}>
                          {featuredBlogs[0].tags.map((tag, index) => (
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
                    <h1 className={styles.headerTitle}>{featuredBlogs[0].title}</h1>
                    {featuredBlogs[0].subtitle && (
                        <p className={styles.headerSubtitle}>{featuredBlogs[0].subtitle}</p>
                    )}
                    <div className={styles.authorInfo}>
                      <FaUserCircle className={styles.authorIcon} />
                      <div className={styles.authorDetails}>
                        <div className={styles.authorName}>
                          نویسنده: {featuredBlogs[0].owner?.first_name}
                        </div>
                        <div className={styles.authorMeta}>
                      <span>
                        <FaCalendarAlt style={{ marginLeft: '5px' }} />
                        نوشته شده در {formatJalaliDate(featuredBlogs[0].jalali_date || "")}
                      </span>
                          {featuredBlogs[0].reading_time && (
                              <span>
                          <FaClock style={{ marginLeft: '5px' }} />
                                {toPersianNumber(featuredBlogs[0].reading_time)} دقیقه مطالعه
                        </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Featured Blogs Section - Skip the first one as it's in the hero section */}
          {featuredBlogs.length > 1 && (
              <section className={styles.featuredSection}>
                <h2 className={styles.sectionTitle}>مقالات ویژه</h2>
                <div className={styles.featuredGrid}>
                  {featuredBlogs.slice(1).map((blog) => (
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