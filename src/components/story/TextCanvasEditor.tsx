'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import styles from './TextCanvasEditor.module.scss';
import CanvasToolbar from './CanvasToolbar';
import { toast } from 'react-hot-toast';

export interface TextCanvasEditorProps {
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

export interface CanvasTextObject extends fabric.IText {
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
  skewX?: number;
  skewY?: number;
}

/**
 * TextCanvasEditor - A canvas-based text editor using Fabric.js
 * Supports Persian (RTL) text with full transformation capabilities
 */
const TextCanvasEditor: React.FC<TextCanvasEditorProps> = ({
  initialState,
  onChange,
  width = 800,
  height = 600,
  backgroundColor = '#FFFFFF',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  /**
   * Initialize Fabric.js canvas
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    setIsCanvasReady(true);

    // Load initial state if provided
    if (initialState) {
      try {
        canvas.loadFromJSON(initialState, () => {
          canvas.renderAll();
        });
      } catch (error) {
        console.error('Error loading canvas state:', error);
        toast.error('خطا در بارگذاری وضعیت کنواس');
      }
    }

    // Event handlers
    const handleSelectionCreated = (e: fabric.IEvent) => {
      setActiveObject(e.selected?.[0] || null);
    };

    const handleSelectionUpdated = (e: fabric.IEvent) => {
      setActiveObject(e.selected?.[0] || null);
    };

    const handleSelectionCleared = () => {
      setActiveObject(null);
    };

    const handleObjectModified = () => {
      if (onChange) {
        const json = JSON.stringify(canvas.toJSON());
        onChange(json);
      }
    };

    // Register event listeners
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:scaling', handleObjectModified);
    canvas.on('object:rotating', handleObjectModified);
    canvas.on('object:skewing', handleObjectModified);
    canvas.on('object:moving', handleObjectModified);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key - delete selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObj = canvas.getActiveObject();
        if (activeObj && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          deleteSelected();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:scaling', handleObjectModified);
      canvas.off('object:rotating', handleObjectModified);
      canvas.off('object:skewing', handleObjectModified);
      canvas.off('object:moving', handleObjectModified);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height, backgroundColor]);

  /**
   * Add a new text object to the canvas
   */
  const addText = useCallback(() => {
    if (!fabricCanvasRef.current) {
      toast.error('کنواس آماده نیست');
      return;
    }

    const canvas = fabricCanvasRef.current;
    const text = new fabric.IText('متن خود را بنویسید', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Vazir, sans-serif',
      fontSize: 24,
      fill: '#2B463C',
      direction: 'rtl',
      textAlign: 'right',
      editable: true,
      lockScalingFlip: false,
      cornerSize: 10,
      transparentCorners: false,
      borderColor: '#345BC0',
      cornerColor: '#345BC0',
      cornerStyle: 'circle',
    } as any);

    // Set control visibility
    text.setControlsVisibility({
      mt: true,  // middle top
      mb: true,  // middle bottom
      ml: true,  // middle left
      mr: true,  // middle right
      bl: true,  // bottom left
      br: true,  // bottom right
      tl: true,  // top left
      tr: true,  // top right
      mtr: true, // rotation handle
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    if (onChange) {
      const json = JSON.stringify(canvas.toJSON());
      onChange(json);
    }

    toast.success('متن جدید اضافه شد');
  }, [onChange]);

  /**
   * Delete the currently selected object
   */
  const deleteSelected = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObj = canvas.getActiveObject();

    if (!activeObj) {
      toast.error('لطفاً ابتدا یک شی را انتخاب کنید');
      return;
    }

    canvas.remove(activeObj);
    canvas.renderAll();

    if (onChange) {
      const json = JSON.stringify(canvas.toJSON());
      onChange(json);
    }

    toast.success('شی حذف شد');
  }, [onChange]);

  /**
   * Update the selected text object's font family
   */
  const updateFontFamily = useCallback((fontFamily: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObj = canvas.getActiveObject() as CanvasTextObject;

    if (!activeObj || activeObj.type !== 'i-text') {
      toast.error('لطفاً ابتدا یک متن را انتخاب کنید');
      return;
    }

    activeObj.set({ fontFamily });
    canvas.renderAll();

    if (onChange) {
      const json = JSON.stringify(canvas.toJSON());
      onChange(json);
    }
  }, [onChange]);

  /**
   * Update the selected text object's font size
   */
  const updateFontSize = useCallback((fontSize: number) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObj = canvas.getActiveObject() as CanvasTextObject;

    if (!activeObj || activeObj.type !== 'i-text') {
      toast.error('لطفاً ابتدا یک متن را انتخاب کنید');
      return;
    }

    // Validate font size range
    if (fontSize < 16 || fontSize > 72) {
      toast.error('اندازه فونت باید بین ۱۶ تا ۷۲ پیکسل باشد');
      return;
    }

    activeObj.set({ fontSize });
    canvas.renderAll();

    if (onChange) {
      const json = JSON.stringify(canvas.toJSON());
      onChange(json);
    }
  }, [onChange]);

  /**
   * Update the selected object's dimensions
   */
  const updateDimensions = useCallback((width?: number, height?: number) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObj = canvas.getActiveObject();

    if (!activeObj) {
      toast.error('لطفاً ابتدا یک شی را انتخاب کنید');
      return;
    }

    if (width !== undefined) {
      activeObj.set({ width: width / (activeObj.scaleX || 1) });
    }
    if (height !== undefined) {
      activeObj.set({ height: height / (activeObj.scaleY || 1) });
    }

    activeObj.setCoords();
    canvas.renderAll();

    if (onChange) {
      const json = JSON.stringify(canvas.toJSON());
      onChange(json);
    }
  }, [onChange]);

  /**
   * Update the selected object's skew
   */
  const updateSkew = useCallback((skewX?: number, skewY?: number) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObj = canvas.getActiveObject();

    if (!activeObj) {
      toast.error('لطفاً ابتدا یک شی را انتخاب کنید');
      return;
    }

    // Validate skew range
    if (skewX !== undefined && (skewX < -45 || skewX > 45)) {
      toast.error('مقدار skew X باید بین -۴۵ تا ۴۵ درجه باشد');
      return;
    }
    if (skewY !== undefined && (skewY < -45 || skewY > 45)) {
      toast.error('مقدار skew Y باید بین -۴۵ تا ۴۵ درجه باشد');
      return;
    }

    if (skewX !== undefined) {
      activeObj.set({ skewX });
    }
    if (skewY !== undefined) {
      activeObj.set({ skewY });
    }

    activeObj.setCoords();
    canvas.renderAll();

    if (onChange) {
      const json = JSON.stringify(canvas.toJSON());
      onChange(json);
    }
  }, [onChange]);

  /**
   * Toggle aspect ratio lock for the selected object
   */
  const toggleAspectRatioLock = useCallback((locked: boolean) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObj = canvas.getActiveObject();

    if (!activeObj) {
      toast.error('لطفاً ابتدا یک شی را انتخاب کنید');
      return;
    }

    activeObj.set({ lockUniScaling: locked });
    canvas.renderAll();
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
      <CanvasToolbar
        activeObject={activeObject as CanvasTextObject}
        onAddText={addText}
        onDeleteSelected={deleteSelected}
        onFontFamilyChange={updateFontFamily}
        onFontSizeChange={updateFontSize}
        onDimensionsChange={updateDimensions}
        onSkewChange={updateSkew}
        onAspectRatioLockChange={toggleAspectRatioLock}
        isCanvasReady={isCanvasReady}
      />
      <div className={styles.canvasContainer}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default TextCanvasEditor;
