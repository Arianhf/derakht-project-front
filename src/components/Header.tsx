// src/components/Header.tsx
import React from 'react';
import styles from '../styles/BlogPage.module.css';
import headerImage from '../assets/images/header.jpg';
import logoImage from '../assets/images/logo.svg';
import { FaUserCircle, FaSearch } from 'react-icons/fa'; // Import icons
import { IconContext } from 'react-icons/lib';

const Header: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <div
        style={{
          direction: 'rtl',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          top: 0,
          left: 30,
          right: 30,
          background: 'transparent',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logoImage}
            alt="لوگو"
            style={{ width: '150px', height: '100px', borderRadius: '50%' }}
          />
        </div>

        {/* Navbar Items */}
        <div
          style={{
            display: 'flex',
            gap: '50px',
            fontFamily: 'Yekan, Arial, sans-serif',
            fontSize: '19px',
            fontWeight: 'bold',
          }}
        >
          {['خانه', 'درباره ما', 'وبلاگ', 'داستان'].map((item, index) => (
            <a
              key={index}
              href="/"
              style={{
                textDecoration: 'none',
                color: '#2B463C',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#018A08')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#2B463C')}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            padding: '5px 10px',
            width: '200px',
          }}
        >
          <input
            type="text"
            placeholder="جستجو"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              padding: '5px',
              fontFamily: 'Yekan, Arial, sans-serif',
            }}
          />
          <FaSearch color="#555" />
        </div>
      </div>

      {/* Header Content */}
      <div className={styles.header}>
        <img src={headerImage} alt="تصویر هدر" className={styles.headerImage} />
        <div className={styles.overlay}>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '50%',
              }}
            >
              <div
                style={{
                  backgroundColor: '#bbbbbbbd',
                  padding: '2px 20px',
                  borderRadius: '20px',
                  textShadow: 'none',
                }}
              >
                خلاقیت
              </div>
              <div
                style={{
                  backgroundColor: '#bbbbbbbd',
                  padding: '2px 20px',
                  borderRadius: '20px',
                  textShadow: 'none',
                }}
              >
                فعالیت
              </div>
              <div
                style={{
                  backgroundColor: '#bbbbbbbd',
                  padding: '2px 20px',
                  borderRadius: '20px',
                  textShadow: 'none',
                }}
              >
                نقاشی
              </div>
            </div>
            <h1>بازی و نقاشی برای تفریح های خلاقانه</h1>
            <p>بازی و نقاشی برای کودکان یا کودکان درون</p>
          </div>
          <div className={styles.authorInfo}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
    </div>
  );
};

export default Header;
