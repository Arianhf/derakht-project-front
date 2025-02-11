'use client'; 

import { useParams, useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../../../styles/BlogDetails.module.scss';
import Image from 'next/image';
import logoImage from '../../../../public/images/logo2.png';
import { toPersianNumber } from '../../../utils/convertToPersianNumber';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

const BlogDetails = () => {
  const { id } = useParams(); 
  const router = useRouter(); 
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}v2/posts/${id}/`);
        setBlog(response.data);
      } catch (err) {
        console.error(err);
        setError('مقاله یافت نشد!');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  if (!blog) {
    return <p className={styles.notFound}>مقاله‌ای برای نمایش وجود ندارد.</p>;
  }

  const author = blog.owner?.first_name || 'نامشخص';
  const publishedDate = blog.jalali_date || 'تاریخ نامشخص';
  const intro = blog.intro || '';
  const body = blog.body || '<p>متنی برای این مقاله یافت نشد.</p>';
  const imageUrl = blog.header_image?.meta?.download_url || '/default-image.jpg';

  return (
    <div className={styles.blogContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Image src={logoImage} alt="Logo" className={styles.logo} width={140} height={70} />
        </div>

        {/* Navbar Items */}
        <div className={styles.navbarItems}>
          {['خانه', 'درباره ما', 'وبلاگ', 'داستان'].map((item, index) => (
            <a key={index} href="#" className={styles.navbarLink}>
              {item}
            </a>
          ))}
        </div>

        {/* Back Button */}
        <div className={styles.backButtonContainer}>
          <button onClick={() => router.back()} className={styles.backButton}>
            بازگشت
            <FaArrowLeft size={18} />
          </button>
        </div>
      </nav>

      <div style={{ marginTop: '120px' }}>
        {/* Blog Content */}
        <h1 className={styles.blogTitle}>{blog.title || 'بدون عنوان'}</h1>
        <p className={styles.blogMeta}>
          نوشته شده توسط <span className={styles.author}>{author}</span> ·{' '}
          {toPersianNumber(publishedDate)}
        </p>

        <Image
          src={imageUrl}
          alt={blog.header_image?.title || 'تصویر مقاله'}
          className={styles.blogImage}
          width={800} // Set appropriate width
          height={400} // Set appropriate height
          layout="responsive"
        />

        {/* Blog Intro */}
        {intro && <p className={styles.blogIntro}>{intro}</p>}

        {/* Rich Text Content */}
        <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
};

export default BlogDetails;