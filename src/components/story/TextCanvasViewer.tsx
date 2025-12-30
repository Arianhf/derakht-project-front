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
    const standardSizeRef = useRef({ width: 1000, height: 1000 }); // Store original canvas size
    const [isFabricLoaded, setIsFabricLoaded] = useState(false);
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const [canvasVersion, setCanvasVersion] = useState(0); // Increment to trigger re-initialization

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
     * Maintains aspect ratio based on original canvas dimensions
     */
    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();

                if (rect.width > 0 && rect.height > 0) {
                    // Use original aspect ratio from standardSizeRef (defaults to 1:1)
                    const originalAspectRatio = standardSizeRef.current.width / standardSizeRef.current.height;
                    const containerAspectRatio = rect.width / rect.height;

                    let canvasWidth, canvasHeight;

                    if (containerAspectRatio > originalAspectRatio) {
                        // Container is wider than canvas aspect ratio - fit to height
                        canvasHeight = rect.height;
                        canvasWidth = canvasHeight * originalAspectRatio;
                    } else {
                        // Container is taller than canvas aspect ratio - fit to width
                        canvasWidth = rect.width;
                        canvasHeight = canvasWidth / originalAspectRatio;
                    }

                    setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
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
                setIsCanvasReady(false);
                setCanvasVersion(prev => prev + 1); // Trigger re-initialization
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

        // Use standard size and zoom approach for consistent scaling
        const standardSize = standardSizeRef.current;
        const initialZoom = canvasDimensions.width / standardSize.width;

        // Create canvas with standard dimensions
        const canvas = new StaticCanvas(canvasRef.current, {
            width: standardSize.width,
            height: standardSize.height,
            backgroundColor,
            enableRetinaScaling: true,
        });

        // Apply zoom and adjust dimensions
        canvas.setZoom(initialZoom);
        canvas.setDimensions({
            width: canvasDimensions.width,
            height: canvasDimensions.height,
        });

        fabricCanvasRef.current = canvas;
        setIsCanvasReady(true);
        console.log('Canvas initialized in viewer with zoom:', initialZoom);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFabricLoaded, canvasDimensions, canvasVersion]);

    /**
     * Load and scale canvas data when available (separate from initialization)
     */
    useEffect(() => {
        if (!fabricCanvasRef.current || !isCanvasReady || !canvasData) {
            console.log('Skipping canvas data load:', {
                hasCanvas: !!fabricCanvasRef.current,
                isCanvasReady,
                hasCanvasData: !!canvasData,
            });
            return;
        }

        console.log('Loading canvas data in viewer...');

        const loadCanvasData = async () => {
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

                // Store metadata and update standard size
                originalCanvasDataRef.current = { canvasJSON, originalWidth, originalHeight };
                standardSizeRef.current = { width: originalWidth, height: originalHeight };

                // Recalculate canvas dimensions with correct aspect ratio
                let canvasWidth = canvasDimensions.width;
                let canvasHeight = canvasDimensions.height;

                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const originalAspectRatio = originalWidth / originalHeight;
                    const containerAspectRatio = rect.width / rect.height;

                    if (containerAspectRatio > originalAspectRatio) {
                        // Container is wider than canvas aspect ratio - fit to height
                        canvasHeight = rect.height;
                        canvasWidth = canvasHeight * originalAspectRatio;
                    } else {
                        // Container is taller than canvas aspect ratio - fit to width
                        canvasWidth = rect.width;
                        canvasHeight = canvasWidth / originalAspectRatio;
                    }
                }

                // Check canvas validity before loading (prevent race condition)
                if (!fabricCanvasRef.current) {
                    console.log('Canvas was disposed before loading, aborting');
                    return;
                }

                // Load canvas data using Promise-based API (Fabric.js v6)
                await fabricCanvasRef.current.loadFromJSON(canvasJSON);

                // Check again after async operation
                if (!fabricCanvasRef.current) {
                    console.log('Canvas was disposed during loading, aborting');
                    return;
                }

                // Calculate zoom based on original dimensions
                const scaleX = canvasWidth / originalWidth;
                const scaleY = canvasHeight / originalHeight;
                const zoom = Math.min(scaleX, scaleY);

                console.log('Setting canvas zoom:', {
                    originalWidth,
                    originalHeight,
                    currentWidth: canvasWidth,
                    currentHeight: canvasHeight,
                    zoom,
                });

                // Apply zoom to scale all objects proportionally
                fabricCanvasRef.current.setZoom(zoom);

                // Update dimensions to match calculated dimensions
                fabricCanvasRef.current.setDimensions({
                    width: canvasWidth,
                    height: canvasHeight,
                });

                fabricCanvasRef.current.renderAll();
                console.log('Canvas data loaded with zoom in viewer, objects count:', fabricCanvasRef.current.getObjects().length);
            } catch (error) {
                console.error('Error loading canvas data:', error);
                toast.error('خطا در بارگذاری محتوای کنواس');
            }
        };

        loadCanvasData();
    }, [canvasData, isCanvasReady]);

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