'use client';

import React from 'react';
import Link from 'next/link';
import { FaHome, FaChevronLeft } from 'react-icons/fa';
import { Breadcrumb } from '@/types/shop';
import styles from './Breadcrumbs.module.scss';

interface BreadcrumbsProps {
    items: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <nav className={styles.breadcrumbs} aria-label="breadcrumbs">
            <ol className={styles.breadcrumbsList}>
                <li className={styles.breadcrumbItem}>
                    <Link href="/" className={styles.breadcrumbLink}>
                        <FaHome className={styles.homeIcon} />
                        <span className={styles.srOnly}>خانه</span>
                    </Link>
                    <FaChevronLeft className={styles.separator} aria-hidden="true" />
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li
                            key={`${item.href}-${index}`}
                            className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''}`}
                            aria-current={isLast ? 'page' : undefined}
                        >
                            {isLast ? (
                                <span className={styles.currentPage}>{item.label}</span>
                            ) : (
                                <>
                                    <Link href={item.href} className={styles.breadcrumbLink}>
                                        {item.label}
                                    </Link>
                                    <FaChevronLeft className={styles.separator} aria-hidden="true" />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;