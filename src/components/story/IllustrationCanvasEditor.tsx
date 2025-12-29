'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './IllustrationCanvasEditor.module.scss';
import DrawingToolbar from '../illustration/DrawingToolbar';
import { toast } from 'react-hot-toast';
import { Story, CanvasMetadata } from '@/types/story';
import { getStandardCanvasSize } from '@/constants/canvasSizes';
import { getLayoutTypeFromStory } from '@/utils/canvasUtils';
import { compressImage, blobToFile, formatFileSize } from '@/utils/imageCompression';
import { validateImageFile } from '@/utils/imageValidation';
import { storyService } from '@/services/storyService';

export interface IllustrationCanvasEditorProps {
    /** Initial canvas state in JSON format (with metadata) */
    initialState?: string;
    /** Callback when canvas state changes */
    onChange?: (canvasJSON: string) => void;
    /** Story object to determine canvas layout type */
    story: Partial<Story>;
    /** Background color of the canvas */
    backgroundColor?: string;
    /** Template ID (required for uploading images) */
    templateId?: string;
    /** Part index (required for uploading images) */
    partIndex?: number;
}

type DrawingTool = 'brush' | 'eraser' | 'select';

/**
 * IllustrationCanvasEditor - A canvas-based illustration editor using Fabric.js
 * Supports drawing with brush, eraser, image insertion, and object manipulation
 */
