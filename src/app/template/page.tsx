"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import logo from "@/assets/images/logo2.png";
import styles from "./template.module.scss";
import { FaBook, FaPaintBrush } from "react-icons/fa";
import { templateService } from "@/services/templateService";

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
  const router = useRouter();

  useEffect(() => {
    if (selectedTemplate) {
      fetchTemplates(selectedTemplate);
    }
  }, [selectedTemplate]);

  const fetchTemplates = async (type: "story" | "drawing") => {
    try {
      const activityType = type === "story" ? "WRITE_FOR_DRAWING" : "ILLUSTRATE";
      const response = await templateService.getTemplates(activityType);
      setTemplates(response.results);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const startStory = async (templateId: string) => { // Change parameter type to string
    try {
      const response = await templateService.startStory(templateId);
      const storyId = response.story.id;
      router.push(`/story/${storyId}`);
    } catch (error) {
      console.error("Error starting story:", error);
    }
  };

  return (
      <div className={styles.templateContainer}>
        <Navbar logo={logo} />

        <div className={styles.contentWrapper}>
          {!selectedTemplate ? (
              <div className={styles.selectionContainer}>
                <h1 className={styles.title}>یک قالب انتخاب کنید</h1>

                <div className={styles.templateOptions}>
                  <button onClick={() => setSelectedTemplate("story")} className={styles.templateButton}>
                    نوشتن داستان
                  </button>
                  <button onClick={() => setSelectedTemplate("drawing")} className={styles.templateButton}>
                    کشیدن عکس
                  </button>
                </div>
              </div>
          ) : (
              <div className={styles.selectedTemplate}>
                <h2>{selectedTemplate === "story" ? "نوشتن داستان" : "کشیدن عکس"}</h2>
                <div className={styles.storyList}>
                  {templates.map((template) => (
                      <div key={template.id} className={styles.storyCard}>
                        {selectedTemplate === "story" ? <FaBook className={styles.storyIcon} /> : <FaPaintBrush className={styles.storyIcon} />}
                        <button onClick={() => startStory(template.id)} className={styles.storyLink}>
                          {template.title}
                        </button>
                      </div>
                  ))}
                </div>
                <button onClick={() => setSelectedTemplate(null)} className={styles.backButton}>
                  بازگشت
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default TemplatePage;