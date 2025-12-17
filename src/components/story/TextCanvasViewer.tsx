'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './TextCanvasViewer.module.scss';
import { toast } from 'react-hot-toast';

export interface TextCanvasViewerProps {
  /** Canvas state in JSON format */
  canvasData?: string;
  /** Width of the canvas in pixels */
  width?: number;
  /** Height of the canvas in pixels */
  height?: number;
  /** Background color of the canvas */
  backgroundColor?: string;
}

/**
 * TextCanvasViewer - A read-only canvas viewer using Fabric.js
 * Displays canvas content without any editing capabilities
 */
const TextCanvasViewer: React.FC<TextCanvasViewerProps> = ({
  canvasData,
  width,
  height,
  backgroundColor = '#FFFFFF',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const fabricLibRef = useRef<any>(null);
  const dimensionsCalculatedRef = useRef(false);
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
   * Calculate canvas dimensions from container
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = width || rect.width;
        const newHeight = height || rect.height;

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
   * Initialize Fabric.js canvas in read-only mode
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

    const { Canvas, StaticCanvas } = fabricLibRef.current;

    // Use StaticCanvas for completely non-interactive rendering
    const canvas = new StaticCanvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor,
      enableRetinaScaling: true,
    });

    fabricCanvasRef.current = canvas;

    // Load canvas data if provided
    if (canvasData) {
      try {
        console.log('Loading canvas data in viewer...');
        canvas.loadFromJSON(canvasData, () => {
          canvas.renderAll();
          console.log('Canvas data loaded in viewer (static mode)');
        });
      } catch (error) {
        console.error('Error loading canvas data:', error);
        toast.error('خطا در بارگذاری محتوای کنواس');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFabricLoaded, canvasDimensions, canvasData]);

  /**
   * Update canvas dimensions when container size changes
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.setDimensions({
      width: canvasDimensions.width,
      height: canvasDimensions.height,
    });
    fabricCanvasRef.current.renderAll();
  }, [canvasDimensions]);

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
