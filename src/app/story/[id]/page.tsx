'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { storyService } from '@/services/storyService';
import { Story } from '@/types/story';
import Image from 'next/image';
import logo from '@/assets/images/logo2.png';
import { Navbar } from '@/components/shared/Navbar';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import './story.scss';

const StoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [template, setTemplate] = useState<Story | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyName, setStoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;

      try {
        const response = await storyService.getStoryById(id);
        setTemplate(response);
        setTexts(response.parts.map((part) => part.text || ''));
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

  const handleNextImage = async () => {
    if (!template) return;

    const currentPart = template.parts[selectedIndex];
    try {
      await storyService.addStoryPart(template.id, currentPart.story_part_template, texts[selectedIndex]);
      if (selectedIndex < template.parts.length - 1) {
        setSelectedIndex((prev) => prev + 1);
      } else {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error saving part:', err);
      alert('خطا در ذخیره قسمت داستان');
    }
  };

  const handleFinishStory = async () => {
    if (!template) return;

    try {
      await storyService.finishStory(template.id, storyName);
      setIsModalOpen(false);
      router.push('/stories');
    } catch (err) {
      console.error('Error finishing story:', err);
      alert('خطا در پایان داستان');
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>{error}</div>;
  if (!template) return <div>قالب داستان یافت نشد</div>;

  return (
    <div className="story-page">
      <Navbar logo={logo} />
      <div className="page-content">
        <div className="right-content">
          <div className="image-container">
            <Image
              src={template.parts[selectedIndex]?.illustration || ''}
              alt={`تصویر ${selectedIndex + 1}`}
              className="story-image"
              width={600}
              height={400}
              layout="responsive"
            />
          </div>
        </div>

        <div className="story-container">
          <textarea
            value={texts[selectedIndex]}
            onChange={handleTextChange}
            placeholder="داستان خود را بنویسید..."
            className="story-input"
          />
          <div className="button-container">
            <button
              className="prev-button"
              onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedIndex === 0}
            >
              قبلی
            </button>
            <button className="submit-button" onClick={handleNextImage}>
              {selectedIndex === template.parts.length - 1 ? 'پایان' : 'ادامه'}
            </button>
          </div>
        </div>

        <div className="left-content">
          <div className="image-gallery">
            {template.parts.map((part, index) => (
              <div key={part.id} className="gallery-item">
                {selectedIndex === index && (
                  <span className="image-number">{toPersianNumber(index + 1)}</span>
                )}
                <Image
                  src={part.illustration || ''}
                  alt={`تصویر ${index + 1}`}
                  className={`gallery-image ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                  width={100}
                  height={100}
                  layout="responsive"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>نام داستان را وارد کنید</h2>
            <input
              type="text"
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
              placeholder="نام داستان"
              className="story-name-input"
            />
            <button className="modal-button" onClick={handleFinishStory}>
              تایید
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPage;
