import { useParams, useNavigate } from "react-router-dom";
import { mockBlogs } from "../data/mockBlogs"; // Replace with your real data source
import { FaArrowLeft } from "react-icons/fa";
import styles from "./BlogDetails.module.scss"; // Import the SCSS module

const BlogDetails = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const navigate = useNavigate();
  const blog = id ? mockBlogs.find((b) => b.id === parseInt(id)) : null; // Find the blog by ID

  if (!blog) {
    return <p>مقاله یافت نشد!</p>;
  }

  return (
    <div className={styles.blogContainer}>
      {/* Back Button */}
      <div className={styles.backButtonContainer}>
        <button
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          بازگشت
          <FaArrowLeft size={18} />
        </button>
      </div>

      {/* Blog Content */}
      <h1 className={styles.blogTitle}>{blog.title}</h1>
      <p className={styles.blogMeta}>
        نوشته شده توسط <span className={styles.author}>{blog.author}</span> · {blog.publishedDate} · {blog.time}
      </p>

      <img src={blog.image} alt={blog.title} className={styles.blogImage} />

      {/* Rich Text Content */}
      <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default BlogDetails;
