import React from "react";
import BlogCard from "../components/BlogCard";
import childIllustration from "../assets/images/blogimage1.jpg";

// Mock blog data
const mockBlogs = [
  { id: 1, title: "ماجراجویی در جنگل جادویی", category: "Top Blog", isFeatured: true, author: "آریل ون هوتن", time: "۴ دقیقه", image: childIllustration },
  { id: 2, title: "رباتی که می‌خواست برقصد", category: "Top Blog", author: "صبا ناصر", time: "۱۰ دقیقه", image: childIllustration },
  { id: 3, title: "شاهزاده و اژدها", category: "Top Blog", author: "آرین هدایتی فر", time: "۵ دقیقه", image: childIllustration },
  { id: 4, title: "باغ مخفی", category: "Top Blog", author: "صبا ناصر", time: "۱۵ دقیقه", image: childIllustration },
  { id: 5, title: "هیولای دوست‌داشتنی", category: "Latest Blog", author: "بهزاد", time: "۹ دقیقه", image: childIllustration },
];

const BlogPage: React.FC = () => {
  const featuredBlog = mockBlogs.find((blog) => blog.isFeatured);
  const topBlogs = mockBlogs.filter((blog) => blog.category === "Top Blog" && !blog.isFeatured);
  const latestBlogs = mockBlogs.filter((blog) => blog.category === "Latest Blog");

  return (
    <div
      style={{
        fontFamily: "'Yekan', sans-serif",
        direction: "rtl",
        textAlign: "right",
        margin: "0 auto",
        maxWidth: "1500px",
        padding: "20px",
      }}
    >
      {/* Featured Blog Section */}
      {featuredBlog && (
        <BlogCard
          id={featuredBlog.id}
          title={featuredBlog.title}
          author={featuredBlog.author}
          time={featuredBlog.time}
          image={featuredBlog.image}
          layout="featured"
        />
      )}

      {/* Top Blogs Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>داستان‌های برتر</h2>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          {/* Left Large Blog */}
          {topBlogs.length > 0 && (
            <BlogCard
              id={topBlogs[0].id}
              title={topBlogs[0].title}
              author={topBlogs[0].author}
              time={topBlogs[0].time}
              image={topBlogs[0].image}
              layout="large"
            />
          )}

          {/* Right Small Blogs */}
          <div style={{ display: "grid", gap: "20px" }}>
            {topBlogs.slice(1).map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                author={blog.author}
                time={blog.time}
                image={blog.image}
                layout="small"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>آخرین داستان‌ها</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {latestBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              author={blog.author}
              time={blog.time}
              image={blog.image}
              layout="small"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
