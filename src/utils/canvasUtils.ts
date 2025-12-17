import { Story, StoryOrientation, StorySize } from '@/types/story';
import { CanvasLayoutType } from '@/constants/canvasSizes';

/**
 * Get canvas layout type from story configuration
 * Maps story size and orientation to standard canvas layout
 */
export function getLayoutTypeFromStory(story: Partial<Story>): CanvasLayoutType {
  const { size, orientation } = story;

  // Square layouts
  if (size === '20x20' || size === '25x25') {
    return 'square';
  }

  // Rectangle layouts based on orientation
  if (size === '15x23') {
    if (orientation === 'LANDSCAPE') {
      return 'landscapeRectangle'; // 23:15 ratio (wider)
    } else if (orientation === 'PORTRAIT') {
      return 'portraitRectangle'; // 15:23 ratio (taller)
    }
  }

  // Default fallback
  return 'default';
}
