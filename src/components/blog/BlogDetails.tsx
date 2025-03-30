'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './BlogDetails.module.scss';

interface BlogDetailsProps {
    blog: {
        title: string;
        author: {
            first_name: string;
        };
        jalali_date?: string;
        content: string;
        header_image?: {
            meta?: {
                download_url: string;
            };
            title?: string;
        };
    };
    logo: any;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ blog, logo }) => {
    const router = useRouter();

    // Function to process the blog content
    const processContent = (content: string) => {
        // Create a DOM parser to work with the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        // Function to check if an element is a right or left aligned image
        const isFloatedImage = (element: Element) => {
            if (element.tagName === 'IMG') {
                const classNames = element.className.split(' ');
                return classNames.includes('right') || classNames.includes('left');
            }
            return false;
        };

        // Find consecutive floated images with no substantial content between them
        const paragraphs = doc.querySelectorAll('p');

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            const images = paragraph.querySelectorAll('img');

            // If this paragraph contains a floated image
            if (images.length > 0 && isFloatedImage(images[0])) {
                // Check if the next paragraph also starts with a floated image
                if (i < paragraphs.length - 1) {
                    const nextParagraph = paragraphs[i + 1];
                    const nextImages = nextParagraph.querySelectorAll('img');

                    if (nextImages.length > 0 && isFloatedImage(nextImages[0])) {
                        // There's a floated image in the next paragraph
                        // Check if there's enough text content in this paragraph
                        const textContent = paragraph.textContent?.trim() || '';

                        // If there's not enough text to provide spacing
                        if (textContent.length < 100) {
                            // Insert a break-float div to clear the floats
                            const breakDiv = document.createElement('div');
                            breakDiv.className = 'break-float';
                            paragraph.appendChild(breakDiv);
                        }
                    }
                }
            }
        }

        return doc.body.innerHTML;
    };

    return (
        <div className={styles.blogContainer}>
            <nav className={styles.navbar}>
                <div className={styles.logoContainer}>
                    <Image
                        src={logo}
                        alt="Logo"
                        className={styles.logo}
                        width={140}
                        height={70}
                    />
                </div>
                <div className={styles.navbarItems}>
                    <Link href="/" className={styles.navbarLink}>صفحه اصلی</Link>
                    <Link href="/shop" className={styles.navbarLink}>فروشگاه</Link>
                    <Link href="/blog" className={styles.navbarLink}>بلاگ</Link>
                    <Link href="/contact" className={styles.navbarLink}>تماس با ما</Link>
                </div>
                <div className={styles.backButtonContainer}>
                    <button className={styles.backButton} onClick={() => router.push('/blog')}>
                        بازگشت <FaArrowLeft />
                    </button>
                </div>
            </nav>

            <div className={styles.blogArticle}>
                <h1 className={styles.blogTitle}>{blog.title}</h1>
                <p className={styles.blogMeta}>
                    نوشته شده توسط <span className={styles.author}>{blog.author?.first_name || 'نویسنده'}</span> · {blog.jalali_date}
                </p>

                {blog.header_image && (
                    <div className={styles.headerImageContainer}>
                        <Image
                            src={blog.header_image.meta?.download_url || '/default-image.jpg'}
                            alt={blog.header_image.title || blog.title}
                            width={800}
                            height={400}
                            className={styles.headerImage}
                            priority
                        />
                    </div>
                )}

                <div className={styles.blogContent}>
                    {/* We need to use useEffect to run the processing client-side since DOMParser isn't available during SSR */}
                    {typeof window !== 'undefined' ? (
                        <div dangerouslySetInnerHTML={{ __html: processContent(blog.content) }} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;