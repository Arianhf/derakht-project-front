"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar/Navbar";
import logo from "@/assets/images/logo2.png";
import "./illustrate.scss";

const mockStory = {
  id: "mock-story-id",
  title: "داستان نقاشی کردنی تستی",
  author: 1,
  created_date: new Date().toISOString(),
  activity_type: "ILLUSTRATE",
  story_template: "template-id",
};

const mockTemplateParts = [
  {
    id: "part-1",
    position: 1,
    prompt_text: "این متن اولین یاروشه",
    illustration: null,
  },
  {
    id: "part-2",
    position: 2,
    prompt_text: "این متن دومیشه",
    illustration: null,
  },
  {
    id: "part-3",
    position: 3,
    prompt_text: "اینم متن سومیشه",
    illustration: null,
  },
];

const IllustrateStoryPage = () => {
  const router = useRouter();

  const [story] = useState(mockStory);
  const [templateParts] = useState(mockTemplateParts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<(File | null)[]>(
    Array(mockTemplateParts.length).fill(null)
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...images];
      newImages[currentIndex] = file;
      setImages(newImages);
    }
  };

  const handleNext = () => {
    if (currentIndex < templateParts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push("/stories");
    }
  };

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const currentPrompt = templateParts[currentIndex];

  return (
    <div style={{ height: "100vh" }}>
      <Navbar logo={logo} />
      <div className="illustrate-layout">
        <div className="text-block">
          <h2>متن شماره {currentIndex + 1}</h2>
          <p>{currentPrompt.prompt_text}</p>
          <div className="navigation-buttons">
            <button onClick={handlePrev} disabled={currentIndex === 0}>
              قبلی
            </button>
            <button onClick={handleNext}>
              {currentIndex === templateParts.length - 1 ? "پایان" : "ادامه"}
            </button>
          </div>
        </div>

        <div className="upload-block">
          <div className="custom-upload">
            انتخاب تصویر
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          {images[currentIndex] && (
            <p className="selected-file">
              تصویر انتخاب شد: {images[currentIndex]?.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IllustrateStoryPage;
