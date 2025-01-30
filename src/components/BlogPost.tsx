import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import styles from "./BlogPage.module.scss";
import axios from "axios";

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // React Router hook for navigation

  const API_URL = import.meta.env.VITE_BASE_URL + "v2/posts/";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(API_URL);
        setBlogs(response.data.items);
      } catch (err) {
        setError("مشکلی در دریافت مقالات رخ داده است.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [API_URL]);

  if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  if (blogs.length === 0) {
    return <p className={styles.noBlogs}>هیچ مقاله‌ای یافت نشد.</p>;
  }

  return (
    <div className={styles.blogContainer}>
      {/* Featured Blog Section */}
      {blogs.length > 0 && (
        <section className={styles.featuredBlog}>
          <div>
            <h2 className={styles.featuredTitle}>{blogs[0].title}</h2>
            <p className={styles.blogMeta}>
              نوشته شده توسط <span className={styles.authorName}>درخت</span> · {blogs[0].jalali_date || "تاریخ نامشخص"}
            </p>
            <button 
              className={styles.readButton} 
              onClick={() => navigate(`/blog/${blogs[0].id}`)} // Navigate to BlogDetails
            >
              مطالعه
            </button>
          </div>
          <div>
            <img 
              src={blogs[0]?.schema_markup?.image?.url || "default-image.jpg"} 
              alt={blogs[0].title} 
              className={styles.featuredImage} 
              onClick={() => navigate(`/blog/${blogs[0].id}`)} // Clickable image
              style={{ cursor: "pointer" }}
            />
          </div>
        </section>
      )}

      {/* Other Blogs */}
      <section className={styles.latestBlogs}>
        <h2 className={styles.sectionTitle}>آخرین داستان‌ها</h2>
        <div className={styles.latestBlogsGrid}>
          {blogs.slice(1).map((blog) => (
            <div 
              key={blog.id} 
              className={styles.blogCard} 
              onClick={() => navigate(`/blog/${blog.id}`)} // Clickable blog card
              style={{ cursor: "pointer" }}
            >
              <img 
                src={blog.schema_markup?.image?.url || "default-image.jpg"} 
                alt={blog.title} 
                className={styles.blogCardImage} 
              />
              <div className={styles.blogContent}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                <p className={styles.blogMeta}>{blog.jalali_date || "تاریخ نامشخص"}</p>
                <button 
                  className={styles.readButton} 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card click
                    navigate(`/blog/${blog.id}`);
                  }}
                >
                  مطالعه
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
