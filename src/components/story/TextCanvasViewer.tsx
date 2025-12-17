'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './TextCanvasViewer.module.scss';
import { toast } from 'react-hot-toast';
import { CanvasMetadata } from '@/types/story';

export interface TextCanvasViewerProps {
  /** Canvas state in JSON format (with metadata) */
  canvasData?: string;
  /** Background color of the canvas */
  backgroundColor?: string;
}

/**
 * TextCanvasViewer - A read-only canvas viewer using Fabric.js
 * Displays canvas content without any editing capabilities
 */
const TextCanvasViewer: React.FC<TextCanvasViewerProps> = ({
  canvasData,
  backgroundColor = '#FFFFFF',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const fabricLibRef = useRef<any>(null);
  const dimensionsCalculatedRef = useRef(false);
  const originalCanvasDataRef = useRef<{ canvasJSON: any; originalWidth: number; originalHeight: number } | null>(null);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  /**
   * Load Fabric.js dynamically (client-side only)
   */
  useEffect(() => {
    const loadFabric = async () => {
      try {
        console.log('Loading Fabric.js module for viewer...');
        const fabricModule = await import('fabric');
        fabricLibRef.current = fabricModule;
        setIsFabricLoaded(true);
      } catch (error) {
        console.error('Error loading Fabric.js:', error);
        toast.error('خطا در بارگذاری کتابخانه کنواس');
      }
    };

    loadFabric();
  }, []);

  /**
   * Calculate canvas dimensions from container (responsive)
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
          setCanvasDimensions({ width: rect.width, height: rect.height });
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
  }, []);

  /**
   * Dispose canvas when canvas data changes (for navigating between stories)
   */
  useEffect(() => {
    // Dispose existing canvas when new canvas data arrives
    return () => {
      if (fabricCanvasRef.current) {
        console.log('Canvas data changing, disposing old canvas');
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
        originalCanvasDataRef.current = null;
      }
    };
  }, [canvasData]);

  /**
   * Initialize Fabric.js canvas in read-only mode with responsive scaling
   */
  useEffect(() => {
    if (!canvasRef.current || !isFabricLoaded || !fabricLibRef.current) {
      return;
    }

    if (!dimensionsCalculatedRef.current ||
        canvasDimensions.width === 0 ||
        canvasDimensions.height === 0) {
      return;
    }

    if (fabricCanvasRef.current) {
      return;
    }

    console.log('Initializing read-only Fabric canvas:', canvasDimensions);

    const { StaticCanvas } = fabricLibRef.current;

    // Create empty canvas at current container size
    const canvas = new StaticCanvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor,
      enableRetinaScaling: true,
    });

    fabricCanvasRef.current = canvas;
    console.log('Canvas initialized in viewer');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFabricLoaded, canvasDimensions]);

  /**
   * Load and scale canvas data when available (separate from initialization)
   */
  useEffect(() => {
    if (!fabricCanvasRef.current || !canvasData) return;

    console.log('Loading canvas data in viewer');

    try {
      // Parse canvas metadata
      const parsed: CanvasMetadata = JSON.parse(canvasData);

      let canvasJSON;
      let originalWidth;
      let originalHeight;

      if (parsed.version && parsed.canvasJSON) {
        // New format with metadata
        canvasJSON = parsed.canvasJSON;
        originalWidth = parsed.originalWidth;
        originalHeight = parsed.originalHeight;
        console.log('Loading canvas with metadata:', {
          version: parsed.version,
          layoutType: parsed.layoutType,
          originalWidth,
          originalHeight,
        });
      } else {
        // Legacy format - assume square canvas
        canvasJSON = parsed;
        originalWidth = 1000;
        originalHeight = 1000;
        console.log('Loading legacy canvas format, assuming 1000x1000 dimensions');
      }

      // Store metadata for resize effect
      originalCanvasDataRef.current = { canvasJSON, originalWidth, originalHeight };

      // Load and scale objects
      fabricCanvasRef.current.loadFromJSON(canvasJSON, () => {
        if (!fabricCanvasRef.current) return;

        // Calculate scale factor (maintain aspect ratio)
        const scaleX = canvasDimensions.width / originalWidth;
        const scaleY = canvasDimensions.height / originalHeight;
        const scale = Math.min(scaleX, scaleY);

        console.log('Scaling canvas objects:', {
          originalWidth,
          originalHeight,
          currentWidth: canvasDimensions.width,
          currentHeight: canvasDimensions.height,
          scale,
        });

        // Scale all objects proportionally
        fabricCanvasRef.current.getObjects().forEach((obj: any) => {
          obj.scaleX = (obj.scaleX || 1) * scale;
          obj.scaleY = (obj.scaleY || 1) * scale;
          obj.left = (obj.left || 0) * scale;
          obj.top = (obj.top || 0) * scale;
          obj.setCoords();
        });

        // Center content if there's extra space
        if (scaleX !== scaleY) {
          const offsetX = scaleX > scaleY ? (canvasDimensions.width - originalWidth * scale) / 2 : 0;
          const offsetY = scaleY > scaleX ? (canvasDimensions.height - originalHeight * scale) / 2 : 0;

          if (offsetX > 0 || offsetY > 0) {
            console.log('Centering canvas content with offsets:', { offsetX, offsetY });
            fabricCanvasRef.current.getObjects().forEach((obj: any) => {
              obj.left = (obj.left || 0) + offsetX;
              obj.top = (obj.top || 0) + offsetY;
              obj.setCoords();
            });
          }
        }

        fabricCanvasRef.current.renderAll();
        console.log('Canvas data loaded and scaled in viewer');
      });
    } catch (error) {
      console.error('Error loading canvas data:', error);
      toast.error('خطا در بارگذاری محتوای کنواس');
    }
  }, [canvasData, canvasDimensions]);

  /**
   * Cleanup canvas on unmount
   */
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        console.log('Viewer unmounting, cleaning up canvas...');
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.canvasViewerWrapper}>
      <div ref={containerRef} className={styles.canvasContainer}>
        {(!isFabricLoaded || !dimensionsCalculatedRef.current) ? (
          <div className={styles.loadingState}>
            <p>در حال بارگذاری...</p>
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  );
};

export default TextCanvasViewer;
