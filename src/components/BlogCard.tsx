import React from "react";
import { useNavigate } from "react-router-dom";

interface BlogCardProps {
  id: number;
  title: string;
  category: string;
  isFeatured?: boolean;
  author: string;
  time: string;
  image: string;
  layout?: "featured" | "large" | "small";
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, author, time, image, layout = "small" }) => {
  const navigate = useNavigate();

  const styles = {
    card: {
      display: layout === "small" ? "flex" : "block",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform 0.3s ease",
      ...(layout === "featured" && {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }),
      ...(layout === "large" && {
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }),
    },
    image: {
      width: layout === "small" ? "80px" : "100%",
      height: layout === "small" ? "80px" : "200px",
      borderRadius: layout === "small" ? "10px" : "15px",
      objectFit: "cover" as const,
    },
    content: {
      padding: layout === "small" ? "10px" : "15px",
    },
    title: {
      fontSize: layout === "small" ? "16px" : layout === "large" ? "24px" : "32px",
      fontWeight: "bold" as const,
      color: layout === "featured" ? "#ff6f61" : "#333",
      marginBottom: "10px",
    },
    meta: {
      fontSize: layout === "small" ? "12px" : "14px",
      color: "#777",
    },
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={() => navigate(`/blog/${id}`)} // Navigate to the blog details page
    >
      <img src={image} alt={title} style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.meta}>
          {author} · {time}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
