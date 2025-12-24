'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import { Button } from '@/components/shared/Button';
import Breadcrumbs from '@/components/shop/Breadcrumbs';
import ProductImageGallery from '@/components/shared/ProductImageGallery/ProductImageGallery';
import styles from './productDetails.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from "../../../../public/images/shop_bg.png";
import { FaPlus, FaMinus, FaTrash, FaArrowRight, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';
import { Product, Breadcrumb, ProductComment } from '@/types/shop';
import { shopService } from '@/services/shopService';
import toast, { Toaster } from 'react-hot-toast';
import { useProductQuantity } from '@/hooks/useProductQuantity';
import { StandardErrorResponse } from '@/types/error';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

interface ProductDetailsPageClientProps {
    product: Product;
    initialComments: ProductComment[];
    breadcrumbs: Breadcrumb[];
}

const ProductDetailsPageClient: React.FC<ProductDetailsPageClientProps> = ({
    product,
    initialComments,
    breadcrumbs
}) => {
    const router = useRouter();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<ProductComment[]>(initialComments);
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    // Use the product quantity hook
    const {
        quantity,
        isInCart,
        handleAddToCart,
        handleIncreaseQuantity,
        handleDecreaseQuantity
    } = useProductQuantity(product);

    // Comment submission handler
    const handleSubmitComment = async () => {
        if (!comment.trim()) {
            toast.error('لطفاً نظر خود را وارد کنید');
            return;
        }

        if (comment.trim().length < 10) {
            toast.error('نظر شما باید حداقل ۱۰ کاراکتر باشد');
            return;
        }

        try {
            setCommentSubmitting(true);
            const newComment = await shopService.createProductComment(product.slug, comment.trim());

            // Add the new comment to the list
            setComments((prev) => [newComment, ...prev]);
            setComment('');
            toast.success('نظر شما با موفقیت ثبت شد');
        } catch (error) {
            const standardError = error as StandardErrorResponse;
            const errorMessage = standardError?.code && ERROR_MESSAGES[standardError.code]
                ? typeof ERROR_MESSAGES[standardError.code] === 'function'
                    ? (ERROR_MESSAGES[standardError.code] as (details?: any) => string)(standardError.details)
                    : ERROR_MESSAGES[standardError.code]
                : 'خطا در ارسال نظر. لطفاً دوباره تلاش کنید';

            toast.error(errorMessage as string);
        } finally {
            setCommentSubmitting(false);
        }
    };

    // Go back to shop
    const goBack = () => {
        router.push('/shop');
    };

    // Format date to Persian
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Intl.DateTimeFormat('fa-IR', options).format(date);
        } catch {
            return '';
        }
    };

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
                    {/* Product Image Gallery */}
                    <ProductImageGallery
                        images={product.images || []}
                        productTitle={product.title}
                        isAvailable={product.is_available}
                        ageRange={product.age_range}
                    />

                    {/* Product Details */}
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
                            {formatPrice(product.price, true)}
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
                                            onClick={handleDecreaseQuantity}
                                            aria-label={quantity === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
                                        >
                                            {quantity === 1 ? <FaTrash /> : <FaMinus />}
                                        </button>
                                        <span className={styles.quantityDisplay}>
                                            {toPersianNumber(quantity)}
                                        </span>
                                        <button
                                            className={styles.increaseButton}
                                            onClick={handleIncreaseQuantity}
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
                                {comments.map((cmt) => (
                                    <li key={cmt.id} className={styles.commentItem}>
                                        <div className={styles.commentHeader}>
                                            <span className={styles.commentAuthor}>
                                                {cmt.user_name || 'کاربر ناشناس'}
                                            </span>
                                            <span className={styles.commentDate}>
                                                {formatDate(cmt.created_at)}
                                            </span>
                                        </div>
                                        <p className={styles.commentText}>{cmt.text}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <textarea
                            className={styles.commentInput}
                            placeholder="نظر خود را وارد کنید... (حداقل ۱۰ کاراکتر)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={commentSubmitting}
                        />
                        <Button
                            variant="primary"
                            onClick={handleSubmitComment}
                            className={styles.submitCommentButton}
                            disabled={commentSubmitting || !comment.trim()}
                            icon={commentSubmitting ? <FaSpinner className={styles.spinner} /> : undefined}
                        >
                            {commentSubmitting ? 'در حال ارسال...' : 'ارسال نظر'}
                        </Button>
                    </div>
                </div>

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

export default ProductDetailsPageClient;
