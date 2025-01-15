import React from "react";
import childIllustration from "../assets/images/blogimage1.jpg"; // Replace with a kid-friendly image
import "./BlogPage.css"; // Add a CSS file for animations and styles

// Mock blog data
const mockBlogs = [
  { id: 1, title: "ماجراجویی در جنگل جادویی", category: "Top Blog", isFeatured: true, author: "آریل ون هوتن", time: "۴ دقیقه" },
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
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "40px",
            backgroundColor: "#fff",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "15px",
                color: "#ff6f61",
              }}
            >
              {featuredBlog.title}
            </h2>
            <p style={{ fontSize: "18px", color: "#555", marginBottom: "15px", lineHeight: "1.8" }}>
              همراه ما به یک سفر جادویی در دل جنگل بروید، جایی که همه چیز ممکن است!
            </p>
            <p style={{ fontSize: "14px", color: "#777" }}>
              نوشته شده توسط <span style={{ fontWeight: "bold", color: "#007BFF" }}>{featuredBlog.author}</span> · {featuredBlog.time}
            </p>
            <button
              style={{
                backgroundColor: "#ff6f61",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "20px",
              }}
            >
              مطالعه
            </button>
          </div>
          <div>
            <img
              src={childIllustration}
              alt={featuredBlog.title}
              style={{ width: "100%", height: "100%", borderRadius: "15px", objectFit: "cover" }}
            />
          </div>
        </section>
      )}

      {/* Top Blogs Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>داستان‌های برتر</h2>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          {/* Left Large Blog */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <img
              src={childIllustration}
              alt={topBlogs[0].title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <div style={{ padding: "15px" }}>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                {topBlogs[0].title}
              </h3>
              <p style={{ fontSize: "14px", color: "#777" }}>
                نوشته شده توسط <span style={{ fontWeight: "bold", color: "#007BFF" }}>{topBlogs[0].author}</span> · {topBlogs[0].time}
              </p>
            </div>
          </div>

          {/* Right Small Blogs */}
          <div style={{ display: "grid", gap: "20px" }}>
            {topBlogs.slice(1).map((blog) => (
              <div
                key={blog.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  padding: "10px",
                }}
              >
                <img
                  src={childIllustration}
                  alt={blog.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <h4 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px", color: "#333" }}>{blog.title}</h4>
                  <p style={{ fontSize: "12px", color: "#777" }}>{blog.time} · {blog.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>آخرین داستان‌ها</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {latestBlogs.map((blog) => (
            <div
              key={blog.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <img
                src={childIllustration}
                alt={blog.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "15px" }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    color: "#333",
                  }}
                >
                  {blog.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#777" }}>{blog.time} · {blog.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;