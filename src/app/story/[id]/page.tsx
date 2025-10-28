'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import FeatureProtectedRoute from '@/components/shared/FeatureProtectedRoute';
import logo from '@/assets/images/logo2.png';
import { storyService } from '@/services/storyService';
import { Story } from '@/types/story';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import StoryPreview from '@/components/story/StoryPreview';
import styles from './StoryPage.module.scss';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'edit'; // Default to edit mode if not specified

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [template, setTemplate] = useState<Story | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyName, setStoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [thumbnailsLoading, setThumbnailsLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Check if we're in mobile view
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset main image loading when selectedIndex changes
  useEffect(() => {
    setMainImageLoading(true);
  }, [selectedIndex]);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;

      try {
        const response = await storyService.getStoryById(id);
        setTemplate(response);
        setTexts(response.parts.map((part) => part.text || ''));

        // Initialize thumbnails loading state
        const initialThumbnailsLoading: Record<number, boolean> = {};
        response.parts.forEach((_, index) => {
          initialThumbnailsLoading[index] = true;
        });
        setThumbnailsLoading(initialThumbnailsLoading);

        // Set cover and background images if available
        if (response.cover_image) {
          setCoverImage(response.cover_image);
        }

        if (response.background_image) {
          setBackgroundImage(response.background_image);
        }
      } catch (err) {
        setError('خطا در دریافت قالب داستان');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTexts = [...texts];
    newTexts[selectedIndex] = e.target.value;
    setTexts(newTexts);
  };

  const handleNavigate = (direction: 'next' | 'prev') => {
    if (direction === 'prev' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (direction === 'next') {
      if (selectedIndex < (template?.parts.length || 0) - 1) {
        setSelectedIndex(selectedIndex + 1);
      } else {
        setIsModalOpen(true);
      }
    }
  };

  const handleFinishStory = async () => {
    if (!template) return;

    try {
      setIsModalOpen(false);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error('Error finishing story:', err);
      alert('خطا در پایان داستان');
    }
  };

  const handleCoverImageUpload = async (file: File) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await storyService.uploadStoryCoverImage(id, file);
      setCoverImage(response.cover_image);
      toast.success('تصویر جلد با موفقیت آپلود شد');
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error('خطا در آپلود تصویر جلد');
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundImageUpload = async (file: File) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await storyService.uploadStoryBackgroundImage(id, file);
      setBackgroundImage(response.background_image);
      toast.success('تصویر پس‌زمینه با موفقیت آپلود شد');
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error('خطا در آپلود تصویر پس‌زمینه');
    } finally {
      setLoading(false);
    }
  };

  const switchToEditMode = () => {
    router.push(`/story/${id}?mode=edit`);
  };

  const switchToViewMode = () => {
    router.push(`/story/${id}?mode=view`);
  };

  if (loading) return <div className={styles.loadingContainer}>در حال بارگذاری...</div>;
  if (error) return <div className={styles.errorContainer}>{error}</div>;
  if (!template) return <div className={styles.errorContainer}>قالب داستان یافت نشد</div>;

  // If mode is 'view' or 'preview', show the full-page preview
  if (mode === 'view' || mode === 'preview') {
    return (
        <div className={styles.storyPage}>
          <Toaster position="top-center" />

          <div className={styles.fullPagePreviewContainer}>
            <div className={styles.previewHeader}>
              <h1 className={styles.storyTitle}>{template.title}</h1>
              <button
                  className={styles.editModeButton}
                  onClick={switchToEditMode}
              >
                <FaEdit /> ویرایش داستان
              </button>
            </div>

            <StoryPreview
                parts={template.parts.map((part, index) => ({
                  illustration: part.illustration || "/placeholder-image.jpg",
                  text: texts[index] || "متنی وارد نشده است.",
                }))}
                isOpen={true}
                onClose={() => router.push('/stories')}
                isFullPage={true}
                storyId={id as string}
                storyTitle={template.title}
                coverImage={coverImage}
                backgroundImage={backgroundImage}
                onCoverImageUpload={handleCoverImageUpload}
                onBackgroundImageUpload={handleBackgroundImageUpload}
            />
          </div>
        </div>
    );
  }

  // Otherwise, show the edit mode
  return (
      <div className={styles.storyPage}>
        <Navbar logo={logo} />
        <Toaster position="top-center" />

        {isMobileView ? (
            // Mobile View Layout
            <div className={styles.mobileContent}>
              <div className={styles.mobileImageContainer}>
                {mainImageLoading && (
                  <div className={styles.skeletonContainer}>
                    <Skeleton
                      height={350}
                      width="100%"
                      borderRadius={12}
                    />
                  </div>
                )}
                <Image
                    src={template.parts[selectedIndex]?.illustration || '/placeholder-image.jpg'}
                    alt={`تصویر ${selectedIndex + 1}`}
                    className={styles.mobileMainImage}
                    width={500}
                    height={350}
                    layout="responsive"
                    onLoadingComplete={() => setMainImageLoading(false)}
                    style={{ display: mainImageLoading ? 'none' : 'block' }}
                />
                <div className={styles.mobilePagination}>
              <span className={styles.pageIndicator}>
                {toPersianNumber(`${selectedIndex + 1} / ${template.parts.length}`)}
              </span>
                </div>
              </div>

              <div className={styles.mobileStoryContainer}>
            <textarea
                value={texts[selectedIndex]}
                onChange={handleTextChange}
                placeholder="داستان خود را بنویسید..."
                className={styles.storyInput}
            />
                <div className={styles.buttonContainer}>
                  <button
                      className={styles.prevButton}
                      onClick={() => handleNavigate('prev')}
                      disabled={selectedIndex === 0}
                  >
                    قبلی
                  </button>
                  <button
                      className={styles.viewModeButton}
                      onClick={switchToViewMode}
                  >
                    پیش‌نمایش
                  </button>
                  <button
                      className={styles.nextButton}
                      onClick={() => handleNavigate('next')}
                  >
                    {selectedIndex === template.parts.length - 1 ? "پایان" : "بعدی"}
                  </button>
                </div>
              </div>
            </div>
        ) : (
            // Desktop View Layout
            <div className={styles.desktopContent}>
              <div className={styles.mainContainer}>
                <div className={styles.imageContainer}>
                  {mainImageLoading && (
                    <div className={styles.skeletonContainer}>
                      <Skeleton
                        height={400}
                        width="100%"
                        borderRadius={12}
                      />
                    </div>
                  )}
                  <Image
                      src={template.parts[selectedIndex]?.illustration || '/placeholder-image.jpg'}
                      alt={`تصویر ${selectedIndex + 1}`}
                      className={styles.mainImage}
                      width={600}
                      height={400}
                      layout="responsive"
                      onLoadingComplete={() => setMainImageLoading(false)}
                      style={{ display: mainImageLoading ? 'none' : 'block' }}
                  />
                  <div className={styles.pageIndicator}>
                    <span>{toPersianNumber(`${template.parts.length} / ${selectedIndex + 1}`)}</span>
                  </div>
                </div>
                <div className={styles.storyContainer}>
                  <textarea
                      value={texts[selectedIndex]}
                      onChange={handleTextChange}
                      placeholder="داستان خود را بنویسید..."
                      className={styles.storyInput}
                  />
                  <div className={styles.buttonContainer}>
                    <button
                        className={styles.prevButton}
                        onClick={() => handleNavigate('prev')}
                        disabled={selectedIndex === 0}
                    >
                      قبلی
                    </button>
                    <button
                        className={styles.viewModeButton}
                        onClick={switchToViewMode}
                    >
                      پیش‌نمایش
                    </button>
                    <button
                        className={styles.nextButton}
                        onClick={() => handleNavigate('next')}
                    >
                      {selectedIndex === template.parts.length - 1 ? "پایان" : "بعدی"}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.thumbnailsContainer}>
                <div className={styles.imageGallery}>
                  {template.parts.map((part, index) => (
                      <div key={part.id} className={styles.galleryItem}>
                        {selectedIndex === index && (
                            <span className={styles.imageNumber}>{toPersianNumber(index + 1)}</span>
                        )}
                        {thumbnailsLoading[index] && (
                          <Skeleton
                            width={120}
                            height={100}
                            borderRadius={8}
                            className={styles.thumbnailSkeleton}
                          />
                        )}
                        <Image
                            src={part.illustration || '/placeholder-image.jpg'}
                            alt={`تصویر ${index + 1}`}
                            className={`${styles.galleryImage} ${selectedIndex === index ? styles.selected : ''}`}
                            onClick={() => setSelectedIndex(index)}
                            width={100}
                            height={100}
                            onLoadingComplete={() => {
                              setThumbnailsLoading(prev => ({ ...prev, [index]: false }));
                            }}
                            style={{ display: thumbnailsLoading[index] ? 'none' : 'block' }}
                        />
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {isModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2>اسم این داستانی که نوشتی چیه؟</h2>
                <input
                    type="text"
                    value={storyName}
                    onChange={(e) => setStoryName(e.target.value)}
                    placeholder="نام داستان"
                    className={styles.storyNameInput}
                />
                <div className={styles.modalButtons}>
                  <button className={styles.modalButton} onClick={handleFinishStory}>
                    تایید
                  </button>
                  <button className={styles.cancelModalButton} onClick={() => setIsModalOpen(false)}>
                    انصراف
                  </button>
                </div>
                <button className={styles.closeModalButton} onClick={() => setIsModalOpen(false)}>
                  <FaTimes/>
                </button>
              </div>
            </div>
        )}

        <StoryPreview
            parts={template.parts.map((part, index) => ({
              illustration: part.illustration || "/placeholder-image.jpg",
              text: texts[index] || "متنی وارد نشده است.",
            }))}
            isOpen={isPreviewOpen}
            onClose={() => router.push('/story')}
            storyId={id as string}
            storyTitle={storyName}
            coverImage={coverImage}
            backgroundImage={backgroundImage}
            onCoverImageUpload={handleCoverImageUpload}
            onBackgroundImageUpload={handleBackgroundImageUpload}
        />
      </div>
  );
};

export default function ProtectedStoryPage() {
  return (
      <FeatureProtectedRoute featureName="story_creation">
        <StoryPage />
      </FeatureProtectedRoute>
  );
}