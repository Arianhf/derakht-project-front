'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import { FaUsers, FaBullseye, FaHeart, FaSeedling, FaSmile, FaBookReader, FaPuzzlePiece, FaShieldAlt } from 'react-icons/fa';
import styles from './about.module.scss';
import logo from '@/assets/images/logo2.png';
import Footer from "@/components/shared/Footer/Footer";
import { Metadata } from 'next';

// SEO Metadata for About page
export const metadata: Metadata = {
    title: 'درباره درخت | ماموریت ما در پرورش خلاقیت کودکان',
    description: 'درخت - پلتفرم قصه‌سازی و آموزش خلاقانه کودکان. تیم ما شامل نویسندگان، نقاشان و متخصصان آموزش کودک است که در سال ۱۴۰۳ گرد هم آمدند تا خلاقیت کودکان را پرورش دهند',
    keywords: 'درباره درخت، ماموریت درخت، تیم درخت، آموزش خلاقانه کودکان، قصه‌سازی، پلتفرم آموزشی کودکان، ارزش‌های درخت، چشم‌انداز درخت',
    authors: [{ name: 'تیم درخت' }],
    creator: 'درخت',
    publisher: 'درخت',
    openGraph: {
        type: 'website',
        locale: 'fa_IR',
        url: 'https://derakht.com/about',
        siteName: 'درخت',
        title: 'درباره درخت | ماموریت ما در پرورش خلاقیت کودکان',
        description: 'داستان درخت، یک پلتفرم قصه‌سازی و آموزش خلاقانه. تیم ما شامل نویسندگان، نقاشان و متخصصان آموزش کودک',
        images: [
            {
                url: '/images/about-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'درباره درخت - ماموریت ما',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'درباره درخت | ماموریت ما در پرورش خلاقیت کودکان',
        description: 'داستان درخت، یک پلتفرم قصه‌سازی و آموزش خلاقانه. تیم ما شامل نویسندگان، نقاشان و متخصصان آموزش کودک',
        images: ['/images/about-og-image.jpg'],
    },
    alternates: {
        canonical: 'https://derakht.com/about',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

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

    // Organization Structured Data
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'درخت',
        url: 'https://derakht.com',
        logo: 'https://derakht.com/images/logo2.png',
        description: 'پلتفرم قصه‌سازی و آموزش خلاقانه کودکان',
        foundingDate: '2024',
        slogan: 'برای خلق اثری ماندگار از کودکی',
        mission: 'راحت‌تر کردن مسیر فکر کردن و تخیل کردن و رساندن آن به خلق یک اثر است؛ اثری از امروز زندگی که در درخت برای همیشه ماندگار می‌شود',
        knowsAbout: [
            'قصه‌سازی کودکان',
            'آموزش خلاقانه',
            'رشد مهارت‌های کودکان',
            'تفکر خلاق',
            'مهارت‌های زبانی کودکان'
        ],
        areaServed: {
            '@type': 'Country',
            name: 'ایران'
        },
        keywords: 'قصه‌سازی، آموزش کودک، خلاقیت، مهارت‌های زبانی'
    };

    // Breadcrumb Structured Data
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'خانه',
                item: 'https://derakht.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'درباره ما',
                item: 'https://derakht.com/about'
            }
        ]
    };

    return (
        <>
            {/* Structured Data Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

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
                                درخت از ایده‌ای ساده شروع شد: هرکس قصه‌ای برای تعریف‌کردن دارد.
                            </p>
                            <p className={styles.storyParagraph}>
                                ما به بچه‌ها کمک می‌کنیم که جهان‌هایی که در ذهن دارند را در قصه‌ها ثبت کنند؛ قصه‌ای که
                                در کتابخانه خودشان و در کتابخانه درخت به زندگی ادامه می‌دهد، به گوش باقی آدم‌ها می‌رسد و
                                به آن‌ها تجربه‌ای جدید می‌بخشد.
                            </p>
                            <p className={styles.storyParagraph}>
                                و حالا در هر برگ این درخت قصه‌ای تازه زندگی می‌کند.
                            </p>
                            <p className={styles.storyParagraph}>
                                ما، چند نویسنده و نقاش حوزه کودک، چند برنامه‌نویس و چند متخصص آموزش کودک در سال ۱۴۰۳ کنار هم جمع شدیم تا این درخت را بسازیم.
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
                            ماموریت ما راحت‌تر کردن مسیر فکر کردن و تخیل کردن و رساندن آن به خلق یک اثر است؛ اثری از امروز زندگی او که در درخت برای همیشه ماندگار می‌شود. ما باور داریم که قصه‌سازی ابزار ساده‌ایست که مهارت‌های کلامی، تفکر، خلاقیت را گسترش می‌دهد، ابزاری که زندگی را در دو قلمروی تخیل و واقعیت ساده و زیبا می‌کند.
                        </p>
                        <p className={styles.missionDescription}>
                            و البته ما می‌خواهیم به کودکان کمک کنیم تا به هنرمندان، متفکران و خالقان امروز و آینده تبدیل شوند.
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
                        <Link href="/template" className={`${styles.invitationButton} ${styles.tealButton}`}>
                            شروع به قصه‌سازی
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer/>
        </div>
        </>
    );
};

export default AboutUsPage;