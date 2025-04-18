// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import { FaBook, FaShoppingCart, FaPencilAlt, FaStar } from 'react-icons/fa';
import styles from './home.module.scss';
import logo from '@/assets/images/logo2.png';

const HomePage = () => {
  const router = useRouter();

  // Animation states for elements
  const [animateHero, setAnimateHero] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const [animateValues, setAnimateValues] = useState(false);

  useEffect(() => {
    setAnimateHero(true);

    const featuresTimer = setTimeout(() => {
      setAnimateFeatures(true);
    }, 500);

    const valuesTimer = setTimeout(() => {
      setAnimateValues(true);
    }, 1000);

    return () => {
      clearTimeout(featuresTimer);
      clearTimeout(valuesTimer);
    };
  }, []);

  return (
      <div className={styles.homeContainer}>
        <Navbar logo={logo} />

        {/* Hero Section */}
        <section className={styles.heroSection} style={{ opacity: animateHero ? 1 : 0, transform: animateHero ? 'translateY(0)' : 'translateY(10px)' }}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                <span>به دنیای رنگارنگ</span>
                <span className={styles.heroEmphasis}>درخت</span>
                <span>خوش آمدید!</span>
                <span className={`${styles.sparkle} ${styles.sparkleTop}`}>✨</span>
                <span className={`${styles.sparkle} ${styles.sparkleBottom}`}>✨</span>
              </h1>
              <p className={styles.heroDescription}>
                برای خلق اثری ماندگار از کودکی. مناسب بچه‌های یک تا یک‌صد ساله.
              </p>
              <div className={styles.buttonContainer}>
                <button
                    onClick={() => router.push('/template')}
                    className={styles.primaryButton}
                >
                  برای قصه‌سازی
                </button>
                <button
                    onClick={() => router.push('/shop')}
                    className={styles.secondaryButton}
                >
                  برای خرید بسته قصه‌خوانی
                </button>
              </div>
            </div>

            <div className={styles.heroImageContainer}>
              <div className={styles.heroImageWrapper}>
                <Image
                    src="/images/home/kids-reading.png"
                    alt="کودکان در حال مطالعه"
                    fill
                    priority
                    className={styles.heroImage}
                />

                {/* Floating elements for playful decoration */}
                <div className={`${styles.floatingCircle} ${styles.yellowCircle}`}></div>
                <div className={`${styles.floatingCircle} ${styles.pinkCircle}`}></div>
                <div className={`${styles.floatingCircle} ${styles.blueCircle}`}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection} style={{ opacity: animateFeatures ? 1 : 0, transform: animateFeatures ? 'translateY(0)' : 'translateY(10px)' }}>
          <h2 className={styles.sectionTitle}>
            <span>در درخت</span>
            <div className={styles.titleUnderline}></div>
          </h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIconContainer} ${styles.purpleIcon}`}>
                <FaBook size={30} />
              </div>
              <h3 className={`${styles.featureTitle} ${styles.purpleTitle}`}>داستان‌های خلاقانه</h3>
              <p className={styles.featureDescription}>می‌توانی قصه خودتان را بسازی</p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIconContainer} ${styles.greenIcon}`}>
                <FaShoppingCart size={30} />
              </div>
              <h3 className={`${styles.featureTitle} ${styles.greenTitle}`}>فروشگاه آموزشی</h3>
              <p className={styles.featureDescription}>یک بسته کتابخوانی مناسب خود خودت داشته باشی.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIconContainer} ${styles.blueIcon}`}>
                <FaPencilAlt size={30} />
              </div>
              <h3 className={`${styles.featureTitle} ${styles.blueTitle}`}>بلاگ آموزشی</h3>
              <p className={styles.featureDescription}>مطالب هنری‌آموزشی‌ در بلاگ را بخوانی.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIconContainer} ${styles.yellowIcon}`}>
                <FaStar size={30} />
              </div>
              <h3 className={`${styles.featureTitle} ${styles.yellowTitle}`}>تجربه‌ای شگفت‌انگیز</h3>
              <p className={styles.featureDescription}>می‌توانی قصه بخوانی.</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection} style={{ opacity: animateValues ? 1 : 0, transform: animateValues ? 'translateY(0)' : 'translateY(10px)' }}>
          <div className={styles.valuesContainer}>
            <div className={styles.valuesTopBorder}></div>

            <h2 className={styles.valuesTitle}>
              ارزش‌های ما
            </h2>

            <div className={styles.valuesGrid}>
              <div className={`${styles.valueItem} ${styles.purpleBorder}`}>
                <h3 className={`${styles.valueTitle} ${styles.purpleValueTitle}`}>خلاقیت</h3>
                <p className={styles.valueDescription}>ما معتقدیم هر کودک استعدادی منحصر به فرد دارد. با ابزارهای ما، کودکان می‌توانند خلاقیت خود را کشف و شکوفا کنند.</p>
              </div>

              <div className={`${styles.valueItem} ${styles.greenBorder}`}>
                <h3 className={`${styles.valueTitle} ${styles.greenValueTitle}`}>یادگیری فعال</h3>
                <p className={styles.valueDescription}>ما به یادگیری از طریق تجربه و بازی باور داریم. محتوای ما به گونه‌ای طراحی شده که یادگیری را سرگرم‌کننده و جذاب می‌کند.</p>
              </div>

              <div className={`${styles.valueItem} ${styles.blueBorder}`}>
                <h3 className={`${styles.valueTitle} ${styles.blueValueTitle}`}>امنیت و اعتماد</h3>
                <p className={styles.valueDescription}>محیطی امن برای کودکان ایجاد می‌کنیم تا والدین با خیال راحت از محصولات و خدمات ما استفاده کنند.</p>
              </div>

              <div className={`${styles.valueItem} ${styles.yellowBorder}`}>
                <h3 className={`${styles.valueTitle} ${styles.yellowValueTitle}`}>رشد همه‌جانبه</h3>
                <p className={styles.valueDescription}>محصولات ما ابعاد مختلف رشد کودکان از جمله مهارت‌های زبانی، تفکر خلاق، و هوش هیجانی را پرورش می‌دهند.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>همین امروز به درخت بپیوندید!</h2>
            <p className={styles.ctaDescription}>سفر شگفت‌انگیز یادگیری و خلاقیت را با کودک خود آغاز کنید</p>
            <div className={styles.ctaButtons}>
              <button
                  onClick={() => router.push('/shop')}
                  className={`${styles.ctaButton} ${styles.yellowButton}`}
              >
                دیدن محصولات
              </button>
              <button
                  onClick={() => router.push('/template')}
                  className={`${styles.ctaButton} ${styles.whiteButton}`}
              >
                ساخت داستان
              </button>
            </div>
          </div>
        </section>

        {/* Use the shared Footer component */}
        <Footer />
      </div>
  );
};

export default HomePage;