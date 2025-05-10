import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaBarcode, FaInfoCircle } from 'react-icons/fa';
import styles from './ProductInfoDetails.module.scss';
import VideoPlayer from './VideoPlayer';

interface ProductImage {
    id: number;
    title: string;
    meta: {
        download_url: string;
    };
}

interface ProductInfoProps {
    productInfo: {
        id: number;
        title: string;
        product_code: string;
        intro: string;
        body: string;
        product_image?: ProductImage;
    };
}

const ProductInfoDetails: React.FC<ProductInfoProps> = ({ productInfo }) => {
    const router = useRouter();
    const [processedContent, setProcessedContent] = useState(productInfo.body);
    const [videoElements, setVideoElements] = useState<Array<{src: string, type: string, title?: string}>>([]);

    // Process the content to handle videos and images properly
    useEffect(() => {
        if (!productInfo.body) return;

        const processContent = (content: string) => {
            if (typeof window === 'undefined') return content;

            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const videos: Array<{src: string, type: string, title?: string}> = [];

            // Process links to media files (videos)
            const links = doc.querySelectorAll('a');
            links.forEach((link, index) => {
                const href = link.getAttribute('href');
                if (!href) return;

                // Check if the link is to a video file
                if (href.match(/\.(mp4|webm|ogg|mov)$/i)) {
                    // Get file extension for video type
                    const extension = href.split('.').pop()?.toLowerCase();
                    const videoType = `video/${extension === 'mp4' ? 'mp4' : extension === 'webm' ? 'webm' : 'mp4'}`;

                    // Store video information
                    videos.push({
                        src: href,
                        type: videoType,
                        title: link.textContent || `Video ${index + 1}`
                    });

                    // Create a placeholder for the video
                    const videoPlaceholder = document.createElement('div');
                    videoPlaceholder.className = 'video-placeholder';
                    videoPlaceholder.setAttribute('data-video-index', String(videos.length - 1));
                    videoPlaceholder.textContent = '📺 ' + (link.textContent || `Video ${index + 1}`);

                    // Replace the link with the placeholder
                    link.parentNode?.replaceChild(videoPlaceholder, link);
                }
            });

            // Add proper styling to images
            const images = doc.querySelectorAll('img');
            images.forEach(img => {
                img.className = 'content-image';
            });

            // Update state with video elements
            setVideoElements(videos);

            return doc.body.innerHTML;
        };

        setProcessedContent(processContent(productInfo.body));
    }, [productInfo.body]);

    // Function to render the content with video players
    const renderContentWithVideos = () => {
        if (!processedContent) return null;

        // If there are no videos, just return the content
        if (videoElements.length === 0) {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                    className={styles.contentBody}
                />
            );
        }

        // Split the content by video placeholders
        const parts = processedContent.split(/<div class="video-placeholder" data-video-index="(\d+)">(.+?)<\/div>/);

        // Render content parts with video players interspersed
        const renderedContent: React.ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
            // Add the content part
            if (parts[i]) {
                renderedContent.push(
                    <div
                        key={`content-${i}`}
                        dangerouslySetInnerHTML={{ __html: parts[i] }}
                        className={styles.contentPart}
                    />
                );
            }

            // If next part is a video index, add the video player
            if (i + 1 < parts.length && /^\d+$/.test(parts[i + 1])) {
                const videoIndex = parseInt(parts[i + 1]);
                const videoTitle = parts[i + 2]?.replace('📺 ', '') || '';

                if (videoElements[videoIndex]) {
                    renderedContent.push(
                        <VideoPlayer
                            key={`video-${videoIndex}`}
                            src={videoElements[videoIndex].src}
                            type={videoElements[videoIndex].type}
                            title={videoTitle}
                        />
                    );
                }

                // Skip the next two parts (index and title)
                i += 2;
            }
        }

        return <>{renderedContent}</>;
    };

    return (
        <div className={styles.productInfoContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.backButtonContainer}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/shop')}
                    >
                        <FaArrowRight /> بازگشت به فروشگاه
                    </button>
                </div>

                <article className={styles.productInfoArticle}>
                    <header className={styles.productInfoHeader}>
                        <h1 className={styles.productInfoTitle}>{productInfo.title}</h1>

                        <div className={styles.productInfoMeta}>
                            <div className={styles.metaItem}>
                                <FaBarcode size={18} />
                                <span className={styles.productCode}>{productInfo.product_code}</span>
                            </div>
                        </div>
                    </header>

                    {productInfo.product_image && (
                        <div className={styles.productImageContainer}>
                            <Image
                                src={productInfo.product_image.meta.download_url}
                                alt={productInfo.product_image.title || productInfo.title}
                                fill
                                className={styles.productImage}
                                priority
                            />
                        </div>
                    )}

                    {productInfo.intro && (
                        <div className={styles.productIntro}>
                            <FaInfoCircle className={styles.introIcon} />
                            <p>{productInfo.intro}</p>
                        </div>
                    )}

                    <div className={styles.productInfoContent}>
                        {renderContentWithVideos()}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default ProductInfoDetails;