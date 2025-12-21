/**
 * StoryPreviewV2 - Usage Examples and Documentation
 *
 * This file demonstrates how to use the StoryPreviewV2 component
 * with different story configurations (sizes and orientations)
 */

'use client';

import React, { useState } from 'react';
import StoryPreviewV2 from './StoryPreviewV2';
import { Story, StoryPart } from '@/types/story';

// ====================
// EXAMPLE STORY DATA
// ====================

// Helper function to create story parts
const createStoryParts = (count: number): StoryPart[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `part-${i + 1}`,
    position: i + 1,
    canvas_text_data: { text: `این متن بخش ${i + 1} از داستان است. در این بخش، کودکان با شخصیت‌های جذاب و ماجراهای هیجان‌انگیز آشنا می‌شوند. هر بخش داستان، پیامی آموزنده و سرگرم‌کننده برای کودکان دارد.` },
    canvas_illustration_data: { imageUrl: `https://picsum.photos/seed/story${i + 1}/800/600` },
    story_part_template: `template-${i + 1}`,
    created_at: new Date().toISOString(),
  }));
};

// Example 1: Square story (20x20)
export const squareStory20x20: Story = {
  id: 'story-1',
  title: 'ماجرای جنگل جادویی',
  activity_type: 'WRITE_FOR_DRAWING',
  author: 1,
  created_at: new Date().toISOString(),
  story_template: 'template-1',
  parts: createStoryParts(4),
  cover_image: 'https://picsum.photos/seed/cover1/400/400',
  background_color: '#FFF9F5',
  font_color: '#2B463C',
  status: 'COMPLETED',
  size: '20x20',
  orientation: null, // Orientation doesn't matter for squares
};

// Example 2: Square story (25x25)
export const squareStory25x25: Story = {
  id: 'story-2',
  title: 'دوستان کوچک',
  activity_type: 'WRITE_FOR_DRAWING',
  author: 1,
  created_at: new Date().toISOString(),
  story_template: 'template-2',
  parts: createStoryParts(3),
  cover_image: 'https://picsum.photos/seed/cover2/400/400',
  background_color: '#E8F6FF',
  font_color: '#345BC0',
  status: 'COMPLETED',
  size: '25x25',
  orientation: null,
};

// Example 3: Landscape rectangle (15x23)
export const landscapeStory: Story = {
  id: 'story-3',
  title: 'سفر به کوهستان',
  activity_type: 'WRITE_FOR_DRAWING',
  author: 1,
  created_at: new Date().toISOString(),
  story_template: 'template-3',
  parts: createStoryParts(5),
  cover_image: 'https://picsum.photos/seed/cover3/800/600',
  background_color: '#FFF7E5',
  font_color: '#FF6F61',
  status: 'COMPLETED',
  size: '15x23',
  orientation: 'LANDSCAPE',
};

// Example 4: Portrait rectangle (15x23)
export const portraitStory: Story = {
  id: 'story-4',
  title: 'قصه شب',
  activity_type: 'WRITE_FOR_DRAWING',
  author: 1,
  created_at: new Date().toISOString(),
  story_template: 'template-4',
  parts: createStoryParts(4),
  cover_image: 'https://picsum.photos/seed/cover4/600/800',
  background_color: '#2B463C',
  font_color: '#FFFFFF',
  status: 'COMPLETED',
  size: '15x23',
  orientation: 'PORTRAIT',
};

// Example 5: Default/fallback (null values)
export const defaultStory: Story = {
  id: 'story-5',
  title: 'داستان پیش‌فرض',
  activity_type: 'WRITE_FOR_DRAWING',
  author: 1,
  created_at: new Date().toISOString(),
  story_template: 'template-5',
  parts: createStoryParts(3),
  cover_image: null,
  background_color: null,
  font_color: null,
  status: 'COMPLETED',
  size: null,
  orientation: null,
};

// ====================
// USAGE COMPONENT
// ====================

