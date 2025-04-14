'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import { FaUsers, FaBullseye, FaHeart, FaSeedling, FaSmile, FaBookReader, FaPuzzlePiece, FaShieldAlt } from 'react-icons/fa';
import styles from './about.module.scss';
import logo from '@/assets/images/logo2.png';

const AboutUsPage = () => {
    // Animation states for elements
    const [isVisible, setIsVisible] = useState({
        header: false,
        story: false,
        mission: false,
        team: false,
        values: false
    });

    useEffect(() => {
        // Set animations with delays
        setIsVisible(prev => ({ ...prev, header: true }));

        const storyTimer = setTimeout(() => {
            setIsVisible(prev => ({ ...prev, story: true }));
        }, 300);

        const missionTimer = setTimeout(() => {
            setIsVisible(prev => ({ ...prev, mission: true }));
        }, 600);

        const teamTimer = setTimeout(() => {
            setIsVisible(prev => ({ ...prev, team: true }));
        }, 900);

        const valuesTimer = setTimeout(() => {
            setIsVisible(prev => ({ ...prev, values: true }));
        }, 1200);

        return () => {
            clearTimeout(storyTimer);
            clearTimeout(missionTimer);
            clearTimeout(teamTimer);
            clearTimeout(valuesTimer);
        };
    }, []);

    return (
        <div className={styles.aboutContainer}>
            <Navbar logo={logo} />

            {/* Hero Section */}
            <section className={styles.headerSection} style={{ opacity: isVisible.header ? 1 : 0, transform: isVisible.header ? 'translateY(0)' : 'translateY(10px)' }}>
                <h1 className={styles.headerTitle}>
                    <span>درباره ما</span>
                    <div className={styles.titleUnderline}></div>
                    <span className={`${styles.headerEmoji} ${styles.rainbowEmoji}`}>🌈</span>
                    <span className={`${styles.headerEmoji} ${styles.sparkleEmoji}`}>✨</span>
                </h1>
                <p className={styles.headerDescription}>
                    <span className={styles.emphasis}>درخت</span> یک پلتفرم آموزشی و سرگرمی برای کودکان است که با هدف پرورش خلاقیت، مهارت‌های زبانی و تفکر خلاق کودکان ایجاد شده است.
                </p>
            </section>

            {/* Our Story Section */}
            <section className={styles.storySection} style={{ opacity: isVisible.story ? 1 : 0, transform: isVisible.story ? 'translateY(0)' : 'translateY(10px)' }}>
                <div className={styles.storyCard}>
                    <div className={`${styles.decorCircle} ${styles.yellowCircle}`}></div>
                    <div className={`${styles.decorCircle} ${styles.blueCircle}`}></div>

                    <div className={styles.storyContent}>
                        <div className={styles.storyText}>
                            <h2 className={styles.storyTitle}>
                                داستان ما
                                <div className={styles.storyTitleUnderline}></div>
                            </h2>
                            <p className={styles.storyParagraph}>
                                درخت از ایده‌ای ساده شروع شد: ایجاد فضایی که در آن کودکان بتوانند با استفاده از تخیل خود جهان‌های جدیدی خلق کنند.
                            </p>
                            <p className={styles.storyParagraph}>
                                ما باور داریم که هر کودک داستان‌های منحصر به فردی در ذهن دارد که منتظر شکوفایی هستند. در سال ۱۴۰۳، گروهی از متخصصان آموزش کودک، برنامه‌نویسان و هنرمندان گرد هم آمدند تا پلتفرم درخت را ایجاد کنند.
                            </p>
                            <p className={styles.storyParagraph}>
                                امروز، ما افتخار می‌کنیم که هزاران کودک و خانواده ایرانی با استفاده از ابزارهای درخت، لذت داستان‌سرایی و یادگیری خلاقانه را تجربه می‌کنند.
                            </p>
                        </div>

                        <div className={styles.storyImageContainer}>
                            <div className={styles.storyImageWrapper}>
                                <Image
                                    src="/images/about/kids-story.png"
                                    alt="کودکان در حال داستان گویی"
                                    fill
                                    className={styles.storyImage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className={styles.missionSection} style={{ opacity: isVisible.mission ? 1 : 0, transform: isVisible.mission ? 'translateY(0)' : 'translateY(10px)' }}>
                <div className={styles.missionGrid}>
                    <div className={`${styles.missionCard} ${styles.purpleCard}`}>
                        <div className={`${styles.cornerTriangle} ${styles.purpleTriangle}`}></div>

                        <div className={`${styles.missionIconContainer} ${styles.purpleIcon}`}>
                            <FaBullseye size={30} />
                        </div>

                        <h2 className={`${styles.missionTitle} ${styles.purpleTitle}`}>ماموریت ما</h2>
                        <p className={styles.missionDescription}>
                            ماموریت ما ایجاد ابزارهایی است که کودکان را قادر می‌سازد داستان‌های خود را بسازند، خلاقیت خود را پرورش دهند و با روش‌های سرگرم‌کننده، مهارت‌های زبانی و تفکر خود را تقویت کنند.
                        </p>
                        <p className={styles.missionDescription}>
                            ما می‌خواهیم به کودکان کمک کنیم تا به نویسندگان، متفکران و خالقان آینده تبدیل شوند.
                        </p>
                    </div>

                    <div className={`${styles.missionCard} ${styles.tealCard}`}>
                        <div className={`${styles.cornerTriangle} ${styles.tealTriangle}`}></div>

                        <div className={`${styles.missionIconContainer} ${styles.tealIcon}`}>
                            <FaHeart size={30} />
                        </div>

                        <h2 className={`${styles.missionTitle} ${styles.tealTitle}`}>چشم‌انداز ما</h2>
                        <p className={styles.missionDescription}>
                            ما جهانی را تصور می‌کنیم که در آن هر کودک ایرانی دسترسی به ابزارهای آموزشی با کیفیت و سرگرم‌کننده دارد تا بتواند استعدادهای خود را به طور کامل شکوفا کند.
                        </p>
                        <p className={styles.missionDescription}>
                            چشم‌انداز ما ایجاد نسلی از کودکان خلاق، با اعتماد به نفس و دارای مهارت‌های تفکر انتقادی است که آماده رویارویی با چالش‌های دنیای آینده هستند.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className={styles.teamSection} style={{ opacity: isVisible.team ? 1 : 0, transform: isVisible.team ? 'translateY(0)' : 'translateY(10px)' }}>
                <div className={styles.teamCard}>
                    <h2 className={styles.teamTitle}>
                        تیم ما
                        <div className={styles.teamTitleUnderline}></div>
                    </h2>

                    <div className={styles.teamContent}>
                        <div className={styles.teamDescription}>
                            <p className={styles.teamParagraph}>
                                تیم درخت متشکل از متخصصان آموزش کودک، روانشناسان، نویسندگان خلاق، طراحان و برنامه‌نویسان است که همگی با هدف مشترک فراهم آوردن تجربه‌ای شگفت‌انگیز برای کودکان گرد هم آمده‌اند.
                            </p>
                            <p className={styles.teamParagraph}>
                                ما با عشق و اشتیاق کار می‌کنیم تا ابزارها و محتوایی ایجاد کنیم که الهام‌بخش، آموزنده و سرگرم‌کننده باشد. فلسفه ما این است که یادگیری باید لذت‌بخش باشد و کودکان در محیطی امن و حمایت‌کننده رشد کنند.
                            </p>
                        </div>

                        <div className={styles.teamRoles}>
                            <div className={styles.roleItem}>
                                <div className={`${styles.roleIconContainer} ${styles.yellowIconBg}`}>
                                    <FaUsers className={styles.yellowIcon} />
                                </div>
                                <h3 className={styles.roleTitle}>متخصصان آموزشی</h3>
                            </div>

                            <div className={styles.roleItem}>
                                <div className={`${styles.roleIconContainer} ${styles.blueIconBg}`}>
                                    <FaBookReader className={styles.blueIcon} />
                                </div>
                                <h3 className={styles.roleTitle}>نویسندگان خلاق</h3>
                            </div>

                            <div className={styles.roleItem}>
                                <div className={`${styles.roleIconContainer} ${styles.purpleIconBg}`}>
                                    <FaPuzzlePiece className={styles.purpleIcon} />
                                </div>
                                <h3 className={styles.roleTitle}>طراحان هنری</h3>
                            </div>

                            <div className={styles.roleItem}>
                                <div className={`${styles.roleIconContainer} ${styles.greenIconBg}`}>
                                    <FaShieldAlt className={styles.greenIcon} />
                                </div>
                                <h3 className={styles.roleTitle}>متخصصان امنیت</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className={styles.valuesSection} style={{ opacity: isVisible.values ? 1 : 0, transform: isVisible.values ? 'translateY(0)' : 'translateY(10px)' }}>
                <h2 className={styles.valuesSectionTitle}>
                    <span>ارزش‌های ما</span>
                    <div className={styles.valuesTitleUnderline}></div>
                </h2>

                <div className={styles.valuesGrid}>
                    <div className={styles.valueCard}>
                        <div className={`${styles.valueIconContainer} ${styles.yellowIconBg}`}>
                            <FaSeedling className={styles.yellowIcon} />
                        </div>
                        <h3 className={`${styles.valueTitle} ${styles.yellowTitle}`}>رشد و یادگیری</h3>
                        <p className={styles.valueDescription}>ما به پرورش همه‌جانبه کودکان با روش‌های خلاقانه و شاد متعهد هستیم.</p>
                    </div>

                    <div className={styles.valueCard}>
                        <div className={`${styles.valueIconContainer} ${styles.purpleIconBg}`}>
                            <FaSmile className={styles.purpleIcon} />
                        </div>
                        <h3 className={`${styles.valueTitle} ${styles.purpleTitle}`}>شادی و سرگرمی</h3>
                        <p className={styles.valueDescription}>معتقدیم یادگیری باید لذت‌بخش باشد. ما آموزش را با بازی و سرگرمی همراه می‌کنیم.</p>
                    </div>

                    <div className={styles.valueCard}>
                        <div className={`${styles.valueIconContainer} ${styles.greenIconBg}`}>
                            <FaShieldAlt className={styles.greenIcon} />
                        </div>
                        <h3 className={`${styles.valueTitle} ${styles.greenTitle}`}>امنیت و اعتماد</h3>
                        <p className={styles.valueDescription}>ایجاد محیطی امن برای کودکان و قابل اعتماد برای والدین اولویت اصلی ماست.</p>
                    </div>

                    <div className={styles.valueCard}>
                        <div className={`${styles.valueIconContainer} ${styles.blueIconBg}`}>
                            <FaHeart className={styles.blueIcon} />
                        </div>
                        <h3 className={`${styles.valueTitle} ${styles.blueTitle}`}>مهربانی و احترام</h3>
                        <p className={styles.valueDescription}>ما با مهربانی و احترام به تفاوت‌های فردی، فضایی برای شکوفایی همه کودکان فراهم می‌کنیم.</p>
                    </div>
                </div>
            </section>

            {/* Our Approach */}
            <section className={styles.approachSection}>
                <div className={styles.approachCard}>
                    <h2 className={styles.approachTitle}>رویکرد ما</h2>

                    <div className={styles.approachGrid}>
                        <div className={styles.approachItem}>
                            <h3 className={styles.approachItemTitle}>یادگیری فعال</h3>
                            <p className={styles.approachDescription}>
                                کودکان در درخت، مصرف‌کننده منفعل محتوا نیستند بلکه سازندگان فعال آن هستند. رویکرد ما مبتنی بر یادگیری از طریق انجام دادن است.
                            </p>
                        </div>

                        <div className={styles.approachItem}>
                            <h3 className={styles.approachItemTitle}>محتوای بومی و فرهنگی</h3>
                            <p className={styles.approachDescription}>
                                محتوای ما متناسب با فرهنگ و ارزش‌های ایرانی طراحی شده تا کودکان با مفاهیم آشنا و قابل درک ارتباط برقرار کنند.
                            </p>
                        </div>

                        <div className={styles.approachItem}>
                            <h3 className={styles.approachItemTitle}>فناوری در خدمت آموزش</h3>
                            <p className={styles.approachDescription}>
                                ما از فناوری به عنوان ابزاری برای غنی‌سازی تجربه یادگیری استفاده می‌کنیم، نه جایگزینی برای تعامل انسانی.
                            </p>
                        </div>

                        <div className={styles.approachItem}>
                            <h3 className={styles.approachItemTitle}>همراهی والدین</h3>
                            <p className={styles.approachDescription}>
                                ما والدین را بخش مهمی از فرآیند یادگیری می‌دانیم و ابزارهایی برای مشارکت آنها در این سفر فراهم می‌کنیم.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Invitation */}
            <section className={styles.invitationSection}>
                <div className={styles.invitationCard}>
                    <h2 className={styles.invitationTitle}>با ما همراه شوید</h2>
                    <p className={styles.invitationDescription}>
                        ما در درخت باور داریم که هر کودکی استعدادی منحصر به فرد دارد. به ما بپیوندید تا با هم، این استعدادها را کشف و شکوفا کنیم.
                    </p>

                    <div className={styles.invitationButtons}>
                        <Link href="/shop" className={styles.invitationButton}>
                            دیدن محصولات
                        </Link>
                        <Link href="/about" className={`${styles.invitationButton} ${styles.tealButton}`}>
                            درباره ما
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
                            <li><Link href="/template" className={styles.footerLink}>داستان‌سازی</Link></li>
                            <li><Link href="/about" className={styles.footerLink}>تماس با ما</Link></li>
                        </ul>
                    </div>
                    <div className={styles.footerColumn}>
                        <h3 className={styles.footerTitle}>تماس با ما</h3>
                        <p>ایمیل: info@derakht.com</p>
                        <p>تلفن: ۰۲۱-۸۸۷۷۶۶۵۵</p>
                    </div>
                </div>
                <div className={styles.footerDivider}>
                    <p className={styles.copyright}>© تمامی حقوق برای درخت محفوظ است. ۱۴۰۴</p>
                </div>
            </footer>
        </div>
    );
};

export default AboutUsPage;