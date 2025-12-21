'use client';

import React from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaFileAlt, FaFlag, FaChartLine } from 'react-icons/fa';
import styles from './page.module.scss';

const AdminDashboard = () => {
    const cards = [
        {
            title: 'مدیریت قالب‌های داستان',
            description: 'ایجاد، ویرایش و حذف قالب‌های داستان',
            icon: <FaFileAlt />,
            link: '/admin/templates',
            color: '#667eea'
        },
        {
            title: 'مدیریت ویژگی‌ها',
            description: 'فعال یا غیرفعال کردن ویژگی‌های سیستم',
            icon: <FaFlag />,
            link: '/admin/feature-flags',
            color: '#f093fb'
        },
        {
            title: 'آمار و گزارش‌ها',
            description: 'مشاهده آمار کاربران و داستان‌ها',
            icon: <FaChartLine />,
            link: '#',
            color: '#4facfe'
        }
    ];

    return (
        <AdminLayout>
            <div className={styles.dashboard}>
                <h1 className={styles.title}>پنل مدیریت درخت</h1>
                <p className={styles.subtitle}>به پنل مدیریت سیستم خوش آمدید</p>

                <div className={styles.cardsGrid}>
                    {cards.map((card, index) => (
                        <Link
                            key={index}
                            href={card.link}
                            className={styles.card}
                            style={{ '--card-color': card.color } as React.CSSProperties}
                        >
                            <div className={styles.cardIcon} style={{ color: card.color }}>
                                {card.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <p className={styles.cardDescription}>{card.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
