import React, { useState } from 'react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { ProductImage } from '@/types/shop';
import styles from './ProductImageGallery.module.scss';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
  isAvailable?: boolean;
  ageRange?: string;
  initialSelectedImage?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productTitle,
  isAvailable = true,
  ageRange,
  initialSelectedImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    initialSelectedImage || images[0]?.image_url || ''
  );
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageSelect = (imageUrl: string) => {
    setIsImageLoading(true);
    setSelectedImage(imageUrl);
  };

  const handleImageLoadComplete = () => {
    setIsImageLoading(false);
  };

  return (
    <div className={styles.productImageGallery}>
      <div className={styles.mainImageContainer}>
        {selectedImage ? (
          <>
            {isImageLoading && (
              <div className={styles.skeletonOverlay}>
                <Skeleton height="100%" width="100%" borderRadius="12px" />
              </div>
            )}
            <Image
              src={selectedImage}
              alt={productTitle}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`${styles.mainImage} ${isImageLoading ? styles.imageLoading : ''}`}
              onLoad={handleImageLoadComplete}
              priority
            />
          </>
        ) : (
          <div className={styles.noImage}>تصویر موجود نیست</div>
        )}
        {!isAvailable && <div className={styles.unavailableBadge}>ناموجود</div>}
        {ageRange && <div className={styles.ageBadge}>{ageRange}</div>}
      </div>

      {images && images.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          {images.map((image, index) => (
            <div
              key={image.id || image.image_url}
              className={`${styles.thumbnail} ${
                selectedImage === image.image_url ? styles.activeThumbnail : ''
              }`}
              onClick={() => handleImageSelect(image.image_url)}
            >
              <Image
                src={image.image_url}
                alt={`${productTitle} - تصویر ${index + 1}`}
                fill
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
