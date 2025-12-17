'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './DrawingCanvas.module.scss';
import DrawingToolbar from './DrawingToolbar';
import { toast } from 'react-hot-toast';

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
}

type DrawingTool = 'brush' | 'eraser' | 'select';

export interface DrawingCanvasRef {
  exportAsImage: () => string;
  getCanvasJSON: () => string;
  clearCanvas: () => void;
  addImage: (file: File) => void;
  addImageFromUrl: (url: string) => void;
  bringToFront: () => void;
  sendToBack: () => void;
  bringForward: () => void;
  sendBackwards: () => void;
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
    addImage: (file: File) => {
      if (!fabricCanvasRef.current || !fabricLibRef.current) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          addImageToCanvas(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    },
    addImageFromUrl: (url: string) => {
      addImageToCanvas(url);
    },
    bringToFront: () => {
      if (!fabricCanvasRef.current) return;
      const activeObject = fabricCanvasRef.current.getActiveObject();
      if (activeObject) {
        fabricCanvasRef.current.bringToFront(activeObject);
        fabricCanvasRef.current.renderAll();
        if (onChange) {
          const json = JSON.stringify(fabricCanvasRef.current.toJSON());
          onChange(json);
        }
        toast.success('شیء به جلو آمد');
      } else {
        toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
      }
    },
    sendToBack: () => {
      if (!fabricCanvasRef.current) return;
      const activeObject = fabricCanvasRef.current.getActiveObject();
      if (activeObject) {
        fabricCanvasRef.current.sendToBack(activeObject);
        fabricCanvasRef.current.renderAll();
        if (onChange) {
          const json = JSON.stringify(fabricCanvasRef.current.toJSON());
          onChange(json);
        }
        toast.success('شیء به عقب رفت');
      } else {
        toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
      }
    },
    bringForward: () => {
      if (!fabricCanvasRef.current) return;
      const activeObject = fabricCanvasRef.current.getActiveObject();
      if (activeObject) {
        fabricCanvasRef.current.bringForward(activeObject);
        fabricCanvasRef.current.renderAll();
        if (onChange) {
          const json = JSON.stringify(fabricCanvasRef.current.toJSON());
          onChange(json);
        }
        toast.success('شیء یک لایه به جلو آمد');
      } else {
        toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
      }
    },
    sendBackwards: () => {
      if (!fabricCanvasRef.current) return;
      const activeObject = fabricCanvasRef.current.getActiveObject();
      if (activeObject) {
        fabricCanvasRef.current.sendBackwards(activeObject);
        fabricCanvasRef.current.renderAll();
        if (onChange) {
          const json = JSON.stringify(fabricCanvasRef.current.toJSON());
          onChange(json);
        }
        toast.success('شیء یک لایه به عقب رفت');
      } else {
        toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
      }
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
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = width || rect.width;
        const newHeight = height || rect.height;

        console.log('Container dimensions:', { width: rect.width, height: rect.height });
        console.log('Setting canvas dimensions:', { newWidth, newHeight });

        if (newWidth > 0 && newHeight > 0) {
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

    const { Canvas, PencilBrush, EraserBrush } = fabricLibRef.current;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor,
      isDrawingMode: false,
      selection: true,
      enableRetinaScaling: true,
    });

    // Set up the drawing brush
    const pencilBrush = new PencilBrush(canvas);
    pencilBrush.width = brushSize;
    pencilBrush.color = brushColor;
    canvas.freeDrawingBrush = pencilBrush;

    // Store eraser brush for later use
    const eraserBrush = new EraserBrush(canvas);
    eraserBrush.width = brushSize * 2;
    (canvas as any)._eraserBrush = eraserBrush;

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
    if (!fabricCanvasRef.current || !fabricLibRef.current) return;

    const canvas = fabricCanvasRef.current;
    const { PencilBrush, EraserBrush } = fabricLibRef.current;

    if (currentTool === 'brush') {
      // Use pencil brush for drawing
      if (!(canvas.freeDrawingBrush instanceof PencilBrush)) {
        const pencilBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush = pencilBrush;
      }
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushSize;
      canvas.isDrawingMode = true;
      canvas.selection = false;
      // Disable object selection in drawing mode
      canvas.forEachObject((obj: any) => {
        obj.selectable = false;
      });
    } else if (currentTool === 'eraser') {
      // Use proper EraserBrush for erasing
      if (!(canvas.freeDrawingBrush instanceof EraserBrush)) {
        const eraserBrush = new EraserBrush(canvas);
        canvas.freeDrawingBrush = eraserBrush;
      }
      canvas.freeDrawingBrush.width = brushSize * 2; // Eraser is typically larger
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
  }, [currentTool, brushSize, brushColor]);

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
   */
  const addImageToCanvas = useCallback((url: string) => {
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

      // Center the image
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
      });

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

  /**
   * Layering functions - bring to front, send to back
   */
  const bringToFront = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.bringToFront(activeObject);
      fabricCanvasRef.current.renderAll();
      if (onChange) {
        const json = JSON.stringify(fabricCanvasRef.current.toJSON());
        onChange(json);
      }
      toast.success('شیء به جلو آمد');
    } else {
      toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
    }
  }, [onChange]);

  const sendToBack = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.sendToBack(activeObject);
      fabricCanvasRef.current.renderAll();
      if (onChange) {
        const json = JSON.stringify(fabricCanvasRef.current.toJSON());
        onChange(json);
      }
      toast.success('شیء به عقب رفت');
    } else {
      toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
    }
  }, [onChange]);

  const bringForward = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.bringForward(activeObject);
      fabricCanvasRef.current.renderAll();
      if (onChange) {
        const json = JSON.stringify(fabricCanvasRef.current.toJSON());
        onChange(json);
      }
      toast.success('شیء یک لایه به جلو آمد');
    } else {
      toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
    }
  }, [onChange]);

  const sendBackwards = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.sendBackwards(activeObject);
      fabricCanvasRef.current.renderAll();
      if (onChange) {
        const json = JSON.stringify(fabricCanvasRef.current.toJSON());
        onChange(json);
      }
      toast.success('شیء یک لایه به عقب رفت');
    } else {
      toast.error('لطفا ابتدا یک شیء را انتخاب کنید');
    }
  }, [onChange]);

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
                onBringToFront={bringToFront}
                onSendToBack={sendToBack}
                onBringForward={bringForward}
                onSendBackwards={sendBackwards}
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
