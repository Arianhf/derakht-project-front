/**
 * Canvas Type Definitions
 *
 * Type wrappers for Fabric.js to provide better TypeScript support
 * and avoid explicit 'any' types in canvas-related components.
 */

/**
 * Drawing tool types for canvas editors
 */
export type DrawingToolType = 'brush' | 'eraser' | 'select';

/**
 * Base Fabric.js object properties
 * Represents common properties and methods available on Fabric.js objects
 */
export interface FabricObject {
  // Object type
  type?: string;

  // Position and dimensions
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;

  // Origin points for transformations
  originX?: 'left' | 'center' | 'right';
  originY?: 'top' | 'center' | 'bottom';

  // Styling
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;

  // Text-specific properties
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: string;

  // Skew transformations
  skewX?: number;
  skewY?: number;

  // Interaction properties
  selectable?: boolean;
  evented?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  lockRotation?: boolean;
  lockScalingX?: boolean;
  lockScalingY?: boolean;
  lockUniScaling?: boolean;

  // Custom properties for template tracking
  templateImageId?: string;

  // Methods
  set?: (props: Partial<FabricObject>) => void;
  scale?: (value: number) => void;
  setCoords?: () => void;
  setControlsVisibility?: (controls: Record<string, boolean>) => void;
  clone?: () => Promise<FabricObject>;
  toJSON?: () => Record<string, unknown>;
}

/**
 * Fabric.js Image object properties
 * Extends FabricObject with image-specific properties
 */
export interface FabricImage extends FabricObject {
  // Image source
  src?: string;

  // Cross-origin settings
  crossOrigin?: string | null;

  // Image filters
  filters?: unknown[];
}

/**
 * Fabric.js Canvas properties and methods
 * Represents the main canvas instance
 */
export interface FabricCanvas {
  // Canvas dimensions
  width?: number;
  height?: number;

  // Background
  backgroundColor?: string;
  backgroundImage?: FabricImage | null;

  // Drawing mode
  isDrawingMode?: boolean;
  freeDrawingBrush?: FabricBrush;

  // Selection
  selection?: boolean;

  // Methods
  add?: (object: FabricObject) => void;
  remove?: (object: FabricObject) => void;
  renderAll?: () => void;
  clear?: () => void;
  dispose?: () => void;
  setActiveObject?: (object: FabricObject) => void;
  getActiveObject?: () => FabricObject | null;
  getActiveObjects?: () => FabricObject[];
  discardActiveObject?: () => void;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  toJSON?: (propertiesToInclude?: string[]) => CanvasJSON;
  loadFromJSON?: (json: string | CanvasJSON, callback?: () => void) => void;
  toDataURL?: (options?: {
    format?: string;
    quality?: number;
    multiplier?: number;
  }) => string;
  setDimensions?: (dimensions: { width: number; height: number }) => void;
  calcOffset?: () => void;
  on?: (eventName: string, handler: (e: FabricEvent) => void) => void;
  off?: (eventName: string, handler?: (e: FabricEvent) => void) => void;
}

/**
 * Fabric.js Brush properties
 */
export interface FabricBrush {
  color?: string;
  width?: number;
  strokeLineCap?: string;
  strokeLineJoin?: string;
  strokeDashArray?: number[] | null;
  shadow?: unknown;
}

/**
 * Fabric.js event object
 */
export interface FabricEvent {
  target?: FabricObject;
  e?: Event;
  transform?: {
    corner?: string;
    original?: FabricObject;
    originX?: string;
    originY?: string;
  };
  [key: string]: unknown;
}

/**
 * Canvas JSON representation
 * Structure returned by canvas.toJSON()
 */
export interface CanvasJSON {
  version?: string;
  objects?: FabricObject[];
  background?: string;
  backgroundImage?: FabricImage | null;
  [key: string]: unknown;
}

/**
 * Canvas data with metadata
 * Used for storing canvas state with additional information
 */
export interface CanvasData {
  json: string | CanvasJSON;
  width?: number;
  height?: number;
  metadata?: {
    version?: string;
    createdAt?: string;
    modifiedAt?: string;
    [key: string]: unknown;
  };
}

/**
 * Text object properties for canvas text elements
 * Extends FabricObject with text-specific functionality
 */
export interface CanvasTextObject extends FabricObject {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  charSpacing?: number;
  textBackgroundColor?: string;
}

// Type guards

/**
 * Type guard to check if an object is a FabricObject
 */
export function isFabricObject(obj: unknown): obj is FabricObject {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('type' in obj || 'left' in obj || 'top' in obj)
  );
}

/**
 * Type guard to check if an object is a FabricImage
 */
export function isFabricImage(obj: unknown): obj is FabricImage {
  return (
    isFabricObject(obj) &&
    (obj.type === 'image' || 'src' in obj)
  );
}

/**
 * Type guard to check if an object is a CanvasTextObject
 */
export function isCanvasTextObject(obj: unknown): obj is CanvasTextObject {
  return (
    isFabricObject(obj) &&
    (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox' || 'text' in obj)
  );
}

/**
 * Type guard to check if a value is a valid DrawingToolType
 */
export function isDrawingToolType(value: unknown): value is DrawingToolType {
  return (
    typeof value === 'string' &&
    ['brush', 'eraser', 'select'].includes(value)
  );
}
