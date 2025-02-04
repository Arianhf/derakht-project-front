import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { blogService } from '../services/blogService';
import { Navbar } from './shared/Navbar';
import { Loading } from './shared/Loading';
import { ErrorMessage } from './shared/ErrorMessage';
import { HeroPost } from '../types';
import logoImage from '../assets/images/logo2.png';
import {toPersianNumber} from "../utils/convertToPersianNumber.ts";

const Header: React.FC = () => {
  const [heroPost, setHeroPost] = useState<HeroPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroPost = async () => {
      try {
        const data = await blogService.getHeroPost();
        setHeroPost(data);
      } catch (err) {
        console.error(err);
        setError("مشکلی در دریافت مقاله رخ داده است.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroPost();
  }, []);

  const handleHeaderClick = () => {
    if (heroPost?.id) {
      navigate(`/blog/${heroPost.id}`);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!heroPost) return <div className={styles.noHero}>مقاله‌ای یافت نشد</div>;

  return (
      <>
        <Navbar logo={logoImage} />

        <header className={styles.header}>
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
            <div className={styles.imageOverlay} />
            <div className={styles.overlay}>
              <div>
                <div className={styles.headerTags}>
                  {heroPost.tags?.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                  ))}
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
                  <span>{toPersianNumber(heroPost.jalali_date || "تاریخ نامشخص")}</span>
                  <span>{heroPost.reading_time} دقیقه مطالعه</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </>
  );
};

export default Header;