const StoryPreviewV2Examples: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story>(squareStory20x20);

  const openPreview = (story: Story) => {
    setCurrentStory(story);
    setIsOpen(true);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        نمونه‌های StoryPreviewV2
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Example 1 */}
        <div style={{ border: '2px solid #E0E0E0', borderRadius: '12px', padding: '24px' }}>
          <h3>مربع 20x20</h3>
          <p>داستان با اندازه مربعی 20x20. در موبایل به صورت عمودی و در دسکتاپ کنار هم نمایش داده می‌شود.</p>
          <button
            onClick={() => openPreview(squareStory20x20)}
            style={{
              padding: '12px 24px',
              background: '#FF6B9D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            مشاهده پیش‌نمایش
          </button>
        </div>

        {/* Example 2 */}
        <div style={{ border: '2px solid #E0E0E0', borderRadius: '12px', padding: '24px' }}>
          <h3>مربع 25x25</h3>
          <p>داستان با اندازه مربعی 25x25. مشابه 20x20 اما با اندازه متفاوت.</p>
          <button
            onClick={() => openPreview(squareStory25x25)}
            style={{
              padding: '12px 24px',
              background: '#4ECDC4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            مشاهده پیش‌نمایش
          </button>
        </div>

        {/* Example 3 */}
        <div style={{ border: '2px solid #E0E0E0', borderRadius: '12px', padding: '24px' }}>
          <h3>مستطیل افقی (Landscape)</h3>
          <p>داستان با اندازه 15x23 در حالت افقی. در موبایل تک‌صفحه‌ای با ناوبری.</p>
          <button
            onClick={() => openPreview(landscapeStory)}
            style={{
              padding: '12px 24px',
              background: '#FFD93D',
              color: '#2B463C',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            مشاهده پیش‌نمایش
          </button>
        </div>

        {/* Example 4 */}
        <div style={{ border: '2px solid #E0E0E0', borderRadius: '12px', padding: '24px' }}>
          <h3>مستطیل عمودی (Portrait)</h3>
          <p>داستان با اندازه 15x23 در حالت عمودی. در موبایل تک‌صفحه‌ای با ناوبری.</p>
          <button
            onClick={() => openPreview(portraitStory)}
            style={{
              padding: '12px 24px',
              background: '#9B59B6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            مشاهده پیش‌نمایش
          </button>
        </div>

        {/* Example 5 */}
        <div style={{ border: '2px solid #E0E0E0', borderRadius: '12px', padding: '24px' }}>
          <h3>پیش‌فرض (Fallback)</h3>
          <p>داستان بدون مقادیر orientation و size. از لایه پیش‌فرض استفاده می‌کند.</p>
          <button
            onClick={() => openPreview(defaultStory)}
            style={{
              padding: '12px 24px',
              background: '#95A5A6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            مشاهده پیش‌نمایش
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <StoryPreviewV2
        story={currentStory}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isFullPage={false}
      />
    </div>
  );
};

export default StoryPreviewV2Examples;

// ====================
// BASIC USAGE
// ====================

/**
 * Example 1: Basic modal usage
 *
 * ```tsx
 * import StoryPreviewV2 from '@/components/story/StoryPreviewV2';
 * import { Story } from '@/types/story';
 *
 * function MyComponent() {
 *   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
 *   const [story, setStory] = useState<Story | null>(null);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsPreviewOpen(true)}>
 *         نمایش داستان
 *       </button>
 *
 *       {story && (
 *         <StoryPreviewV2
 *           story={story}
 *           isOpen={isPreviewOpen}
 *           onClose={() => setIsPreviewOpen(false)}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */

/**
 * Example 2: Full-page usage
 *
 * ```tsx
 * import StoryPreviewV2 from '@/components/story/StoryPreviewV2';
 *
 * function StoryViewPage({ story }: { story: Story }) {
 *   return (
 *     <StoryPreviewV2
 *       story={story}
 *       isOpen={true}
 *       onClose={() => {}} // No close action needed
 *       isFullPage={true}
 *     />
 *   );
 * }
 * ```
 */

/**
 * Example 3: Fetching and displaying a story
 *
 * ```tsx
 * import { useEffect, useState } from 'react';
 * import StoryPreviewV2 from '@/components/story/StoryPreviewV2';
 * import { storyService } from '@/services/storyService';
 * import { Story } from '@/types/story';
 *
 * function StoryViewer({ storyId }: { storyId: string }) {
 *   const [story, setStory] = useState<Story | null>(null);
 *   const [isOpen, setIsOpen] = useState(false);
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     const fetchStory = async () => {
 *       try {
 *         const data = await storyService.getStoryById(storyId);
 *         setStory(data);
 *       } catch (error) {
 *         console.error('Error fetching story:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     fetchStory();
 *   }, [storyId]);
 *
 *   if (loading) return <div>در حال بارگذاری...</div>;
 *   if (!story) return <div>داستان یافت نشد</div>;
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>
 *         مشاهده داستان
 *       </button>
 *
 *       <StoryPreviewV2
 *         story={story}
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *       />
 *     </>
 *   );
 * }
 * ```
 */

// ====================
// KEY FEATURES
// ====================

/**
 * RESPONSIVE BEHAVIOR:
 *
 * Desktop (> 768px):
 * - Square sizes (20x20, 25x25): Text and image side by side
 * - Rectangle sizes (15x23): Text and image side by side
 * - Navigate through parts using arrow buttons or keyboard
 *
 * Mobile (<= 768px):
 * - Square sizes: Text and image stacked vertically
 * - Rectangle sizes: Single-page view with navigation between text/image
 * - Swipe gestures supported for navigation
 * - Large, colorful arrow buttons for kid-friendly navigation
 *
 * ASPECT RATIOS:
 * - 20x20 and 25x25: 1:1 (perfect squares)
 * - 15x23 Landscape: 23:15 (wider than tall)
 * - 15x23 Portrait: 15:23 (taller than wide)
 * - Default/null: 4:3 fallback ratio
 *
 * ACCESSIBILITY:
 * - Keyboard navigation (Arrow keys for next/prev, Escape to close)
 * - ARIA labels on all interactive elements
 * - Focus management with visible focus indicators
 * - Reduced motion support for users with motion sensitivity
 * - High contrast mode support
 *
 * CUSTOMIZATION:
 * - Background color per story
 * - Font color per story
 * - Cover image support
 * - Scrollable text content for long stories
 */

// ====================
// PROPS DOCUMENTATION
// ====================

/**
 * StoryPreviewV2Props:
 *
 * @param {Story} story - The story object containing all story data
 *   - Required fields: id, title, parts
 *   - Optional fields: size, orientation, background_color, font_color, cover_image
 *
 * @param {boolean} isOpen - Controls whether the preview is visible
 *
 * @param {() => void} onClose - Callback function when user closes the preview
 *
 * @param {boolean} [isFullPage=false] - Optional. If true, renders as full-page view
 *   without modal overlay and close button
 */
