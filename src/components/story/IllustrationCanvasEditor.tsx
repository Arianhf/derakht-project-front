'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './IllustrationCanvasEditor.module.scss';
import DrawingToolbar from '../illustration/DrawingToolbar';
import { toast } from 'react-hot-toast';
import { Story, CanvasMetadata } from '@/types/story';
import { getStandardCanvasSize } from '@/constants/canvasSizes';
import { getLayoutTypeFromStory } from '@/utils/canvasUtils';

export interface IllustrationCanvasEditorProps {
    /** Initial canvas state in JSON format (with metadata) */
    initialState?: string;
    /** Callback when canvas state changes */
    onChange?: (canvasJSON: string) => void;
    /** Story object to determine canvas layout type */
    story: Partial<Story>;
    /** Background color of the canvas */
    backgroundColor?: string;
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
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fabricCanvasRef = useRef<any>(null);
    const fabricLibRef = useRef<any>(null);
    const dimensionsCalculatedRef = useRef(false);
    const initialStateLoadedRef = useRef(false);
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const [isFabricLoaded, setIsFabricLoaded] = useState(false);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const [currentTool, setCurrentTool] = useState<DrawingTool>('select');
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#2B463C');

    /**
     * Helper to notify parent of canvas changes with metadata
     */
    const notifyChange = useCallback(() => {
        if (!onChange || !fabricCanvasRef.current) return;

        const layoutType = getLayoutTypeFromStory(story);
        const canvasMetadata: CanvasMetadata = {
            version: '1.0',
            layoutType,
            originalWidth: canvasDimensions.width,
            originalHeight: canvasDimensions.height,
            canvasJSON: fabricCanvasRef.current.toJSON(),
        };

        onChange(JSON.stringify(canvasMetadata));
    }, [onChange, story, canvasDimensions]);

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
                    const layoutType = getLayoutTypeFromStory(story);
                    const standardSize = getStandardCanvasSize(layoutType);

                    const scaleX = rect.width / standardSize.width;
                    const scaleY = rect.height / standardSize.height;
                    const scale = Math.min(scaleX, scaleY);

                    const scaledWidth = Math.floor(standardSize.width * scale);
                    const scaledHeight = Math.floor(standardSize.height * scale);

                    console.log('Scaling illustration canvas:', {
                        layoutType,
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

        const canvas = new Canvas(canvasRef.current, {
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            backgroundColor,
            isDrawingMode: false,
            selection: true,
            preserveObjectStacking: true,
            enableRetinaScaling: true,
        });

        // Set up the drawing brush
        const brush = new PencilBrush(canvas);
        brush.width = brushSize;
        brush.color = brushColor;
        canvas.freeDrawingBrush = brush;

        fabricCanvasRef.current = canvas;
        console.log('Illustration canvas created');
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
     * Update canvas dimensions when container size changes
     */
    useEffect(() => {
        if (!fabricCanvasRef.current) return;

        console.log('Updating illustration canvas dimensions to:', canvasDimensions);
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
     */
    const handleImageUpload = useCallback((file: File) => {
        if (!fabricCanvasRef.current || !fabricLibRef.current) {
            toast.error('کنواس آماده نیست');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (dataUrl && fabricLibRef.current) {
                const canvas = fabricCanvasRef.current;
                const { FabricImage } = fabricLibRef.current;

                FabricImage.fromURL(dataUrl, {
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

                    notifyChange();

                    toast.success('تصویر اضافه شد');
                }).catch((error: Error) => {
                    console.error('Error loading image:', error);
                    toast.error('خطا در بارگذاری تصویر');
                });
            }
        };
        reader.readAsDataURL(file);
    }, [notifyChange]);

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
};

export default IllustrationCanvasEditor;
