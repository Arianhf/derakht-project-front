'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import { Button } from '@/components/shared/Button';
import Breadcrumbs from '@/components/shop/Breadcrumbs';
import styles from './productDetails.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from "../../../../public/images/shop_hero.jpg";
import { useCart } from '@/contexts/CartContext';
import { FaPlus, FaMinus, FaTrash, FaArrowRight, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';
import { Product, ProductImage, Breadcrumb } from '@/types/shop';
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
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
        { label: 'فروشگاه', href: '/shop' },
    ]);

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

            // Update breadcrumbs
            const updatedBreadcrumbs = [
                { label: 'فروشگاه', href: '/shop' }
            ];

            if (data.category) {
                updatedBreadcrumbs.push({
                    label: data.category.name,
                    href: `/shop/category/${data.category.slug}`
                });
            }

            updatedBreadcrumbs.push({
                label: data.title,
                href: `/shop/${data.slug}`
            });

            setBreadcrumbs(updatedBreadcrumbs);

            // Set the feature image as the selected image
            if (data.images && data.images.length > 0) {
                const featureImage = data.images.find((img: ProductImage) => img.is_feature);
                setSelectedImage(featureImage ? featureImage.image_url : data.images[0].image_url);
            } else if (data.feature_image) {
                setSelectedImage(data.feature_image);
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
            <div className={styles.productContainer}>
                <Navbar logo={logo} />
                <div className={styles.loadingContainer}>
                    <FaSpinner className={styles.spinner} />
                    <p>در حال بارگذاری محصول...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.productContainer}>
                <Navbar logo={logo} />
                <div className={styles.notFound}>
                    <h2>محصول مورد نظر یافت نشد</h2>
                    <Button
                        variant="primary"
                        onClick={goBack}
                        icon={<FaArrowRight />}
                        iconPosition="right"
                    >
                        بازگشت به فروشگاه
                    </Button>
                </div>
            </div>
        );
    }

    const quantity = getQuantityInCart();
    const isInCart = quantity > 0;

    return (
        <div className={styles.productContainer}>
            <Navbar logo={logo} />
            <Toaster position="top-center" />

            <div className={styles.heroSection}>
                <Image
                    src={heroImage}
                    alt="فروشگاه درخت"
                    layout="fill"
                    objectFit="cover"
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroText}>فروشگاه درخت</h1>
                </div>
            </div>

            <div className={styles.contentContainer}>
                <Breadcrumbs items={breadcrumbs} />

                <div className={styles.productContent}>
                    {/* Right Column: Product Image Gallery */}
                    <div className={styles.productImageGallery}>
                        <div className={styles.mainImageContainer}>
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
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
                                            fill
                                            sizes="80px"
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
                            {product.is_available ? (
                                <span className={styles.inStock}>موجود در انبار</span>
                            ) : (
                                <span className={styles.outOfStock}>ناموجود</span>
                            )}

                            {product.sku && (
                                <span className={styles.sku}>کد محصول: {product.sku}</span>
                            )}
                        </div>

                        <p className={styles.productPrice}>
                            {formatPrice(product.price_in_toman, true)}
                        </p>

                        <div
                            className={styles.productDescription}
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />

                        {product.is_available && (
                            <div className={styles.addToCartSection}>
                                {isInCart ? (
                                    <div className={styles.quantityControls}>
                                        <button
                                            className={styles.decreaseButton}
                                            onClick={handleDecrease}
                                            aria-label={quantity === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
                                        >
                                            {quantity === 1 ? <FaTrash /> : <FaMinus />}
                                        </button>
                                        <span className={styles.quantityDisplay}>{toPersianNumber(quantity)}</span>
                                        <button
                                            className={styles.increaseButton}
                                            onClick={handleIncrease}
                                            aria-label="افزایش تعداد"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="primary"
                                        icon={<FaShoppingCart />}
                                        fullWidth
                                        onClick={handleAddToCart}
                                        disabled={!product.is_available}
                                        className={styles.addToCartButton}
                                    >
                                        افزودن به سبد خرید
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className={styles.commentsContainer}>
                    <h2 className={styles.commentsTitle}>نظرات کاربران</h2>
                    <div className={styles.commentsBox}>
                        {comments.length === 0 ? (
                            <p className={styles.noComments}>هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!</p>
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
                        <Button
                            variant="primary"
                            onClick={handleSubmitComment}
                            className={styles.submitCommentButton}
                        >
                            ارسال نظر
                        </Button>
                    </div>
                </div>

                {/* Related products section could be added here */}

                {/* Back to shop button */}
                <div className={styles.backToShopContainer}>
                    <Button
                        variant="outline"
                        onClick={goBack}
                        icon={<FaArrowRight />}
                        iconPosition="left"
                    >
                        بازگشت به فروشگاه
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;