// src/components/Header.tsx
import React from 'react';
import styles from '../styles/BlogPage.module.css';
import headerImage from '../assets/images/header.jpg';
import { FaUserCircle } from 'react-icons/fa'; // Import avatar icon
import { IconContext } from 'react-icons/lib';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <img src={headerImage} alt="تصویر هدر" className={styles.headerImage} />
      <div className={styles.overlay}>
        <div>
          <h1>بازی و نقاشی برای تفریح های خلاقانه</h1>
          <p>بازی و نقاشی برای کودکان یا کودکان درون</p>
        </div>
        <div className={styles.authorInfo}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconContext.Provider value={{ className: styles.authorIcon }}>
              <FaUserCircle size={30} />
            </IconContext.Provider>
            <span style={{ marginRight: '10px' }}>علی کلاته</span>
          </div>
          <div>
            <span>۱ آذر ۱۴۰۳</span> . <span>۱۰ دقیقه مطالعه</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
