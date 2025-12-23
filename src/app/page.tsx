// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import { FaBook, FaShoppingCart, FaPencilAlt, FaStar, FaArrowLeft } from 'react-icons/fa';
import styles from './home.module.scss';
import logo from '@/assets/images/logo2.png';
import { shopService } from '@/services/shopService';
import { Product } from '@/types/shop';

const HomePage = () => {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await shopService.getProducts({ sort: 'popular' });
        setFeaturedProducts(data.results.slice(0, 4)); // Get top 4 products
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'درخت',
    url: 'https://derakht.com',
    logo: 'https://derakht.com/images/logo2.png',
    description: 'پلتفرم قصه‌سازی و آموزش خلاقانه کودکان',
    foundingDate: '2024',
    slogan: 'برای خلق اثری ماندگار از کودکی',
    knowsAbout: [
      'قصه‌سازی کودکان',
      'آموزش خلاقانه',
      'رشد مهارت‌های کودکان',
      'محتوای آموزشی کودک',
      'بسته‌های کتابخوانی'
    ],
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'درخت',
    url: 'https://derakht.com',
    description: 'پلتفرم آموزشی و سرگرمی برای کودکان',
    inLanguage: 'fa-IR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://derakht.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <div className={styles.homeContainer}>
        <Navbar logo={logo} />

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                <span>به دنیای رنگارنگ</span>
                <span className={styles.heroEmphasis}>درخت</span>
                <span>خوش آمدید!</span>
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
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>
            در درخت
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
        <section className={styles.valuesSection}>
          <div className={styles.valuesContainer}>
            <h2 className={styles.valuesTitle}>
              ارزش‌های ما
            </h2>

            <div className={styles.valuesGrid}>
              <div className={`${styles.valueItem} ${styles.purpleBorder}`}>
                <div className={styles.valueIconWrapper}>
                  <Image
                    src="/images/icons/creativity.svg"
                    alt="خلاقیت"
                    width={80}
                    height={80}
                    className={styles.valueIcon}
                  />
                </div>
                <h3 className={`${styles.valueTitle} ${styles.purpleValueTitle}`}>خلاقیت</h3>
                <p className={styles.valueDescription}>ما معتقدیم هر کودک استعدادی منحصر به فرد دارد. با ابزارهای ما، کودکان می‌توانند خلاقیت خود را کشف و شکوفا کنند.</p>
              </div>

              <div className={`${styles.valueItem} ${styles.greenBorder}`}>
                <div className={styles.valueIconWrapper}>
                  <Image
                    src="/images/icons/learning.svg"
                    alt="یادگیری فعال"
                    width={80}
                    height={80}
                    className={styles.valueIcon}
                  />
                </div>
                <h3 className={`${styles.valueTitle} ${styles.greenValueTitle}`}>یادگیری فعال</h3>
                <p className={styles.valueDescription}>ما به یادگیری از طریق تجربه و بازی باور داریم. محتوای ما به گونه‌ای طراحی شده که یادگیری را سرگرم‌کننده و جذاب می‌کند.</p>
              </div>

              <div className={`${styles.valueItem} ${styles.blueBorder}`}>
                <div className={styles.valueIconWrapper}>
                  <Image
                    src="/images/icons/safety.svg"
                    alt="امنیت و اعتماد"
                    width={80}
                    height={80}
                    className={styles.valueIcon}
                  />
                </div>
                <h3 className={`${styles.valueTitle} ${styles.blueValueTitle}`}>امنیت و اعتماد</h3>
                <p className={styles.valueDescription}>محیطی امن برای کودکان ایجاد می‌کنیم تا والدین با خیال راحت از محصولات و خدمات ما استفاده کنند.</p>
              </div>

              <div className={`${styles.valueItem} ${styles.yellowBorder}`}>
                <div className={styles.valueIconWrapper}>
                  <Image
                    src="/images/icons/growth.svg"
                    alt="رشد همه‌جانبه"
                    width={80}
                    height={80}
                    className={styles.valueIcon}
                  />
                </div>
                <h3 className={`${styles.valueTitle} ${styles.yellowValueTitle}`}>رشد همه‌جانبه</h3>
                <p className={styles.valueDescription}>محصولات ما ابعاد مختلف رشد کودکان از جمله مهارت‌های زبانی، تفکر خلاق، و هوش هیجانی را پرورش می‌دهند.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className={styles.featuredSection}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.featuredTitle}>محصولات پرفروش</h2>
            <button
              onClick={() => router.push('/shop')}
              className={styles.viewAllButton}
            >
              مشاهده همه
              <FaArrowLeft className={styles.arrowIcon} />
            </button>
          </div>

          {loadingProducts ? (
            <div className={styles.featuredGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonText}></div>
                  <div className={styles.skeletonTextShort}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.featuredGrid}>
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className={styles.productCard}
                  onClick={() => router.push(`/shop/${product.slug}`)}
                >
                  <div className={styles.productImageWrapper}>
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].image}
                        alt={product.name}
                        fill
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.noProductImage}>
                        <FaBook size={40} />
                      </div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>
                      {product.price.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
      </>
  );
};

export default HomePage;