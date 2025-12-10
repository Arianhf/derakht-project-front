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

type DrawingTool = 'brush' | 'eraser';

export interface DrawingCanvasRef {
  exportAsImage: () => string;
  getCanvasJSON: () => string;
  clearCanvas: () => void;
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
  const [currentTool, setCurrentTool] = useState<DrawingTool>('brush');
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

    const { Canvas, PencilBrush } = fabricLibRef.current;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor,
      isDrawingMode: true,
      selection: false,
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
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObj = canvas.getActiveObject();
        if (activeObj && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          clearCanvas();
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
    } else if (currentTool === 'eraser') {
      // Eraser is just a white brush (or matches background)
      brush.color = backgroundColor;
      brush.width = brushSize * 2; // Eraser is typically larger
      canvas.isDrawingMode = true;
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
