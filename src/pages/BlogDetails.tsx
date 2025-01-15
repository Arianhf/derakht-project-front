import { useParams, useNavigate } from "react-router-dom";
import { mockBlogs } from "../data/mockBlogs"; // Replace with your real data source
import { FaArrowLeft } from "react-icons/fa";

const BlogDetails = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const navigate = useNavigate();
  const blog = id ? mockBlogs.find((b) => b.id === parseInt(id)) : null; // Find the blog by ID

  if (!blog) {
    return <p>مقاله یافت نشد!</p>;
  }

  return (
    <div
      style={{
        fontFamily: "Yekan, sans-serif",
        direction: "rtl",
        textAlign: "right",
        margin: "0 auto",
        maxWidth: "1200px",
        padding: "20px",
      }}
    >
      {/* Back Button */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#ff6f61",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e55a50";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ff6f61";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          بازگشت
          <FaArrowLeft size={18} />
        </button>
      </div>

      {/* Blog Content */}
      <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#ff6f61" }}>
        {blog.title}
      </h1>
      <p style={{ fontSize: "14px", color: "#777" }}>
        نوشته شده توسط {blog.author} · {blog.publishedDate} · {blog.time}
      </p>
      <img
        src={blog.image}
        alt={blog.title}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "10px",
          margin: "20px 0",
        }}
      />
      {/* Rich Text Content */}
      <div
        style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}
        dangerouslySetInnerHTML={{ __html: blog.content }} // Render rich text content
      />
    </div>
  );
};

export default BlogDetails;
