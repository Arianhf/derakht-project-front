import {toPersianNumber} from "../utils/convertToPersianNumber.ts";

interface ImageGalleryProps {
    images: string[];
    selectedIndex: number;
    onImageSelect: (index: number) => void;
}

export const ImageGallery = ({ images, selectedIndex, onImageSelect }: ImageGalleryProps) => (
    <div className="image-gallery">
        {images.map((image, index) => (
            <div key={index} className="gallery-item">
                {selectedIndex === index && (
                    <span className="image-number">{toPersianNumber(index + 1)}</span>
                )}
                <span className="guide-icon" onClick={() => alert(`راهنمای تصویر ${toPersianNumber(index + 1)}`)}>
          ?
        </span>
                <img
                    src={image}
                    alt={`تصویر ${index + 1}`}
                    className={`gallery-image ${selectedIndex === index ? "selected" : ""}`}
                    onClick={() => onImageSelect(index)}
                />
            </div>
        ))}
    </div>
);