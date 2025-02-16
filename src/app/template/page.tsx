"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {Navbar} from "@/components/shared/Navbar";
import logo from "@/assets/images/logo2.png";
import styles from "./template.module.scss";

const stories = {
  story: [
    { id: 1, title: "داستان اول" },
    { id: 2, title: "داستان دوم" },
    { id: 3, title: "داستان سوم" },
  ],
  drawing: [
    { id: 1, title: "نقاشی اول" },
    { id: 2, title: "نقاشی دوم" },
    { id: 3, title: "نقاشی سوم" },
  ],
};

const TemplatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const router = useRouter();

  const navigateToStory = (id: number) => {
    router.push(`/story/${id}`);
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
            <ul className={styles.storyList}>
              {stories[selectedTemplate].map((story) => (
                <li key={story.id} className={styles.storyItem}>
                  <button onClick={() => navigateToStory(story.id)} className={styles.storyLink}>{story.title}</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedTemplate(null)} className={styles.backButton}>بازگشت</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePage;