import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import styles from "./BlogPage.module.scss";
import axios from "axios";

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // React Router hook for navigation

  const API_URL = import.meta.env.VITE_BASE_URL + "v2/posts/";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [regularResponse, featuredResponse] = await Promise.all([
          axios.get(`${API_URL}`),
          axios.get(`${API_URL}featured/`)
        ]);

        setBlogs(regularResponse.data.items);
        setFeaturedBlogs(featuredResponse.data.items);
      } catch (err) {
        console.error(err);
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
        {/* Featured Blogs Section */}
        {featuredBlogs.length > 0 && (
            <section className={styles.featuredSection}>
              <h2 className={styles.sectionTitle}>مقالات ویژه</h2>
              <div className={styles.featuredGrid}>
                {featuredBlogs.map((blog) => (
                    <div
                        key={blog.id}
                        className={styles.featuredBlog}
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        style={{ cursor: "pointer" }}
                    >
                      <div>
                        <h2 className={styles.featuredTitle}>{blog.title}</h2>
                        <p className={styles.blogMeta}>
                          نوشته شده توسط <span className={styles.authorName}>{blog.owner.first_name}</span> · {blog.jalali_date || "تاریخ نامشخص"}
                        </p>
                        <button
                            className={styles.readButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/blog/${blog.id}`);
                            }}
                        >
                          مطالعه
                        </button>
                      </div>
                      <div>
                        <img
                            src={blog.header_image?.meta?.download_url || "default-image.jpg"}
                            alt={blog.header_image?.title}
                            className={styles.featuredImage}
                        />
                      </div>
                    </div>
                ))}
              </div>
            </section>
        )}

        {/* Regular Blogs */}
        <section className={styles.latestBlogs}>
          <h2 className={styles.sectionTitle}>آخرین داستان‌ها</h2>
          <div className={styles.latestBlogsGrid}>
            {blogs.map((blog) => (
                <div
                    key={blog.id}
                    className={styles.blogCard}
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    style={{ cursor: "pointer" }}
                >
                  <img
                      src={blog.schema_markup?.image?.url || "default-image.jpg"}
                      alt={blog.title}
                      className={styles.blogCardImage}
                  />
                  <div className={styles.blogContent}>
                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    <p className={styles.blogMeta}>
                      نوشته شده توسط <span
                        className={styles.authorName}>{blog.owner.first_name}</span> · {blog.jalali_date || "تاریخ نامشخص"}
                    </p>
                    <button
                        className={styles.readButton}
                        onClick={(e) => {
                          e.stopPropagation();
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
