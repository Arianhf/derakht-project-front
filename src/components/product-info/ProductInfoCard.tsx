import React from 'react';
import Image from 'next/image';
import { FaInfoCircle, FaBarcode } from 'react-icons/fa';
import styles from './ProductInfoCard.module.scss';

interface ProductImage {
    id: number;
    title: string;
    meta: {
        download_url: string;
    };
}

interface ProductInfoCardProps {
    item: {
        id: number;
        title: string;
        product_code: string;
        intro: string;
        product_image?: ProductImage;
    };
    onClick: () => void;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ item, onClick }) => {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageContainer}>
                {item.product_image ? (
                    <Image
                        src={item.product_image.meta.download_url}
                        alt={item.title}
                        fill
                        className={styles.productImage}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <FaInfoCircle size={40} />
                    </div>
                )}
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.title}>{item.title}</h3>

                <div className={styles.productCode}>
                    <FaBarcode />
                    <span>{item.product_code}</span>
                </div>

                <p className={styles.intro}>{item.intro}</p>

                <button className={styles.viewButton}>مشاهده اطلاعات</button>
            </div>
        </div>
    );
};

export default ProductInfoCard;