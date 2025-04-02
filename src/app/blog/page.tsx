'use client';
import React from 'react';
import BlogPost from '../../components/blog/BlogPost';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import logoImage from '@/assets/images/logo2.png';
import styles from './page.module.scss';

const BlogPage: React.FC = () => {
    return (
        <div className={styles.blogPageWrapper}>
            <Navbar logo={logoImage} />
            <main className={styles.mainContent}>
                <BlogPost />
            </main>
        </div>
    );
};

export default BlogPage;