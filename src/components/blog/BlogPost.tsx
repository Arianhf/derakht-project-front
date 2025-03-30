import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./BlogPage.module.scss";
import { blogService } from '@/services/blogService';
import { Button } from '../shared/Button';
import { Loading } from '../shared/Loading';
import { ErrorMessage } from '../shared/ErrorMessage';
import { BlogPost } from '@/types';
import { UI_CONSTANTS } from '@/constants';
import { toPersianNumber } from "@/utils/convertToPersianNumber";
import Image from 'next/image';

// Updated TagList component with onTagClick handler
interface TagListProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, onTagClick }) => {
  if (!tags || tags.length === 0) return null;

  return (
      <div className={styles.tagContainer}>
        {tags.map((tag, index) => (
            <span
                key={index}
                className={styles.tag}
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
      <div>
        <h2 className={styles.featuredTitle}>{blog.title}</h2>
        {/* Add tags to featured blog card with tag click handler */}
        {blog.tags && blog.tags.length > 0 && (
              <TagList tags={blog.tags} onTagClick={onTagClick} />
        )}
        <p className={styles.blogMeta}>
          نوشته شده توسط{" "}
          <span className={styles.authorName}>
          {blog.owner?.first_name}
        </span>{" "}
          · {toPersianNumber(blog.jalali_date || "تاریخ نامشخص")}
        </p>
        <Button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(blog.id);
            }}
        >
          مطالعه
        </Button>
      </div>
      <div>
        <Image
            src={blog.header_image?.meta?.download_url || "/default-image.jpg"}
            alt={blog.header_image?.title || "Featured Blog Image"}
            className={styles.featuredImage}
            width={600}
            height={400}
            layout="responsive"
        />
      </div>
    </div>
);

interface RegularBlogCardProps {
  blog: BlogPost;
  onNavigate: (id: number) => void;
  onTagClick: (tag: string) => void;
}

const RegularBlogCard: React.FC<RegularBlogCardProps> = ({ blog, onNavigate, onTagClick }) => (
    <div
        className={styles.blogCard}
        onClick={() => onNavigate(blog.id)}
        style={{ cursor: "pointer" }}
    >
      <Image
          src={blog.header_image?.meta?.download_url || "/default-image.jpg"}
          alt={blog.title || "Blog Image"}
          className={styles.blogCardImage}
          width={300}
          height={200}
          layout="responsive"
      />
      <div className={styles.blogContent}>
        <h3 className={styles.blogTitle}>{blog.title}</h3>
        {/* Add tags to regular blog card with tag click handler */}
        {blog.tags && blog.tags.length > 0 && (
            <TagList tags={blog.tags} onTagClick={onTagClick} />
        )}
        <p className={styles.blogMeta}>
          نوشته شده توسط{" "}
          <span className={styles.authorName}>
          {blog.owner?.first_name}
        </span>{" "}
          · {toPersianNumber(blog.jalali_date || "تاریخ نامشخص")}
        </p>
        <Button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(blog.id);
            }}
        >
          مطالعه
        </Button>
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
      <div className={styles.blogContainer}>
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
  );
};

export default BlogPostList;