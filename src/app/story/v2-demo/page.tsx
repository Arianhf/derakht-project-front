'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StoryPreviewV2 from '@/components/story/StoryPreviewV2';
import { Story, StoryPart } from '@/types/story';
import styles from './DemoPage.module.scss';

/**
 * StoryPreviewV2 Demo Page
 *
 * This page allows you to test all different layout configurations
 * of the StoryPreviewV2 component with mock data.
 *
 * URL: /story/v2-demo
 */

// Helper to create mock story parts
const createMockParts = (count: number): StoryPart[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-part-${i + 1}`,
    position: i + 1,
    text: `این متن داستان شماره ${i + 1} است. در این بخش از داستان، کودکان با ماجراهای جذاب و شخصیت‌های دوست‌داشتنی آشنا می‌شوند. هر صفحه داستان، پیامی آموزنده و سرگرم‌کننده برای کودکان دارد.\n\nمحتوای این بخش شامل توضیحات بیشتر و جزئیات داستان است که به کودکان کمک می‌کند تا داستان را بهتر درک کنند.`,
    illustration: `https://picsum.photos/seed/demo${i + 1}/800/600`,
    story_part_template: `template-${i + 1}`,
    created_at: new Date().toISOString(),
  }));
};

// Mock story configurations
const mockStories = {
  square20: {
    id: 'mock-square-20x20',
    title: 'داستان مربعی 20x20',
    activity_type: 'WRITE_FOR_DRAWING',
    author: 1,
    created_at: new Date().toISOString(),
    story_template: 'template-1',
    parts: createMockParts(4),
    cover_image: null,
    background_color: '#FFF9F5',
    font_color: '#2B463C',
    status: 'COMPLETED' as const,
    size: '20x20' as const,
    orientation: null,
  },
  square25: {
    id: 'mock-square-25x25',
    title: 'داستان مربعی 25x25',
    activity_type: 'WRITE_FOR_DRAWING',
    author: 1,
    created_at: new Date().toISOString(),
    story_template: 'template-2',
    parts: createMockParts(3),
    cover_image: null,
    background_color: '#E8F6FF',
    font_color: '#345BC0',
    status: 'COMPLETED' as const,
    size: '25x25' as const,
    orientation: null,
  },
  landscape: {
    id: 'mock-landscape',
    title: 'داستان مستطیلی افقی',
    activity_type: 'WRITE_FOR_DRAWING',
    author: 1,
    created_at: new Date().toISOString(),
    story_template: 'template-3',
    parts: createMockParts(5),
    cover_image: null,
    background_color: '#FFF7E5',
    font_color: '#FF6F61',
    status: 'COMPLETED' as const,
    size: '15x23' as const,
    orientation: 'LANDSCAPE' as const,
  },
  portrait: {
    id: 'mock-portrait',
    title: 'داستان مستطیلی عمودی',
    activity_type: 'WRITE_FOR_DRAWING',
    author: 1,
    created_at: new Date().toISOString(),
    story_template: 'template-4',
    parts: createMockParts(4),
    cover_image: null,
    background_color: '#2B463C',
    font_color: '#FFFFFF',
    status: 'COMPLETED' as const,
    size: '15x23' as const,
    orientation: 'PORTRAIT' as const,
  },
  default: {
    id: 'mock-default',
    title: 'داستان پیش‌فرض (بدون تنظیمات)',
    activity_type: 'WRITE_FOR_DRAWING',
    author: 1,
    created_at: new Date().toISOString(),
    story_template: 'template-5',
    parts: createMockParts(3),
    cover_image: null,
    background_color: null,
    font_color: null,
    status: 'COMPLETED' as const,
    size: null,
    orientation: null,
  },
};

