/**
 * Standard canvas sizes for story layouts
 * These sizes ensure consistent canvas dimensions across all devices
 */

export const STANDARD_CANVAS_SIZES = {
  square: { width: 1000, height: 1000 }, // 1:1 ratio
  landscapeRectangle: { width: 1000, height: 652 }, // 23:15 ratio (≈1.53)
  portraitRectangle: { width: 652, height: 1000 }, // 15:23 ratio (≈0.65)
  default: { width: 1000, height: 750 }, // 4:3 ratio
} as const;

export type CanvasLayoutType = keyof typeof STANDARD_CANVAS_SIZES;

/**
 * Get standard canvas size for a given layout type
 */
export function getStandardCanvasSize(layoutType: CanvasLayoutType) {
  return STANDARD_CANVAS_SIZES[layoutType];
}