const IllustrationCanvasEditor: React.FC<IllustrationCanvasEditorProps> = ({
    initialState,
    onChange,
    story,
    backgroundColor = '#FFFFFF',
    templateId,
    partIndex,
}) => {
    // Calculate standard canvas size based on story layout
    const standardCanvasSize = useMemo(() => {
        const layoutType = getLayoutTypeFromStory(story);
        return getStandardCanvasSize(layoutType);
    }, [story.size, story.orientation]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fabricCanvasRef = useRef<any>(null);
    const fabricLibRef = useRef<any>(null);
    const dimensionsCalculatedRef = useRef(false);
    const initialStateLoadedRef = useRef(false);
    const standardSizeRef = useRef(standardCanvasSize); // Store standard canvas size
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const [isFabricLoaded, setIsFabricLoaded] = useState(false);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const [currentTool, setCurrentTool] = useState<DrawingTool>('select');
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#2B463C');
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);

    /**
     * Update standard size ref when layout changes
     */
    useEffect(() => {
        standardSizeRef.current = standardCanvasSize;
        console.log('Standard illustration canvas size updated:', standardCanvasSize);
    }, [standardCanvasSize]);

    /**
     * Helper to notify parent of canvas changes with metadata
     */
    const notifyChange = useCallback(() => {
        if (!onChange || !fabricCanvasRef.current) return;

        const layoutType = getLayoutTypeFromStory(story);
        const standardSize = standardSizeRef.current;
        const canvasMetadata: CanvasMetadata = {
            version: '1.0',
            layoutType,
            originalWidth: standardSize.width,
            originalHeight: standardSize.height,
            canvasJSON: fabricCanvasRef.current.toJSON(),
        };

        onChange(JSON.stringify(canvasMetadata));
    }, [onChange, story]);

    /**
     * Load Fabric.js dynamically (client-side only)
     */
    useEffect(() => {
        const loadFabric = async () => {
            try {
                console.log('Loading Fabric.js module for illustration canvas...');
                const fabricModule = await import('fabric');
                fabricLibRef.current = fabricModule;
                console.log('Fabric instance stored for illustration canvas');
                setIsFabricLoaded(true);
            } catch (error) {
                console.error('Error loading Fabric.js:', error);
                toast.error('خطا در بارگذاری کتابخانه کنواس');
            }
        };

        loadFabric();
    }, []);

    /**
     * Calculate canvas dimensions based on standard size scaled to fit container
     */
    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();

                if (rect.width > 0 && rect.height > 0) {
                    // Use the pre-calculated standard canvas size
                    const standardSize = standardSizeRef.current;

                    const scaleX = rect.width / standardSize.width;
                    const scaleY = rect.height / standardSize.height;
                    const scale = Math.min(scaleX, scaleY);

                    const scaledWidth = Math.floor(standardSize.width * scale);
                    const scaledHeight = Math.floor(standardSize.height * scale);

                    console.log('Scaling illustration canvas:', {
                        standardSize,
                        containerSize: { width: rect.width, height: rect.height },
                        scale,
                        scaledSize: { width: scaledWidth, height: scaledHeight },
                    });

                    setCanvasDimensions({ width: scaledWidth, height: scaledHeight });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [story.size, story.orientation]);

    /**
     * Initialize Fabric.js canvas
     */
    useEffect(() => {
        if (!canvasRef.current || !isFabricLoaded || !fabricLibRef.current) {
            console.log('Illustration canvas initialization skipped:', {
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
            console.log('Illustration canvas already initialized, skipping');
            return;
        }

        console.log('Initializing illustration canvas with dimensions:', canvasDimensions);

        const { Canvas, PencilBrush } = fabricLibRef.current;

        // Calculate initial zoom level based on standard size
        const standardSize = standardSizeRef.current;
        const initialZoom = canvasDimensions.width / standardSize.width;

        // Initialize the canvas with standard dimensions and zoom
        const canvas = new Canvas(canvasRef.current, {
            width: standardSize.width,
            height: standardSize.height,
            backgroundColor,
            isDrawingMode: false,
            selection: true,
            preserveObjectStacking: true,
            enableRetinaScaling: true,
        });

        // Set zoom to scale down to container size
        canvas.setZoom(initialZoom);

        // Update canvas element dimensions to match container
        canvas.setDimensions({
            width: canvasDimensions.width,
            height: canvasDimensions.height,
        });

        // Set up the drawing brush
        const brush = new PencilBrush(canvas);
        brush.width = brushSize;
        brush.color = brushColor;
        canvas.freeDrawingBrush = brush;

        fabricCanvasRef.current = canvas;
        console.log('Illustration canvas created with zoom:', initialZoom);
        setIsCanvasReady(true);

        // Event handlers
        const handlePathCreated = () => {
            notifyChange();
        };

        const handleObjectModified = () => {
            notifyChange();
        };

        canvas.on('path:created', handlePathCreated);
        canvas.on('object:modified', handleObjectModified);
        canvas.on('object:removed', handleObjectModified);
        canvas.on('object:scaling', handleObjectModified);
        canvas.on('object:rotating', handleObjectModified);
        canvas.on('object:moving', handleObjectModified);

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault();
                deleteSelected();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFabricLoaded, canvasDimensions]);

    /**
     * Load initial state when it becomes available
     */
    useEffect(() => {
        if (!fabricCanvasRef.current || !isCanvasReady || !initialState) {
            console.log('Skipping illustration initial state load:', {
                hasCanvas: !!fabricCanvasRef.current,
                isCanvasReady,
                hasInitialState: !!initialState,
            });
            return;
        }

        if (initialStateLoadedRef.current) {
            console.log('Illustration initial state already loaded, skipping');
            return;
        }

        const loadInitialState = async () => {
            try {
                console.log('Loading initial illustration canvas state...');
                const parsed = JSON.parse(initialState);
                let canvasJSON;

                if (parsed.version && parsed.canvasJSON) {
                    canvasJSON = parsed.canvasJSON;
                    console.log('Loading illustration with metadata:', {
                        version: parsed.version,
                        layoutType: parsed.layoutType,
                        originalWidth: parsed.originalWidth,
                        originalHeight: parsed.originalHeight,
                    });
                } else {
                    canvasJSON = parsed;
                    console.log('Loading legacy illustration format');
                }

                initialStateLoadedRef.current = true;

                await fabricCanvasRef.current.loadFromJSON(canvasJSON);
                fabricCanvasRef.current.renderAll();
                console.log('Illustration initial state loaded, objects count:', fabricCanvasRef.current.getObjects().length);
            } catch (error) {
                console.error('Error loading illustration canvas state:', error);
                initialStateLoadedRef.current = false;
                toast.error('خطا در بارگذاری وضعیت کنواس تصویر');
            }
        };

        loadInitialState();
    }, [initialState, isCanvasReady]);

    /**
     * Update canvas zoom and dimensions when container size changes
     * This ensures objects scale proportionally across all devices
     */
    useEffect(() => {
        if (!fabricCanvasRef.current) return;

        const standardSize = standardSizeRef.current;
        const zoom = canvasDimensions.width / standardSize.width;

        console.log('Updating illustration canvas zoom:', {
            canvasDimensions,
            standardSize,
            zoom,
        });

        // Set zoom to scale all objects proportionally
        fabricCanvasRef.current.setZoom(zoom);

        // Update canvas element dimensions to match container
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
            canvas.forEachObject((obj: any) => {
                obj.selectable = false;
            });
        } else if (currentTool === 'eraser') {
            brush.color = backgroundColor;
            brush.width = brushSize * 2;
            canvas.isDrawingMode = true;
            canvas.selection = false;
            canvas.forEachObject((obj: any) => {
                obj.selectable = false;
            });
        } else if (currentTool === 'select') {
            canvas.isDrawingMode = false;
            canvas.selection = true;
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
                console.log('Illustration canvas component unmounting, cleaning up...');
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
                setIsCanvasReady(false);
            }
        };
    }, []);

    /**
     * Delete the currently selected object
     */
    const deleteSelected = useCallback(() => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const activeObjects = canvas.getActiveObjects();

        if (!activeObjects || activeObjects.length === 0) {
            toast.error('لطفاً ابتدا یک شی را انتخاب کنید');
            return;
        }

        activeObjects.forEach((obj: any) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();

        notifyChange();

        toast.success('شی حذف شد');
    }, [notifyChange]);

    /**
     * Clear the entire canvas
     */
    const clearCanvas = useCallback(() => {
        if (!fabricCanvasRef.current) return;

        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.backgroundColor = backgroundColor;
        fabricCanvasRef.current.renderAll();

        notifyChange();

        toast.success('کنواس پاک شد');
    }, [backgroundColor, notifyChange]);

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

            notifyChange();

            toast.success('عملیات لغو شد');
        }
    }, [notifyChange]);

    /**
     * Handle image upload from toolbar
     * New implementation: Compresses image and uploads to backend, stores URL in canvas
     */
    const handleImageUpload = useCallback(async (file: File) => {
        if (!fabricCanvasRef.current || !fabricLibRef.current) {
            toast.error('کنواس آماده نیست');
            return;
        }

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
            const canvas = fabricCanvasRef.current;
            const { FabricImage } = fabricLibRef.current;

            const img = await FabricImage.fromURL(uploadResult.url, {
                crossOrigin: 'anonymous',
            });

            // Scale image to fit canvas if it's too large
            const maxWidth = canvas.width * 0.5;
            const maxHeight = canvas.height * 0.5;

            if (img.width > maxWidth || img.height > maxHeight) {
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                img.scale(scale);
            }

            // Center the image and add metadata
            img.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center',
                // Store image ID for cleanup tracking (important!)
                templateImageId: uploadResult.id,
            });

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();

            notifyChange();

            toast.success('تصویر به کنواس اضافه شد');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            const errorMessage = error?.response?.data?.error || 'خطا در آپلود تصویر';
            toast.error(errorMessage);
        }
    }, [templateId, partIndex, notifyChange]);

    return (
        <div className={styles.canvasEditorWrapper}>
            <div ref={containerRef} className={styles.canvasContainer}>
                {(!isFabricLoaded || !dimensionsCalculatedRef.current) ? (
                    <div className={styles.loadingState}>
                        <p>در حال بارگذاری ویرایشگر تصویر...</p>
                    </div>
                ) : (
                    <>
                        <canvas ref={canvasRef} />

                        {/* Floating toolbar overlay */}
                        <div className={`${styles.floatingToolbar} ${!isToolbarVisible ? styles.hidden : ''}`}>
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
                                onToggleVisibility={() => setIsToolbarVisible(false)}
                                isVisible={isToolbarVisible}
                            />
                        </div>

                        {/* Show toolbar button - visible when toolbar is hidden */}
                        {!isToolbarVisible && (
                            <button
                                className={styles.showToolbarButton}
                                onClick={() => setIsToolbarVisible(true)}
                                aria-label="نمایش نوار ابزار"
                                title="نمایش نوار ابزار"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                </svg>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default IllustrationCanvasEditor;