const DemoPage: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const openPreview = (story: Story) => {
    setSelectedStory(story);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedStory(null);
  };

  return (
    <div className={styles.demoPage}>
      <div className={styles.header}>
        <h1>🎨 نمایش آزمایشی StoryPreviewV2</h1>
        <p className={styles.subtitle}>
          تمام حالت‌های مختلف نمایش داستان را آزمایش کنید
        </p>
      </div>

      <div className={styles.infoBox}>
        <h3>📱 نکات آزمایش:</h3>
        <ul>
          <li>روی هر کارت کلیک کنید تا داستان نمایش داده شود</li>
          <li>اندازه پنجره مرورگر را تغییر دهید تا حالت موبایل/دسکتاپ را ببینید</li>
          <li>در موبایل (کمتر از 768px): از دکمه‌های فلش یا حرکت انگشت استفاده کنید</li>
          <li>در دسکتاپ: از کلیدهای پیکان چپ/راست استفاده کنید</li>
          <li>کلید Escape برای بستن پیش‌نمایش</li>
        </ul>
      </div>

      <div className={styles.layoutGrid}>
        {/* Square 20x20 */}
        <div className={styles.layoutCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconSquare}>□</div>
            <h3>مربع 20×20</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.aspectDemo} style={{ paddingBottom: '100%' }}>
              <div className={styles.aspectInner}>1:1</div>
            </div>
            <p><strong>دسکتاپ:</strong> دو مربع کنار هم</p>
            <p><strong>موبایل:</strong> دو مربع روی هم</p>
            <button
              className={styles.testButton}
              onClick={() => openPreview(mockStories.square20)}
            >
              آزمایش این حالت
            </button>
          </div>
        </div>

        {/* Square 25x25 */}
        <div className={styles.layoutCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconSquare}>⬜</div>
            <h3>مربع 25×25</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.aspectDemo} style={{ paddingBottom: '100%' }}>
              <div className={styles.aspectInner}>1:1</div>
            </div>
            <p><strong>دسکتاپ:</strong> دو مربع کنار هم (بزرگ‌تر)</p>
            <p><strong>موبایل:</strong> دو مربع روی هم</p>
            <button
              className={styles.testButton}
              onClick={() => openPreview(mockStories.square25)}
            >
              آزمایش این حالت
            </button>
          </div>
        </div>

        {/* Landscape */}
        <div className={styles.layoutCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconLandscape}>▭</div>
            <h3>مستطیل افقی 15×23</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.aspectDemo} style={{ paddingBottom: '65.22%' }}>
              <div className={styles.aspectInner}>23:15</div>
            </div>
            <p><strong>دسکتاپ:</strong> دو مستطیل کنار هم</p>
            <p><strong>موبایل:</strong> یک صفحه با ناوبری</p>
            <button
              className={styles.testButton}
              onClick={() => openPreview(mockStories.landscape)}
            >
              آزمایش این حالت
            </button>
          </div>
        </div>

        {/* Portrait */}
        <div className={styles.layoutCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconPortrait}>▯</div>
            <h3>مستطیل عمودی 15×23</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.aspectDemo} style={{ paddingBottom: '153.33%' }}>
              <div className={styles.aspectInner}>15:23</div>
            </div>
            <p><strong>دسکتاپ:</strong> دو مستطیل کنار هم</p>
            <p><strong>موبایل:</strong> یک صفحه با ناوبری</p>
            <button
              className={styles.testButton}
              onClick={() => openPreview(mockStories.portrait)}
            >
              آزمایش این حالت
            </button>
          </div>
        </div>

        {/* Default */}
        <div className={styles.layoutCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconDefault}>?</div>
            <h3>پیش‌فرض (null)</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.aspectDemo} style={{ paddingBottom: '75%' }}>
              <div className={styles.aspectInner}>4:3</div>
            </div>
            <p><strong>دسکتاپ:</strong> دو باکس کنار هم</p>
            <p><strong>موبایل:</strong> دو باکس روی هم</p>
            <p className={styles.note}>برای زمانی که مقادیر تنظیم نشده‌اند</p>
            <button
              className={styles.testButton}
              onClick={() => openPreview(mockStories.default)}
            >
              آزمایش این حالت
            </button>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2>✨ ویژگی‌های اضافی</h2>
        <div className={styles.featuresList}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📱</div>
            <h4>واکنش‌گرا</h4>
            <p>خودکار بین حالت موبایل و دسکتاپ تغییر می‌کند</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>👆</div>
            <h4>حرکت لمسی</h4>
            <p>پشتیبانی از حرکات swipe در موبایل</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⌨️</div>
            <h4>کیبورد</h4>
            <p>ناوبری با کلیدهای پیکان</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎨</div>
            <h4>سفارشی‌سازی</h4>
            <p>رنگ پس‌زمینه و متن قابل تنظیم</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>♿</div>
            <h4>دسترسی‌پذیری</h4>
            <p>ARIA labels و کامل</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h4>نسبت تصویر</h4>
            <p>حفظ نسبت تصویر در تمام اندازه‌ها</p>
          </div>
        </div>
      </div>

      <div className={styles.linkSection}>
        <h2>🔗 پیوندهای مفید</h2>
        <div className={styles.links}>
          <Link href="/story" className={styles.link}>لیست داستان‌ها</Link>
          <a href="https://github.com" className={styles.link} target="_blank" rel="noopener noreferrer">
            مستندات GitHub
          </a>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedStory && (
        <StoryPreviewV2
          story={selectedStory}
          isOpen={isPreviewOpen}
          onClose={closePreview}
          isFullPage={false}
        />
      )}
    </div>
  );
};

export default DemoPage;
