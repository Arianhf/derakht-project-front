import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BlogPage.module.scss";
import { blogService } from '../services/blogService';
import { Button } from './shared/Button';
import { Loading } from './shared/Loading';
import { ErrorMessage } from './shared/ErrorMessage';
import { BlogPost } from '../types';
import { UI_CONSTANTS } from '../constants';
import {toPersianNumber} from "../utils/convertToPersianNumber.ts";

interface FeaturedBlogProps {
  blog: BlogPost;
  onNavigate: (id: number) => void;
}

const FeaturedBlogCard: React.FC<FeaturedBlogProps> = ({ blog, onNavigate }) => (
    <div
        className={styles.featuredBlog}
        onClick={() => onNavigate(blog.id)}
        style={{ cursor: "pointer" }}
    >
      <div>
        <h2 className={styles.featuredTitle}>{blog.title}</h2>
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
        <img
            src={blog.header_image?.meta?.download_url || "default-image.jpg"}
            alt={blog.header_image?.title}
            className={styles.featuredImage}
        />
      </div>
    </div>
);

interface RegularBlogCardProps {
  blog: BlogPost;
  onNavigate: (id: number) => void;
}

const RegularBlogCard: React.FC<RegularBlogCardProps> = ({ blog, onNavigate }) => (
    <div
        className={styles.blogCard}
        onClick={() => onNavigate(blog.id)}
        style={{ cursor: "pointer" }}
    >
      <img
          src={blog.header_image?.meta?.download_url || "default-image.jpg"}
          alt={blog.title}
          className={styles.blogCardImage}
      />
      <div className={styles.blogContent}>
        <h3 className={styles.blogTitle}>{blog.title}</h3>
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
  const navigate = useNavigate();

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
    navigate(`/blog/${id}`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (blogs.length === 0) return <p className={styles.noBlogs}>هیچ مقاله‌ای یافت نشد.</p>;

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
                    />
                ))}
              </div>
            </section>
        )}

        {/* Regular Blogs */}
        <section className={styles.latestBlogs}>
          <h2 className={styles.sectionTitle}>آخرین مقاله‌ها</h2>
          <div className={styles.latestBlogsGrid}>
            {blogs.map((blog) => (
                <RegularBlogCard
                    key={blog.id}
                    blog={blog}
                    onNavigate={handleNavigate}
                />
            ))}
          </div>
        </section>
      </div>
  );
};

export default BlogPostList;