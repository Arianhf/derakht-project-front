// src/components/shared/Footer/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div className={styles.footerColumn}>
                    <h3 className={styles.footerTitle}>درخت</h3>
                    <p>جایی برای رشد و شکوفایی خلاقیت کودکان</p>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.footerTitle}>لینک‌های مهم</h3>
                    <ul className={styles.footerLinks}>
                        <li><Link href="/shop" className={styles.footerLink}>فروشگاه</Link></li>
                        <li><Link href="/blog" className={styles.footerLink}>بلاگ</Link></li>
                        <li><Link href="/`template`" className={styles.footerLink}>داستان‌سازی</Link></li>
                        <li><Link href="/about" className={styles.footerLink}>درباره ما</Link></li>
                    </ul>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.footerTitle}>تماس با ما</h3>
                    <p>ایمیل: info@derakht.com</p>
                    <p>تلفن:۰۹۱۲۳۹۶۹۲۵۴</p>
                    <div className={styles.socialLinks}>
                        <a href="https://instagram.com/derrakhtt" target="_blank" className={styles.socialLink}>
                            <FaInstagram />
                            <span>derrakhtt</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.footerDivider}>
                <p className={styles.copyright}>© تمامی حقوق برای درخت محفوظ است. ۱۴۰۴</p>
            </div>
        </footer>
    );
};

export default Footer;