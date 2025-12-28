'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './DrawingCanvas.module.scss';
import DrawingToolbar from './DrawingToolbar';
import { toast } from 'react-hot-toast';
import { compressImage, blobToFile, formatFileSize } from '@/utils/imageCompression';
import { validateImageFile } from '@/utils/imageValidation';
import { storyService } from '@/services/storyService';

export interface DrawingCanvasProps {
  /** Initial canvas state in JSON format */
  initialState?: string;
  /** Callback when canvas state changes */
  onChange?: (canvasJSON: string) => void;
  /** Width of the canvas in pixels */
  width?: number;
  /** Height of the canvas in pixels */
  height?: number;
  /** Background color of the canvas */
  backgroundColor?: string;
  /** Template ID (required for uploading images) */
  templateId?: string;
  /** Part index (required for uploading images) */
  partIndex?: number;
}

type DrawingTool = 'brush' | 'eraser' | 'select';

export interface DrawingCanvasRef {
  exportAsImage: () => string;
  getCanvasJSON: () => string;
  clearCanvas: () => void;
  addImage: (file: File) => void;
  addImageFromUrl: (url: string) => void;
}

/**
 * DrawingCanvas - A canvas-based drawing editor using Fabric.js
 * Supports drawing with brush, eraser, and color selection
 */
