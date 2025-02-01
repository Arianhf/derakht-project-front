import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { NAVBAR_ITEMS } from '../../constants';
import styles from './Navbar.module.css';

interface NavbarProps {
    logo?: string;
    showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true }) => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                {logo && <img src={logo} alt="Logo" className={styles.logo}/>}
            </div>

            <div className={styles.navbarItems}>
                {NAVBAR_ITEMS.map((item, index) => (
                    <Link key={index} to="#" className={styles.navbarLink}>
                        {item}
                    </Link>
                ))}
            </div>

            {showSearch && (
                <div className={styles.searchBar}>
                    <input type="text" placeholder="جستجو" className={styles.searchInput}/>
                    <FaSearch color="#555"/>
                </div>
            )}
        </nav>
    );
}