'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import logo from '@/assets/images/logo2.png';
import styles from './template.module.scss';
import { templateService } from '@/services/templateService';
import { loginService } from '@/services/loginService';
import { storyService } from '@/services/storyService';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import placeholderImage from '@/assets/images/story.png';

// Import images
import writeStoryImage from '../../../public/images/writeStory.jpg';
import paintStoryImage from '../../../public/images/paintStory.jpg';
import finishStoryImage from '../../../public/images/finishStory.jpg';

// Icons
import { FaPaintBrush, FaPen, FaClock, FaBook } from 'react-icons/fa';

interface TemplatePart {
  id: string;
  position: number;
  prompt_text: string;
  illustration: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  template_parts: TemplatePart[];
  cover_image: string | null;
}

interface TemplateResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Template[];
}

interface StoryPart {
  id: string;
  position: number;
  text: string;
  illustration: string | null;
}

interface Story {
  id: string;
  title: string;
  parts: StoryPart[];
  cover_image: string | null;
  background_color: string | null;
  font_color: string | null;
}

const TemplatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<'story' | 'drawing' | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedTemplate) {
      fetchTemplates(selectedTemplate);
    }
  }, [selectedTemplate]);

  // Fetch user stories on component mount
  useEffect(() => {
    const fetchUserStories = async () => {
      const isAuthenticated = loginService.isAuthenticated();
      if (isAuthenticated) {
        try {
          setIsLoadingStories(true);
          const response = await storyService.getApiStories();
          setStories(response.results);
        } catch (error) {
          console.error('Error fetching stories:', error);
        } finally {
          setIsLoadingStories(false);
        }
      }
    };

    fetchUserStories();
  }, []);

  // Check for pending template selection on component mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const isAuthenticated = loginService.isAuthenticated();

    if (isAuthenticated) {
      const pendingTemplateString = localStorage.getItem('pendingTemplate');

      if (pendingTemplateString) {
        try {
          const pendingTemplate = JSON.parse(pendingTemplateString);

          // Clear the pending template from localStorage
          localStorage.removeItem('pendingTemplate');

          // Set the selected template type
          setSelectedTemplate(pendingTemplate.selectedTemplate);

          // Wait for templates to load and then start the story
          setTimeout(() => {
            startStory(pendingTemplate.templateId);
          }, 500); // Give time for templates to load
        } catch (error) {
          console.error('Error processing pending template:', error);
        }
      }
    }
  }, [startStory]);

  const fetchTemplates = async (type: 'story' | 'drawing') => {
    try {
      setIsLoading(true);
      const activityType = type === 'story' ? 'WRITE_FOR_DRAWING' : 'ILLUSTRATE';
      const response = await templateService.getTemplates(activityType);
      setTemplates(response.results);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('خطا در دریافت قالب‌ها. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const startStory = useCallback(async (templateId: string) => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const isAuthenticated = loginService.isAuthenticated();

      if (!isAuthenticated) {
        // Save the current selection and template to localStorage (only in browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem(
              'pendingTemplate',
              JSON.stringify({
                templateId,
                selectedTemplate,
              })
          );
        }

        // Redirect to login page with returnUrl pointing back to the template page
        router.push(`/login?redirect=${encodeURIComponent('/template')}`);
        return;
      }

      // User is authenticated, proceed with starting the story
      const response = await templateService.startStory(templateId);
      const storyId = response.story.id;

      if (selectedTemplate === 'drawing') {
        router.push(`/story/illustrate/${storyId}`);
      } else if (selectedTemplate === 'story') {
        router.push(`/story/${storyId}`);
      }
    } catch (error) {
      console.error('Error starting story:', error);
      toast.error('خطا در شروع داستان. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTemplate, router]);

  return (
      <div className={styles.templateContainer}>
        <Navbar logo={logo} />
        <Toaster position="top-center" />

        <div className={styles.contentWrapper}>
          {!selectedTemplate ? (
              <div className={styles.selectionContainer}>
                <h1 className={styles.title}>یک قالب انتخاب کنید</h1>
                <div className={styles.imageOptions}>
                  {/* Write Story option */}
                  <div
                      onClick={() => setSelectedTemplate("story")}
                      className={styles.imageContainer}
                  >
                    <Image
                        src={writeStoryImage}
                        alt="نوشتن داستان"
                        className={styles.templateImage}
                        width={400}
                        height={300}
                    />
                    <div className={styles.imageLabel}>نوشتن داستان</div>
                  </div>

                  {/* Draw Story option */}
                  <div
                      onClick={() => setSelectedTemplate("drawing")}
                      className={styles.imageContainer}
                  >
                    <Image
                        src={paintStoryImage}
                        alt="کشیدن عکس"
                        className={styles.templateImage}
                        width={400}
                        height={300}
                    />
                    <div className={styles.imageLabel}>کشیدن عکس</div>
                  </div>

                  {/* Complete Story option with Coming Soon overlay */}
                  <div className={`${styles.imageContainer} ${styles.comingSoonContainer}`}>
                    <div className={styles.comingSoonOverlay}>
                      <div className={styles.comingSoonContent}>
                        <FaClock className={styles.comingSoonIcon} />
                        <span className={styles.comingSoonText}>به زودی</span>
                      </div>
                    </div>
                    <Image
                        src={finishStoryImage}
                        alt="تمام داستان"
                        className={styles.templateImage}
                        width={400}
                        height={300}
                    />
                    <div className={styles.imageLabel}>داستان کامل</div>
                  </div>
                </div>

                {/* My Stories Section */}
                {loginService.isAuthenticated() && (
                    <div className={styles.myStoriesSection}>
                      <h2 className={styles.myStoriesTitle}>
                        <FaBook className={styles.myStoriesIcon} />
                        داستان‌های من
                      </h2>
                      {isLoadingStories ? (
                          <div className={styles.myStoriesLoading}>در حال بارگذاری...</div>
                      ) : stories.length === 0 ? (
                          <p className={styles.noStories}>هنوز داستانی ندارید. یکی از قالب‌های بالا را انتخاب کنید!</p>
                      ) : (
                          <div className={styles.myStoriesGrid}>
                            {stories.slice(0, 4).map((story) => (
                                <div
                                    key={story.id}
                                    className={styles.myStoryCard}
                                    onClick={() => router.push(`/story/${story.id}`)}
                                >
                                  <Image
                                      src={story.cover_image || placeholderImage}
                                      alt={story.title}
                                      width={200}
                                      height={150}
                                      className={styles.myStoryImage}
                                  />
                                  <h3 className={styles.myStoryTitle}>{story.title}</h3>
                                </div>
                            ))}
                          </div>
                      )}
                      {stories.length > 4 && (
                          <button
                              className={styles.viewAllButton}
                              onClick={() => router.push('/story')}
                          >
                            مشاهده همه داستان‌ها
                          </button>
                      )}
                      {stories.length > 0 && stories.length <= 4 && (
                          <button
                              className={styles.viewAllButton}
                              onClick={() => router.push('/story')}
                          >
                            مشاهده داستان‌ها
                          </button>
                      )}
                    </div>
                )}
              </div>
          ) : (
              <div className={styles.selectedTemplate}>
                <h2>
                  {selectedTemplate === "story" ? "نوشتن داستان" : "کشیدن عکس"}
                </h2>

                {isLoading && templates.length === 0 ? (
                    <LoadingSpinner message="در حال بارگذاری قالب‌ها..." />
                ) : templates.length === 0 ? (
                    <p>هیچ قالبی یافت نشد.</p>
                ) : (
                    <div className={styles.storyList}>
                      {templates.map((template) => (
                          <div
                              key={template.id}
                              className={`${styles.storyCard} ${isLoading ? styles.disabled : ''}`}
                              onClick={() => !isLoading && startStory(template.id)}
                          >
                            <div className={styles.cardContent}>
                              {template.cover_image ? (
                                  <div className={styles.coverImageContainer}>
                                    <Image
                                        src={template.cover_image}
                                        alt={template.title}
                                        width={240}
                                        height={160}
                                        className={styles.coverImage}
                                    />
                                  </div>
                              ) : (
                                  <div className={styles.iconContainer}>
                                    {selectedTemplate === "story" ? (
                                        <FaPen className={styles.storyIcon} />
                                    ) : (
                                        <FaPaintBrush className={styles.storyIcon} />
                                    )}
                                  </div>
                              )}
                              <h3 className={styles.storyTitle}>{template.title}</h3>
                              <p className={styles.storyDescription}>{template.description}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                )}

                <button
                    onClick={() => setSelectedTemplate(null)}
                    className={styles.backButton}
                    disabled={isLoading}
                >
                  بازگشت
                </button>
              </div>
          )}
        </div>

        <Footer />
      </div>
  );
};

export default TemplatePage;