'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './TextCanvasEditor.module.scss';
import CanvasToolbar from './CanvasToolbar';
import { toast } from 'react-hot-toast';
import { Story, CanvasMetadata } from '@/types/story';
import { getStandardCanvasSize } from '@/constants/canvasSizes';
import { getLayoutTypeFromStory } from '@/utils/canvasUtils';

export interface TextCanvasEditorProps {
    /** Initial canvas state in JSON format (with metadata) */
    initialState?: string;
    /** Callback when canvas state changes */
    onChange?: (canvasJSON: string) => void;
    /** Story object to determine canvas layout type */
    story: Partial<Story>;
    /** Background color of the canvas */
    backgroundColor?: string;
}

export interface CanvasTextObject {
    type?: string;
    fontFamily?: string;
    fontSize?: number;
    fill?: string;
    skewX?: number;
    skewY?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    lockUniScaling?: boolean;
    set?: (props: any) => void;
    setCoords?: () => void;
    setControlsVisibility?: (controls: any) => void;
}

/**
 * TextCanvasEditor - A canvas-based text editor using Fabric.js
 * Supports Persian (RTL) text with full transformation capabilities
 */
const TextCanvasEditor: React.FC<TextCanvasEditorProps> = ({
                                                               initialState,
                                                               onChange,
                                                               story,
                                                               backgroundColor = '#FFFFFF',
                                                           }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fabricCanvasRef = useRef<any>(null);
    const fabricLibRef = useRef<any>(null); // Store fabric library instance
    const dimensionsCalculatedRef = useRef(false); // Track if dimensions are ready
    const initialStateLoadedRef = useRef(false); // Track if initial state has been loaded
    const [activeObject, setActiveObject] = useState<CanvasTextObject | null>(null);
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const [isFabricLoaded, setIsFabricLoaded] = useState(false);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

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
                console.log('Loading Fabric.js module...');
                const fabricModule = await import('fabric');
                console.log('Fabric.js module loaded:', fabricModule);

                // In Fabric.js v6, the module itself contains the classes
                // Store the entire module in the ref
                fabricLibRef.current = fabricModule;
                console.log('Fabric instance stored:', !!fabricLibRef.current);
                console.log('Has Canvas:', !!fabricLibRef.current.Canvas);
                console.log('Has IText:', !!fabricLibRef.current.IText);

                setIsFabricLoaded(true);
            } catch (error) {
                console.error('Error loading Fabric.js:', error);
                toast.error('خطا در بارگذاری کتابخانه کنواس');
            }
        };

        loadFabric();
    }, []);

    /**
     * Set canvas dimensions to standard size based on story layout
     * Uses fixed standard sizes instead of container dimensions
     */
    useEffect(() => {
        const layoutType = getLayoutTypeFromStory(story);
        const standardSize = getStandardCanvasSize(layoutType);

        console.log('Using standard canvas size for layout:', layoutType, standardSize);

        setCanvasDimensions(standardSize);
        dimensionsCalculatedRef.current = true;
    }, [story.size, story.orientation]);

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

        // Wait for valid dimensions before initializing
        if (!dimensionsCalculatedRef.current ||
            canvasDimensions.width === 0 ||
            canvasDimensions.height === 0) {
            console.log('Waiting for valid container dimensions...', canvasDimensions);
            return;
        }

        // Prevent multiple initializations
        if (fabricCanvasRef.current) {
            console.log('Canvas already initialized, skipping');
            return;
        }

        console.log('Initializing Fabric canvas with dimensions:', canvasDimensions);

        const { Canvas } = fabricLibRef.current;

        // Initialize the canvas - Fabric.js will handle Retina scaling automatically
        const canvas = new Canvas(canvasRef.current, {
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            backgroundColor,
            selection: true,
            preserveObjectStacking: true,
            enableRetinaScaling: true, // This should handle high-DPI displays automatically
        });

        fabricCanvasRef.current = canvas;
        console.log('Canvas created with enableRetinaScaling');
        setIsCanvasReady(true);

        // Event handlers
        const handleSelectionCreated = (e: any) => {
            setActiveObject(e.selected?.[0] || null);
        };

        const handleSelectionUpdated = (e: any) => {
            setActiveObject(e.selected?.[0] || null);
        };

        const handleSelectionCleared = () => {
            setActiveObject(null);
        };

        const handleObjectModified = () => {
            notifyChange();
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
            // BUT NOT if we're editing text!
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeObj = canvas.getActiveObject();

                // Check if we're editing text (isEditing property)
                if (activeObj && (activeObj as any).isEditing) {
                    // User is editing text, don't delete the object
                    return;
                }

                // User is not editing, delete the object
                if (activeObj && document.activeElement?.tagName !== 'INPUT') {
                    e.preventDefault();
                    deleteSelected();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // No cleanup on this effect - canvas persists for component lifetime
        // Cleanup only happens when component unmounts (see separate effect below)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFabricLoaded, canvasDimensions]);

    /**
     * Load initial state when it becomes available (handles async data fetching)
     * This effect handles both immediate initialState and delayed data from database
     */
    useEffect(() => {
        if (!fabricCanvasRef.current || !isCanvasReady || !initialState) {
            console.log('Skipping initial state load:', {
                hasCanvas: !!fabricCanvasRef.current,
                isCanvasReady,
                hasInitialState: !!initialState,
            });
            return;
        }

        // Prevent loading the same initial state multiple times
        if (initialStateLoadedRef.current) {
            console.log('Initial state already loaded, skipping');
            return;
        }

        const loadInitialState = async () => {
            try {
                console.log('Loading initial canvas state...', initialState.substring(0, 100));
                const parsed = JSON.parse(initialState);
                let canvasJSON;

                if (parsed.version && parsed.canvasJSON) {
                    canvasJSON = parsed.canvasJSON;
                    console.log('Loading with metadata:', {
                        version: parsed.version,
                        layoutType: parsed.layoutType,
                        originalWidth: parsed.originalWidth,
                        originalHeight: parsed.originalHeight,
                    });
                } else {
                    canvasJSON = parsed;
                    console.log('Loading legacy format');
                }

                // Mark as loaded BEFORE async operation to prevent race conditions
                initialStateLoadedRef.current = true;

                // Fabric.js v6 uses Promise-based API
                await fabricCanvasRef.current.loadFromJSON(canvasJSON);
                fabricCanvasRef.current.renderAll();
                console.log('Initial state loaded successfully, objects count:', fabricCanvasRef.current.getObjects().length);
            } catch (error) {
                console.error('Error loading canvas state:', error);
                // Reset flag on error so it can retry
                initialStateLoadedRef.current = false;
                toast.error('خطا در بارگذاری وضعیت کنواس');
            }
        };

        loadInitialState();
    }, [initialState, isCanvasReady]);

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
     * Add a new text object to the canvas
     */
    const addText = useCallback(() => {
        if (!fabricCanvasRef.current || !fabricLibRef.current) {
            toast.error('کنواس آماده نیست');
            return;
        }

        const canvas = fabricCanvasRef.current;
        const { IText } = fabricLibRef.current;

        const text = new IText('متن خود را بنویسید', {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontFamily: 'Yekan, Vazir, sans-serif',
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
        });

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

        // Enter editing mode and set cursor at the end
        text.enterEditing();
        text.selectAll();
        text.setSelectionEnd(text.text?.length || 0);

        canvas.renderAll();

        notifyChange();

        toast.success('متن جدید اضافه شد');
    }, [notifyChange]);

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

        notifyChange();

        toast.success('شی حذف شد');
    }, [notifyChange]);

    /**
     * Update the selected text object's font family
     */
    const updateFontFamily = useCallback((fontFamily: string) => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const activeObj = canvas.getActiveObject();

        if (!activeObj || activeObj.type !== 'i-text') {
            toast.error('لطفاً ابتدا یک متن را انتخاب کنید');
            return;
        }

        activeObj.set({ fontFamily });
        canvas.renderAll();

        notifyChange();
    }, [notifyChange]);

    /**
     * Update the selected text object's font size
     */
    const updateFontSize = useCallback((fontSize: number) => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const activeObj = canvas.getActiveObject();

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

        notifyChange();
    }, [notifyChange]);

    /**
     * Update the selected text object's color
     */
    const updateTextColor = useCallback((color: string) => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const activeObj = canvas.getActiveObject();

        if (!activeObj || activeObj.type !== 'i-text') {
            toast.error('لطفاً ابتدا یک متن را انتخاب کنید');
            return;
        }

        activeObj.set({ fill: color });
        canvas.renderAll();

        notifyChange();
    }, [notifyChange]);

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

        notifyChange();
    }, [notifyChange]);

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

        notifyChange();
    }, [notifyChange]);

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
     * Export canvas state as JSON with metadata (public API)
     */
    const getCanvasJSON = useCallback((): string => {
        if (!fabricCanvasRef.current) return '{}';

        const layoutType = getLayoutTypeFromStory(story);
        const canvasMetadata: CanvasMetadata = {
            version: '1.0',
            layoutType,
            originalWidth: canvasDimensions.width,
            originalHeight: canvasDimensions.height,
            canvasJSON: fabricCanvasRef.current.toJSON(),
        };

        return JSON.stringify(canvasMetadata);
    }, [story, canvasDimensions]);

    /**
     * Load canvas from JSON state (handles both new metadata format and legacy format)
     */
    const loadFromJSON = useCallback(async (json: string) => {
        if (!fabricCanvasRef.current) return;

        try {
            // Try parsing as new format with metadata
            const parsed = JSON.parse(json);

            let canvasJSON;
            if (parsed.version && parsed.canvasJSON) {
                // New format with metadata
                canvasJSON = parsed.canvasJSON;
                console.log('Loading canvas with metadata:', {
                    version: parsed.version,
                    layoutType: parsed.layoutType,
                    originalWidth: parsed.originalWidth,
                    originalHeight: parsed.originalHeight,
                });
            } else {
                // Legacy format - direct Fabric.js JSON
                canvasJSON = parsed;
                console.log('Loading legacy canvas format');
            }

            // Fabric.js v6 uses Promise-based API
            await fabricCanvasRef.current.loadFromJSON(canvasJSON);
            fabricCanvasRef.current.renderAll();
            toast.success('وضعیت بارگذاری شد');
        } catch (error) {
            console.error('Error loading JSON:', error);
            toast.error('خطا در بارگذاری وضعیت');
        }
    }, []);

    return (
        <div className={styles.canvasEditorWrapper}>
            <div ref={containerRef} className={styles.canvasContainer}>
                {/* Show loading state while Fabric.js is loading or dimensions not ready */}
                {(!isFabricLoaded || !dimensionsCalculatedRef.current) ? (
                    <div className={styles.loadingState}>
                        <p>در حال بارگذاری ویرایشگر...</p>
                    </div>
                ) : (
                    <>
                        <canvas ref={canvasRef} />

                        {/* Floating toolbar overlay */}
                        <div className={styles.floatingToolbar}>
                            <CanvasToolbar
                                activeObject={activeObject}
                                onAddText={addText}
                                onDeleteSelected={deleteSelected}
                                onFontFamilyChange={updateFontFamily}
                                onFontSizeChange={updateFontSize}
                                onTextColorChange={updateTextColor}
                                onDimensionsChange={updateDimensions}
                                onSkewChange={updateSkew}
                                onAspectRatioLockChange={toggleAspectRatioLock}
                                isCanvasReady={isCanvasReady}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TextCanvasEditor;