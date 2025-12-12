'use client';

import React, { useState } from 'react';
import IllustrationEditorV2 from '@/components/illustration/IllustrationEditorV2';
import { Story } from '@/types/story';
import { toast, Toaster } from 'react-hot-toast';

/**
 * Test page for the IllustrationEditorV2 component
 * This allows you to test the canvas drawing functionality
 */
const IllustrationTestPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Mock story data for testing
  const mockStory: Story = {
    id: 'test-story-1',
    title: 'داستان تست تصویرسازی',
    activity_type: 'WRITE_FOR_DRAWING',
    author: 1,
    created_at: new Date().toISOString(),
    story_template: 'test-template',
    cover_image: null,
    background_color: '#FFFFFF',
    font_color: '#2B463C',
    status: 'DRAFT',
    orientation: 'PORTRAIT',
    size: '20x20',
    parts: [
      {
        id: 'part-1',
        position: 1,
        text: 'روزی روزگاری در جنگلی دور افتاده، یک خرگوش کوچک زندگی می‌کرد. او دوست داشت بازی کند و با دوستانش سرگرم شود.',
        story_part_template: 'template-1',
        illustration: null,
        canvas_data: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'part-2',
        position: 2,
        text: 'یک روز خرگوش کوچک تصمیم گرفت به ماجراجویی برود. او کوله‌پشتی خود را برداشت و راهی جنگل شد.',
        story_part_template: 'template-2',
        illustration: null,
        canvas_data: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'part-3',
        position: 3,
        text: 'در مسیر، خرگوش با یک پرنده زیبا آشنا شد. پرنده به او کمک کرد تا راه خانه را پیدا کند.',
        story_part_template: 'template-3',
        illustration: null,
        canvas_data: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'part-4',
        position: 4,
        text: 'سرانجام خرگوش به خانه رسید. او از ماجراجویی‌اش خیلی خوشحال بود و برای دوستانش قصه تعریف کرد.',
        story_part_template: 'template-4',
        illustration: null,
        canvas_data: null,
        created_at: new Date().toISOString(),
      },
    ],
  };

  const handleSave = async (illustrations: { [key: number]: { canvasData: string; imageData: string } }) => {
    console.log('Saving illustrations:', illustrations);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('تصاویر با موفقیت ذخیره شد!');
  };

  const handleClose = () => {
    setIsOpen(false);
    toast.success('ویرایشگر بسته شد');
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <Toaster position="top-center" />

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#2B463C' }}>
          صفحه تست ویرایشگر تصویرسازی
        </h1>

        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666', direction: 'rtl' }}>
          این صفحه برای تست ویرایشگر تصویرسازی ساخته شده است. روی دکمه زیر کلیک کنید تا ویرایشگر را باز کنید.
        </p>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            backgroundColor: '#345BC0',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(52, 91, 192, 0.3)',
            fontFamily: 'Vazirmatn, sans-serif',
            fontWeight: '600',
          }}
        >
          باز کردن ویرایشگر تصویرسازی
        </button>

        <div style={{ marginTop: '40px', textAlign: 'right', direction: 'rtl' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#2B463C' }}>
            راهنمای استفاده:
          </h2>
          <ul style={{ fontSize: '16px', color: '#666', lineHeight: '2' }}>
            <li>برای تصویرسازی، از ابزارهای قلم و پاک‌کن استفاده کنید</li>
            <li>می‌توانید رنگ و اندازه قلم را تغییر دهید</li>
            <li>با دکمه‌های بعدی و قبلی بین بخش‌های مختلف داستان حرکت کنید</li>
            <li>برای ذخیره تغییرات روی دکمه ذخیره کلیک کنید</li>
            <li>در موبایل می‌توانید با سوایپ کردن بین صفحات جابجا شوید</li>
          </ul>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#345BC0' }}>
            ویژگی‌های ویرایشگر:
          </h3>
          <ul style={{ fontSize: '14px', color: '#666', textAlign: 'right', direction: 'rtl' }}>
            <li>کنواس رسم با Fabric.js</li>
            <li>ابزارهای قلم و پاک‌کن</li>
            <li>انتخاب رنگ و اندازه قلم</li>
            <li>دکمه‌های لغو و پاک کردن</li>
            <li>نمایش واکنش‌گرا (Responsive) برای موبایل و دسکتاپ</li>
            <li>ذخیره‌سازی حالت کنواس به صورت JSON</li>
            <li>نمایش متن داستان در کنار کنواس رسم</li>
          </ul>
        </div>
      </div>

      <IllustrationEditorV2
        story={mockStory}
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        isFullPage={false}
      />
    </div>
  );
};

export default IllustrationTestPage;
