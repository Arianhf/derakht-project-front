'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import logo from '@/assets/images/logo2.png';
import { storyService } from '@/services/storyService';
import { Story, TemplatePart } from '@/types/story';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import styles from './IllustrateStoryPage.module.scss';
import { FaTimes, FaUpload, FaImage, FaEye } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import StoryPreview from '@/components/story/StoryPreview';

const IllustrateStoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [template, setTemplate] = useState<Story | null>(null);
  const [images, setImages] = useState<(File | null)[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyName, setStoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check if we're in mobile view
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;

      try {
        const response = await storyService.getStoryById(id);
        setTemplate(response);
        // Initialize the images array with nulls based on the number of parts
        setImages(new Array(response.parts.length).fill(null));
        setImageUrls(new Array(response.parts.length).fill(''));
      } catch (err) {
        setError('خطا در دریافت قالب داستان');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Update the images array
    const newImages = [...images];
    newImages[currentIndex] = file;
    setImages(newImages);

    // Create a URL for the image to display it
    const newImageUrls = [...imageUrls];
    const url = URL.createObjectURL(file);
    newImageUrls[currentIndex] = url;
    setImageUrls(newImageUrls);

    toast.success('تصویر با موفقیت آپلود شد');
  };

  const uploadCurrentImage = async () => {
    // If there's no image for the current part, notify user and don't proceed
    if (!images[currentIndex]) {
      toast.error('لطفا برای این بخش تصویر آپلود کنید');
      return false;
    }

    try {
      setLoading(true);

      // Create FormData for the current image
      const formData = new FormData();
      // Convert 0-based index to 1-based position for backend
      formData.append('part_position', (currentIndex + 1).toString());
      formData.append('story_id', id as string);
      formData.append('image', images[currentIndex] as File);

      // Upload image for this part
      await storyService.uploadImageForPart(formData);

      toast.success('تصویر با موفقیت ذخیره شد');
      return true;
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('خطا در آپلود تصویر');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = async (direction: 'next' | 'prev') => {
    if (direction === 'prev' && currentIndex > 0) {
      // Simply go to previous part without validating
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next') {
      if (currentIndex < (template?.parts.length || 0) - 1) {
        // Upload current image before proceeding to next part
        const uploadSuccess = await uploadCurrentImage();
        if (uploadSuccess) {
          setCurrentIndex(currentIndex + 1);
        }
      } else {
        // We're at the last part, check if image is uploaded and show modal
        if (images[currentIndex]) {
          const uploadSuccess = await uploadCurrentImage();
          if (uploadSuccess) {
            setIsModalOpen(true);
          }
        } else {
          toast.error('لطفا برای این بخش تصویر آپلود کنید');
        }
      }
    }
  };

  const handleShowPreview = () => {
    if (images.some(img => img === null)) {
      toast.error('لطفا برای تمام بخش‌ها تصویر آپلود کنید');
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleFinishStory = async () => {
    if (!template || storyName.trim() === '') {
      toast.error('لطفا نام داستان را وارد کنید');
      return;
    }

    try {
      setLoading(true);

      // Since all images have already been uploaded,
      // we just need to finalize the story with its title
      const response = await storyService.finalizeStory(id as string, storyName);

      toast.success('داستان با موفقیت ذخیره شد');
      setIsModalOpen(false);
      router.push('/story');
    } catch (err) {
      console.error('Error finishing story:', err);
      toast.error('خطا در ذخیره داستان');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loadingContainer}>در حال بارگذاری...</div>;
  if (error) return <div className={styles.errorContainer}>{error}</div>;
  if (!template) return <div className={styles.errorContainer}>قالب داستان یافت نشد</div>;

  const currentPart = template.parts[currentIndex];

  return (
      <div className={styles.illustratePage}>
        <Navbar logo={logo} />
        <Toaster position="top-center" />

        {isMobileView ? (
            // Mobile View Layout
            <div className={styles.mobileContent}>
              <div className={styles.textContainer}>
                <h2 className={styles.partTitle}>بخش {toPersianNumber(currentIndex + 1)}</h2>
                <p className={styles.partPrompt}>{currentPart.text}</p>
              </div>

              <div className={styles.uploadContainer}>
                {imageUrls[currentIndex] ? (
                    <div className={styles.imagePreviewContainer}>
                      <Image
                          src={imageUrls[currentIndex]}
                          alt="تصویر آپلود شده"
                          width={300}
                          height={200}
                          className={styles.imagePreview}
                      />
                      <button
                          className={styles.changeImageButton}
                          onClick={() => document.getElementById('image-upload-mobile')?.click()}
                      >
                        تغییر تصویر
                      </button>
                    </div>
                ) : (
                    <div className={styles.uploadPlaceholder} onClick={() => document.getElementById('image-upload-mobile')?.click()}>
                      <FaUpload className={styles.uploadIcon} />
                      <p>برای آپلود تصویر کلیک کنید</p>
                      <input
                          id="image-upload-mobile"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className={styles.fileInput}
                      />
                    </div>
                )}
              </div>

              <div className={styles.navigationButtons}>
                <button
                    className={styles.prevButton}
                    onClick={() => handleNavigate('prev')}
                    disabled={currentIndex === 0}
                >
                  قبلی
                </button>
                <button
                    className={styles.previewButton}
                    onClick={handleShowPreview}
                >
                  <FaEye /> پیش‌نمایش
                </button>
                <button
                    className={styles.nextButton}
                    onClick={() => handleNavigate('next')}
                >
                  {currentIndex === template.parts.length - 1 ? "پایان" : "بعدی"}
                </button>
              </div>
            </div>
        ) : (
            // Desktop View Layout
            <div className={styles.desktopContent}>
              <div className={styles.mainContainer}>
                <div className={styles.textBlock}>
                  <h2 className={styles.partTitle}>بخش {toPersianNumber(currentIndex + 1)}</h2>
                  <p className={styles.partPrompt}>{currentPart.text}</p>
                  <div className={styles.navigationButtons}>
                    <button
                        className={styles.prevButton}
                        onClick={() => handleNavigate('prev')}
                        disabled={currentIndex === 0}
                    >
                      قبلی
                    </button>
                    <button
                        className={styles.previewButton}
                        onClick={handleShowPreview}
                    >
                      <FaEye /> پیش‌نمایش
                    </button>
                    <button
                        className={styles.nextButton}
                        onClick={() => handleNavigate('next')}
                    >
                      {currentIndex === template.parts.length - 1 ? "پایان" : "بعدی"}
                    </button>
                  </div>
                </div>

                <div className={styles.uploadBlock}>
                  {imageUrls[currentIndex] ? (
                      <div className={styles.imagePreviewContainer}>
                        <Image
                            src={imageUrls[currentIndex]}
                            alt="تصویر آپلود شده"
                            width={400}
                            height={300}
                            className={styles.imagePreview}
                        />
                        <button
                            className={styles.changeImageButton}
                            onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          تغییر تصویر
                        </button>
                      </div>
                  ) : (
                      <div className={styles.uploadPlaceholder} onClick={() => document.getElementById('image-upload')?.click()}>
                        <FaUpload className={styles.uploadIcon} />
                        <p>برای آپلود تصویر کلیک کنید</p>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.fileInput}
                        />
                      </div>
                  )}
                </div>
              </div>

              <div className={styles.thumbnailsContainer}>
                <div className={styles.imageGallery}>
                  {template.parts.map((part, index) => (
                      <div key={part.id} className={styles.galleryItem}>
                        {currentIndex === index && (
                            <span className={styles.imageNumber}>{toPersianNumber(index + 1)}</span>
                        )}
                        <div
                            className={`${styles.galleryImageContainer} ${currentIndex === index ? styles.selected : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                          {imageUrls[index] ? (
                              <Image
                                  src={imageUrls[index]}
                                  alt={`تصویر ${index + 1}`}
                                  fill
                                  className={styles.galleryImage}
                              />
                          ) : (
                              <div className={styles.emptyImagePlaceholder}>
                                <FaImage />
                              </div>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {isModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2>اسم این داستانی که تصویرسازی کردی چیه؟</h2>
                <input
                    type="text"
                    value={storyName}
                    onChange={(e) => setStoryName(e.target.value)}
                    placeholder="نام داستان"
                    className={styles.storyNameInput}
                />
                <div className={styles.modalButtons}>
                  <button
                      className={styles.modalButton}
                      onClick={handleFinishStory}
                      disabled={loading}
                  >
                    {loading ? 'در حال ذخیره...' : 'تایید'}
                  </button>
                  <button
                      className={styles.cancelModalButton}
                      onClick={() => setIsModalOpen(false)}
                  >
                    انصراف
                  </button>
                </div>
                <button
                    className={styles.closeModalButton}
                    onClick={() => setIsModalOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
        )}

        <StoryPreview
            parts={template.parts.map((part, index) => ({
              illustration: imageUrls[index] || "/placeholder-image.jpg",
              text: part.text || "متنی وجود ندارد",
            }))}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            orientation={template.orientation}
            size={template.size}
        />
      </div>
  );
};

export default IllustrateStoryPage;