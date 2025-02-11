import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./BlogDetails.module.scss";
import { blogService } from '../services/blogService';
import { Navbar } from './shared/Navbar';
import { Button } from './shared/Button';
import { Loading } from './shared/Loading';
import { ErrorMessage } from './shared/ErrorMessage';
import { BlogPost } from '../types';
import { UI_CONSTANTS } from '../constants';
import logoImage from '../assets/images/logo2.png';
import {toPersianNumber} from "../utils/convertToPersianNumber.ts";

interface BlogContentProps {
    blog: BlogPost;
}

const BlogContent: React.FC<BlogContentProps> = ({ blog }) => (
    <div className={styles.blogContent}>
        <h1 className={styles.blogTitle}>{blog.title || "بدون عنوان"}</h1>
        <p className={styles.blogMeta}>
            نوشته شده توسط{" "}
            <span className={styles.author}>{blog.owner?.first_name || "نامشخص"}</span> ·{" "}
            {toPersianNumber(blog.jalali_date || "تاریخ نامشخص")}
        </p>

        <img
            src={blog.header_image?.meta?.download_url || "default-image.jpg"}
            alt={blog.header_image?.title || "تصویر مقاله"}
            className={styles.blogImage}
        />

        {blog.intro && <p className={styles.blogIntro}>{blog.intro}</p>}

        <div
            className={styles.blogContent}
            dangerouslySetInnerHTML={{ __html: blog.body || "<p>متنی برای این مقاله یافت نشد.</p>" }}
        />
    </div>
);

const BlogDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;

            try {
                const data = await blogService.getPostById(id);
                setBlog(data);
            } catch (err) {
                console.error(err);
                setError(UI_CONSTANTS.ERROR_MESSAGE);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (!id) {
        return <ErrorMessage message="شناسه مقاله نامعتبر است." />;
    }

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;
    if (!blog) return <p className={styles.notFound}>{UI_CONSTANTS.NOT_FOUND_MESSAGE}</p>;

    return (
        <div className={styles.blogContainer}>
            <Navbar logo={logoImage} />

            <div className={styles.contentWrapper} style={{ marginTop: "120px" }}>
                <div className={styles.backButtonContainer}>
                    <Button
                        onClick={() => navigate(-1)}
                        className={styles.backButton}
                        variant="secondary"
                    >
                        <FaArrowLeft size={18} />
                        بازگشت
                    </Button>
                </div>

                <BlogContent blog={blog} />
            </div>
        </div>
    );
};

export default BlogDetails;
