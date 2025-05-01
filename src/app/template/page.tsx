"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar/Navbar";
import logo from "@/assets/images/logo2.png";
import styles from "./template.module.scss";
import { templateService } from "@/services/templateService";
import { loginService } from "@/services/loginService";
import Image from "next/image";
import { toast } from "react-hot-toast";

// Import images
import writeStoryImage from "../../../public/images/writeStory.jpg";
import paintStoryImage from "../../../public/images/paintStory.jpg";
import finishStoryImage from "../../../public/images/finishStory.jpg";

// Icons
import { FaBook, FaPaintBrush } from "react-icons/fa";

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
}

interface TemplateResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Template[];
}

const TemplatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<"story" | "drawing" | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedTemplate) {
      fetchTemplates(selectedTemplate);
    }
  }, [selectedTemplate]);

  // Check for pending template selection on component mount
  useEffect(() => {
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
          console.error("Error processing pending template:", error);
        }
      }
    }
  }, []);

  const fetchTemplates = async (type: "story" | "drawing") => {
    try {
      setIsLoading(true);
      const activityType = type === "story" ? "WRITE_FOR_DRAWING" : "ILLUSTRATE";
      const response = await templateService.getTemplates(activityType);
      setTemplates(response.results);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("خطا در دریافت قالب‌ها. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const startStory = async (templateId: string) => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const isAuthenticated = loginService.isAuthenticated();

      if (!isAuthenticated) {
        // Save the current selection and template to localStorage
        localStorage.setItem('pendingTemplate', JSON.stringify({
          templateId,
          selectedTemplate
        }));

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
      console.error("Error starting story:", error);
      toast.error("خطا در شروع داستان. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className={styles.templateContainer}>
        <Navbar logo={logo} />

        <div className={styles.contentWrapper}>
          {!selectedTemplate ? (
              <div className={styles.selectionContainer}>
                <h1 className={styles.title}>یک قالب انتخاب کنید</h1>
                <div className={styles.imageOptions}>
                  <div className={styles.imageContainer}>
                    <Image src={finishStoryImage} alt="تمام داستان" className={styles.templateImage}/>
                  </div>
                  <div onClick={() => setSelectedTemplate("drawing")} className={styles.imageContainer}>
                    <Image src={paintStoryImage} alt="کشیدن عکس" className={styles.templateImage}/>
                  </div>
                  <div onClick={() => setSelectedTemplate("story")} className={styles.imageContainer}>
                    <Image src={writeStoryImage} alt="نوشتن داستان" className={styles.templateImage}/>
                  </div>
                </div>
              </div>
          ) : (
              <div className={styles.selectedTemplate}>
                <h2>{selectedTemplate === "story" ? "نوشتن داستان" : "کشیدن عکس"}</h2>
                <div className={styles.storyList}>
                  {templates.map((template) => (
                      <div
                          key={template.id}
                          className={`${styles.storyCard} ${isLoading ? styles.disabled : ''}`}
                          onClick={() => !isLoading && startStory(template.id)}
                      >
                        <div className={styles.iconContainer}>
                          {selectedTemplate === "story" ? <FaBook className={styles.storyIcon} /> : <FaPaintBrush className={styles.storyIcon} />}
                        </div>
                        <h3 className={styles.storyTitle}>{template.title}</h3>
                        <p className={styles.storyDescription}>{template.description}</p>
                      </div>
                  ))}
                </div>
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
      </div>
  );
};

export default TemplatePage;