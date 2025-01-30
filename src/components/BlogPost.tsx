import React from "react";
import childIllustration from "../assets/images/blogimage1.jpg"; // Replace with a kid-friendly image
import styles from "./BlogPage.module.scss"; // New CSS module for styles

// Mock blog data
const mockBlogs = [
  { id: 1, title: "ماجراجویی در جنگل جادویی", category: "Top Blog", isFeatured: true, author: "علی کلاته", time: "۴ دقیقه" },
  { id: 2, title: "رباتی که می‌خواست برقصد", category: "Top Blog", author: "صبا ناصر", time: "۱۰ دقیقه" },
  { id: 3, title: "شاهزاده و اژدها", category: "Top Blog", author: "آرین هدایتی فر", time: "۵ دقیقه" },
  { id: 4, title: "باغ مخفی", category: "Top Blog", author: "صبا ناصر", time: "۱۵ دقیقه" },
  { id: 5, title: "هیولای دوست‌داشتنی", category: "Latest Blog", author: "بهزاد", time: "۹ دقیقه" },
  { id: 6, title: "کاوشگر فضایی", category: "Latest Blog", author: "علی کلاته", time: "۶ دقیقه" },
  { id: 7, title: "حیوانات سخنگو", category: "Latest Blog", author: "آرین هدایتی فر", time: "۵ دقیقه" },
  { id: 8, title: "پل رنگین‌کمان", category: "Latest Blog", author: "علی کلاته", time: "۱۲ دقیقه" },
  { id: 9, title: "جستجوی گنج", category: "Latest Blog", author: "بهزاد", time: "۷ دقیقه" },
];

const BlogPage: React.FC = () => {
  const featuredBlog = mockBlogs.find((blog) => blog.isFeatured);
  const topBlogs = mockBlogs.filter((blog) => blog.category === "Top Blog" && !blog.isFeatured);
  const latestBlogs = mockBlogs.filter((blog) => blog.category === "Latest Blog");

  return (
    <div className={styles.blogContainer}>
      {/* Featured Blog Section */}
      {featuredBlog && (
        <section className={styles.featuredBlog}>
          <div>
            <h2 className={styles.featuredTitle}>{featuredBlog.title}</h2>
            <p className={styles.featuredText}>
              همراه ما به یک سفر جادویی در دل جنگل بروید، جایی که همه چیز ممکن است!
            </p>
            <p className={styles.blogMeta}>
              نوشته شده توسط <span className={styles.authorName}>{featuredBlog.author}</span> · {featuredBlog.time}
            </p>
            <button className={styles.readButton}>مطالعه</button>
          </div>
          <div>
            <img src={childIllustration} alt={featuredBlog.title} className={styles.featuredImage} />
          </div>
        </section>
      )}

      {/* Top Blogs Section */}
      <section className={styles.topBlogs}>
        <h2 className={styles.sectionTitle}>داستان‌های برتر</h2>
        <div className={styles.topBlogsGrid}>
          {/* Left Large Blog */}
          <div className={styles.largeBlog}>
            <img src={childIllustration} alt={topBlogs[0].title} className={styles.largeBlogImage} />
            <div className={styles.blogContent}>
              <h3 className={styles.blogTitle}>{topBlogs[0].title}</h3>
              <p className={styles.blogMeta}>
                نوشته شده توسط <span className={styles.authorName}>{topBlogs[0].author}</span> · {topBlogs[0].time}
              </p>
            </div>
          </div>

          {/* Right Small Blogs */}
          <div className={styles.smallBlogs}>
            {topBlogs.slice(1).map((blog) => (
              <div key={blog.id} className={styles.smallBlog}>
                <img src={childIllustration} alt={blog.title} className={styles.smallBlogImage} />
                <div>
                  <h4 className={styles.blogTitle}>{blog.title}</h4>
                  <p className={styles.blogMeta}>{blog.time} · {blog.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className={styles.latestBlogs}>
        <h2 className={styles.sectionTitle}>آخرین داستان‌ها</h2>
        <div className={styles.latestBlogsGrid}>
          {latestBlogs.map((blog) => (
            <div key={blog.id} className={styles.blogCard}>
              <img src={childIllustration} alt={blog.title} className={styles.blogCardImage} />
              <div className={styles.blogContent}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                <p className={styles.blogMeta}>{blog.time} · {blog.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