const DrawingCanvas = React.forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({
  initialState,
  onChange,
  width,
  height,
  backgroundColor = '#FFFFFF',
  templateId,
  partIndex,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const fabricLibRef = useRef<any>(null);
  const dimensionsCalculatedRef = useRef(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [currentTool, setCurrentTool] = useState<DrawingTool>('select');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#2B463C');

  /**
   * Expose methods to parent component via ref
   */
  React.useImperativeHandle(ref, () => ({
    exportAsImage: () => {
      if (!fabricCanvasRef.current) return '';
      return fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
      });
    },
    getCanvasJSON: () => {
      if (!fabricCanvasRef.current) return '{}';
      return JSON.stringify(fabricCanvasRef.current.toJSON());
    },
    clearCanvas: () => {
      if (!fabricCanvasRef.current) return;
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = backgroundColor;
      fabricCanvasRef.current.renderAll();
      if (onChange) {
        const json = JSON.stringify(fabricCanvasRef.current.toJSON());
        onChange(json);
      }
    },
    addImage: async (file: File) => {
      if (!fabricCanvasRef.current || !fabricLibRef.current) return;

      // Check if templateId and partIndex are provided
      if (!templateId || partIndex === undefined) {
        toast.error('اطلاعات قالب موجود نیست. لطفاً قالب را ذخیره کنید.');
        return;
      }

      try {
        // Step 1: Validate image
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error || 'فایل نامعتبر است');
          return;
        }

        // Step 2: Compress image
        const compressToastId = toast.loading('در حال فشرده‌سازی تصویر...');
        const compressionResult = await compressImage(file, {
          maxWidth: 2400,      // High quality for modern displays
          maxHeight: 2400,     // Supports 4K and retina
          quality: 0.88,       // High quality - minimal visible loss
          outputFormat: 'image/jpeg'
        });

        const compressedFile = blobToFile(
          compressionResult.blob,
          file.name,
          'jpg'
        );

        toast.success(
          `تصویر فشرده شد (${formatFileSize(compressionResult.originalSize)} → ${formatFileSize(compressionResult.compressedSize)})`,
          { id: compressToastId }
        );

        // Step 3: Upload to backend
        const uploadToastId = toast.loading('در حال آپلود تصویر...');
        const uploadResult = await storyService.uploadTemplateImage(
          templateId,
          partIndex,
          compressedFile
        );
        toast.success('تصویر آپلود شد', { id: uploadToastId });

        // Step 4: Add to canvas using URL (not base64)
        addImageToCanvas(uploadResult.url, uploadResult.id);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        const errorMessage = error?.response?.data?.error || 'خطا در آپلود تصویر';
        toast.error(errorMessage);
      }
    },
    addImageFromUrl: (url: string) => {
      addImageToCanvas(url);
    },
  }));

  /**
   * Load Fabric.js dynamically (client-side only)
   */
  useEffect(() => {
    const loadFabric = async () => {
      try {
        console.log('Loading Fabric.js module...');
        const fabricModule = await import('fabric');
        console.log('Fabric.js module loaded:', fabricModule);

        fabricLibRef.current = fabricModule;
        console.log('Fabric instance stored:', !!fabricLibRef.current);

        setIsFabricLoaded(true);
      } catch (error) {
        console.error('Error loading Fabric.js:', error);
        toast.error('خطا در بارگذاری کتابخانه کنواس');
      }
    };

    loadFabric();
  }, []);

  /**
   * Calculate canvas dimensions from container
   * If width/height props are provided, scale them to fit within container while maintaining aspect ratio
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
          let newWidth: number;
          let newHeight: number;

          if (width && height) {
            // If width and height props are provided, scale to fit container while maintaining aspect ratio
            const scaleX = rect.width / width;
            const scaleY = rect.height / height;
            const scale = Math.min(scaleX, scaleY);

            newWidth = Math.floor(width * scale);
            newHeight = Math.floor(height * scale);

            console.log('Scaling canvas to fit container:', {
              standardSize: { width, height },
              containerSize: { width: rect.width, height: rect.height },
              scale,
              scaledSize: { width: newWidth, height: newHeight },
            });
          } else {
            // Fallback to container dimensions if no props provided
            newWidth = rect.width;
            newHeight = rect.height;

            console.log('Using container dimensions:', { width: newWidth, height: newHeight });
          }

          setCanvasDimensions({ width: newWidth, height: newHeight });
          dimensionsCalculatedRef.current = true;
        }
      }
    };

    const timer = setTimeout(updateDimensions, 200);

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [width, height]);

  /**
   * Initialize Fabric.js canvas
   */
  useEffect(() => {
    if (!canvasRef.current || !isFabricLoaded || !fabricLibRef.current) {
      console.log('Canvas initialization skipped:', {
        hasRef: !!canvasRef.current,
        isFabricLoaded,
        hasFabric: !!fabricLibRef.current
      });
      return;
    }

    if (!dimensionsCalculatedRef.current ||
        canvasDimensions.width === 0 ||
        canvasDimensions.height === 0) {
      console.log('Waiting for valid container dimensions...', canvasDimensions);
      return;
    }

    if (fabricCanvasRef.current) {
      console.log('Canvas already initialized, skipping');
      return;
    }

    console.log('Initializing Fabric canvas with dimensions:', canvasDimensions);

    const { Canvas, PencilBrush } = fabricLibRef.current;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor,
      isDrawingMode: false,
      selection: true,
      enableRetinaScaling: true,
    });

    // Set up the drawing brush
    const brush = new PencilBrush(canvas);
    brush.width = brushSize;
    brush.color = brushColor;
    canvas.freeDrawingBrush = brush;

    fabricCanvasRef.current = canvas;
    console.log('Canvas created with drawing mode enabled');
    setIsCanvasReady(true);

    // Load initial state if provided
    if (initialState) {
      try {
        console.log('Loading initial canvas state...');
        canvas.loadFromJSON(initialState, () => {
          canvas.renderAll();
          console.log('Initial state loaded');
        });
      } catch (error) {
        console.error('Error loading canvas state:', error);
        toast.error('خطا در بارگذاری وضعیت کنواس');
      }
    }

    // Event handlers
    const handlePathCreated = () => {
      if (onChange) {
        const json = JSON.stringify(canvas.toJSON());
        onChange(json);
      }
    };

    const handleObjectModified = () => {
      if (onChange) {
        const json = JSON.stringify(canvas.toJSON());
        onChange(json);
      }
    };

    canvas.on('path:created', handlePathCreated);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects && activeObjects.length > 0) {
          activeObjects.forEach((obj: any) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();

          if (onChange) {
            const json = JSON.stringify(canvas.toJSON());
            onChange(json);
          }

          toast.success('شیء حذف شد');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFabricLoaded, canvasDimensions]);

  /**
   * Update canvas dimensions when container size changes
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    console.log('Updating canvas dimensions to:', canvasDimensions);
    fabricCanvasRef.current.setDimensions({
      width: canvasDimensions.width,
      height: canvasDimensions.height,
    });
    fabricCanvasRef.current.renderAll();
  }, [canvasDimensions]);

  /**
   * Update brush properties when tool settings change
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const brush = canvas.freeDrawingBrush;

    if (currentTool === 'brush') {
      brush.color = brushColor;
      brush.width = brushSize;
      canvas.isDrawingMode = true;
      canvas.selection = false;
      // Disable object selection in drawing mode
      canvas.forEachObject((obj: any) => {
        obj.selectable = false;
      });
    } else if (currentTool === 'eraser') {
      // Eraser is just a white brush (or matches background)
      brush.color = backgroundColor;
      brush.width = brushSize * 2; // Eraser is typically larger
      canvas.isDrawingMode = true;
      canvas.selection = false;
      // Disable object selection in eraser mode
      canvas.forEachObject((obj: any) => {
        obj.selectable = false;
      });
    } else if (currentTool === 'select') {
      // Enable selection mode, disable drawing
      canvas.isDrawingMode = false;
      canvas.selection = true;
      // Enable object selection and movement
      canvas.forEachObject((obj: any) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }

    canvas.renderAll();
  }, [currentTool, brushSize, brushColor, backgroundColor]);

  /**
   * Cleanup canvas on unmount
   */
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        console.log('Component unmounting, cleaning up canvas...');
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
        setIsCanvasReady(false);
      }
    };
  }, []);

  /**
   * Add an image to the canvas from a URL or data URL
   * @param url - Image URL
   * @param imageId - Optional template image ID for cleanup tracking
   */
  const addImageToCanvas = useCallback((url: string, imageId?: string) => {
    if (!fabricCanvasRef.current || !fabricLibRef.current) {
      toast.error('کنواس آماده نیست');
      return;
    }

    const canvas = fabricCanvasRef.current;
    const { FabricImage } = fabricLibRef.current;

    // Load image
    FabricImage.fromURL(url, {
      crossOrigin: 'anonymous',
    }).then((img: any) => {
      // Scale image to fit canvas if it's too large
      const maxWidth = canvas.width * 0.5;
      const maxHeight = canvas.height * 0.5;

      if (img.width > maxWidth || img.height > maxHeight) {
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        img.scale(scale);
      }

      // Center the image and add metadata
      const imageProps: any = {
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
      };

      // Store template image ID if provided (for cleanup tracking)
      if (imageId) {
        imageProps.templateImageId = imageId;
      }

      img.set(imageProps);

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      if (onChange) {
        const json = JSON.stringify(canvas.toJSON());
        onChange(json);
      }

      toast.success('تصویر اضافه شد');
    }).catch((error: Error) => {
      console.error('Error loading image:', error);
      toast.error('خطا در بارگذاری تصویر');
    });
  }, [onChange]);

  /**
   * Clear the entire canvas
   */
  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.clear();
    fabricCanvasRef.current.backgroundColor = backgroundColor;
    fabricCanvasRef.current.renderAll();

    if (onChange) {
      const json = JSON.stringify(fabricCanvasRef.current.toJSON());
      onChange(json);
    }

    toast.success('کنواس پاک شد');
  }, [backgroundColor, onChange]);

  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();

    if (objects.length > 0) {
      canvas.remove(objects[objects.length - 1]);
      canvas.renderAll();

      if (onChange) {
        const json = JSON.stringify(canvas.toJSON());
        onChange(json);
      }

      toast.success('عملیات لغو شد');
    }
  }, [onChange]);

  /**
   * Export canvas as image data URL
   */
  const exportAsImage = useCallback((): string => {
    if (!fabricCanvasRef.current) return '';
    return fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
    });
  }, []);

  /**
   * Export canvas state as JSON
   */
  const getCanvasJSON = useCallback((): string => {
    if (!fabricCanvasRef.current) return '{}';
    return JSON.stringify(fabricCanvasRef.current.toJSON());
  }, []);

  /**
   * Load canvas from JSON state
   */
  const loadFromJSON = useCallback((json: string) => {
    if (!fabricCanvasRef.current) return;

    try {
      fabricCanvasRef.current.loadFromJSON(json, () => {
        fabricCanvasRef.current?.renderAll();
      });
      toast.success('وضعیت بارگذاری شد');
    } catch (error) {
      console.error('Error loading JSON:', error);
      toast.error('خطا در بارگذاری وضعیت');
    }
  }, []);

  /**
   * Handle image upload from toolbar
   */
  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        addImageToCanvas(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  }, [addImageToCanvas]);

  return (
    <div className={styles.canvasEditorWrapper}>
      <div ref={containerRef} className={styles.canvasContainer}>
        {(!isFabricLoaded || !dimensionsCalculatedRef.current) ? (
          <div className={styles.loadingState}>
            <p>در حال بارگذاری ویرایشگر...</p>
          </div>
        ) : (
          <>
            <canvas ref={canvasRef} />

            {/* Floating toolbar overlay */}
            <div className={styles.floatingToolbar}>
              <DrawingToolbar
                currentTool={currentTool}
                brushSize={brushSize}
                brushColor={brushColor}
                onToolChange={setCurrentTool}
                onBrushSizeChange={setBrushSize}
                onBrushColorChange={setBrushColor}
                onClear={clearCanvas}
                onUndo={undo}
                onImageUpload={handleImageUpload}
                isCanvasReady={isCanvasReady}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
