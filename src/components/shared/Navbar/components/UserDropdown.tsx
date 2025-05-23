import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaUserCircle, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import styles from '../Navbar.module.scss';

const UserDropdown: React.FC = () => {
    const router = useRouter();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if user is logged in based on localStorage
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsUserDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsUserDropdownOpen(false);
        }, 300); // 300ms delay before closing
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <div
            className={styles.userContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={userDropdownRef}
        >
            <div className={styles.iconWrapper}>
                <FaUserCircle className={styles.userIcon} />
            </div>

            {isUserDropdownOpen && (
                <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
                    {isLoggedIn ? (
                        <>
                            <Link href="/account" className={styles.userDropdownItem}>
                                <FaUser className={styles.dropdownIcon} />
                                <span>حساب کاربری</span>
                            </Link>
                            <Link href="/account/orders" className={styles.userDropdownItem}>
                                <FaShoppingBag className={styles.dropdownIcon} />
                                <span>سفارش‌های من</span>
                            </Link>
                            <div
                                className={styles.userDropdownItem}
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className={styles.dropdownIcon} />
                                <span>خروج</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.userDropdownItem}>
                                <FaUser className={styles.dropdownIcon} />
                                <span>ورود</span>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDropdown;