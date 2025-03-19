'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import styles from './productDetails.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from '@/assets/images/header1.jpg';
import { useCart } from '@/contexts/CartContext';
import { FaPlus, FaMinus, FaTrash, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import {Product, ProductImage} from '@/types/shop';
import { shopService } from '@/services/shopService';
import { Toaster } from 'react-hot-toast';

const ProductDetailsPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const productSlug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<string[]>([]);

    const {
        cartDetails,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = useCart();

    useEffect(() => {
        if (productSlug) {
            fetchProduct();
        }
    }, [productSlug]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await shopService.getProductBySlug(productSlug);
            setProduct(data);

            // Set the feature image as the selected image
            if (data.images && data.images.length > 0) {
                const featureImage = data.images.find((img: ProductImage) => img.is_feature);
                setSelectedImage(featureImage ? featureImage.image_url : data.images[0].image_url);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const getQuantityInCart = (): number => {
        if (!product || !cartDetails) return 0;
        const item = cartDetails.items.find(item => item.product.id === product.id);
        return item ? item.quantity : 0;
    };

    const handleIncrease = async () => {
        if (!product) return;
        await increaseQuantity(product.id);
    };

    const handleDecrease = async () => {
        if (!product) return;
        const quantity = getQuantityInCart();
        if (quantity > 1) {
            await decreaseQuantity(product.id);
        } else {
            await removeFromCart(product.id);
        }
    };

    const handleAddToCart = async () => {
        if (!product || !product.is_available) return;
        await addToCart(product.id);
    };

    const handleSubmitComment = () => {
        if (comment.trim()) {
            setComments((prev) => [...prev, comment.trim()]);
            setComment('');
        }
    };

    const goBack = () => {
        router.push('/shop');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <FaSpinner className={styles.spinner} />
                <p>در حال بارگذاری محصول...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.notFound}>
                <h2>محصول مورد نظر یافت نشد</h2>
                <button onClick={goBack} className={styles.backButton}>
                    بازگشت به فروشگاه
                </button>
            </div>
        );
    }

    const quantity = getQuantityInCart();

    return (
        <div className={styles.productContainer}>
            <Navbar logo={logo} />
            <Toaster position="top-center" />

            <div className={styles.heroSection}>
                <Image
                    src={heroImage}
                    alt="Shop Hero"
                    layout="fill"
                    objectFit="cover"
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroText}>فروشگاه درخت</h1>
                </div>
            </div>

            <div className={styles.backNavigation}>
                <button onClick={goBack} className={styles.backButton}>
                    <FaArrowRight /> بازگشت به فروشگاه
                </button>
            </div>

            <div className={styles.productContent}>
                {/* Right Column: Product Image Gallery */}
                <div className={styles.productImageGallery}>
                    <div className={styles.mainImageContainer}>
                        {selectedImage ? (
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                layout="fill"
                                objectFit="contain"
                                className={styles.mainImage}
                            />
                        ) : (
                            <div className={styles.noImage}>
                                تصویر موجود نیست
                            </div>
                        )}
                        {!product.is_available && (
                            <div className={styles.unavailableBadge}>ناموجود</div>
                        )}
                        {product.age_range && (
                            <div className={styles.ageBadge}>
                                {product.age_range}
                            </div>
                        )}
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className={styles.thumbnailsContainer}>
                            {product.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`${styles.thumbnail} ${selectedImage === image.image_url ? styles.activeThumbnail : ''}`}
                                    onClick={() => setSelectedImage(image.image_url)}
                                >
                                    <Image
                                        src={image.image_url}
                                        alt={`${product.title} - تصویر ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Left Column: Product Information & Controls */}
                <div className={styles.productDetails}>
                    <h1 className={styles.productTitle}>{product.title}</h1>

                    <div className={styles.productMeta}>
                        {product.stock > 0 ? (
                            <span className={styles.inStock}>موجود در انبار</span>
                        ) : (
                            <span className={styles.outOfStock}>ناموجود</span>
                        )}

                        {product.sku && (
                            <span className={styles.sku}>کد محصول: {product.sku}</span>
                        )}
                    </div>

                    <p className={styles.productPrice} style={{direction: 'rtl'}}>
                        {toPersianNumber(product.price_in_toman.toLocaleString())} تومان
                    </p>

                    <div className={styles.productDescription}
                         dangerouslySetInnerHTML={{ __html: product.description }}
                    />

                    {product.is_available && (
                        <div className={styles.addToCartSection}>
                            {quantity > 0 ? (
                                <div className={styles.quantityControls}>
                                    <button
                                        className={styles.decreaseButton}
                                        onClick={handleDecrease}
                                    >
                                        {quantity === 1 ? <FaTrash /> : <FaMinus />}
                                    </button>
                                    <span className={styles.quantityDisplay}>{toPersianNumber(quantity)}</span>
                                    <button
                                        className={styles.increaseButton}
                                        onClick={handleIncrease}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className={styles.addToCartButton}
                                    onClick={handleAddToCart}
                                    disabled={!product.is_available}
                                >
                                    افزودن به سبد خرید
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            <div className={styles.commentsContainer}>
                <h2 className={styles.commentsTitle}>نظرات</h2>
                <div className={styles.commentsBox}>
                    {comments.length === 0 ? (
                        <p className={styles.noComments}>هنوز نظری ثبت نشده است.</p>
                    ) : (
                        <ul className={styles.commentsList}>
                            {comments.map((cmt, index) => (
                                <li key={index} className={styles.commentItem}>
                                    {cmt}
                                </li>
                            ))}
                        </ul>
                    )}
                    <textarea
                        className={styles.commentInput}
                        placeholder="نظر خود را وارد کنید..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className={styles.submitCommentButton}
                        onClick={handleSubmitComment}
                    >
                        ارسال نظر
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;