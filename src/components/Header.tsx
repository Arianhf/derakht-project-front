import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logoImage from '../assets/images/logo2.png';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import axios from 'axios';

const Header: React.FC = () => {
  const [heroPost, setHeroPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL + "v2/posts";

  useEffect(() => {
    const fetchHeroPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/hero/`);
        setHeroPost(response.data);
      } catch (err) {
        console.error(err);
        setError("مشکلی در دریافت مقاله رخ داده است.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroPost();
  }, [BASE_URL]);

  const handleHeaderClick = () => {
    if (heroPost && heroPost.id) {
      navigate(`/blog/${heroPost.id}`);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <img src={logoImage} alt="Logo" className={styles.logo} />
        </div>

        {/* Navbar Items */}
        <div className={styles.navbarItems}>
          {['خانه', 'درباره ما', 'وبلاگ', 'داستان'].map((item, index) => (
            <a key={index} href="#" className={styles.navbarLink}>
              {item}
            </a>
          ))}
        </div>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input type="text" placeholder="جستجو" className={styles.searchInput} />
          <FaSearch color="#555" />
        </div>
      </nav>

      {/* Header Content */}
      <header className={styles.header}>
        {loading ? (
          <div className={styles.loading}>در حال بارگذاری...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : heroPost ? (
          <div 
            className={styles.clickableContainer} 
            onClick={handleHeaderClick} 
            style={{ cursor: 'pointer' }}
          >
            <img
              src={heroPost.header_image?.meta?.download_url}
              alt={heroPost.header_image?.title}
              className={styles.headerImage}
            />
            {/* Background overlay for better text readability */}
            <div className={styles.imageOverlay}></div>
            <div className={styles.overlay}>
              <div>
                <div className={styles.headerTags}>
                  {heroPost.tags?.map(
                    (tag: string | number | undefined | null, index: number) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    )
                  )}
                </div>
                <h1 className={styles.headerTitle}>{heroPost.title}</h1>
                <p className={styles.headerSubtitle}>{heroPost.subtitle}</p>
              </div>
              <div className={styles.authorInfo}>
                <div className={styles.authorDetails}>
                  <IconContext.Provider value={{ className: styles.authorIcon }}>
                    <FaUserCircle size={30} />
                  </IconContext.Provider>
                  <span>{heroPost.owner?.first_name}</span>
                </div>
                <div className={styles.authorMeta}>
                  <span>{heroPost.jalali_date}</span>-
                  <span>{heroPost.reading_time} دقیقه مطالعه</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noHero}>مقاله‌ای یافت نشد</div>
        )}
      </header>
    </>
  );
};

export default Header;
