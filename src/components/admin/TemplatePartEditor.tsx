'use client';

import React, { useState } from 'react';
import TextCanvasEditor from '@/components/story/TextCanvasEditor';
import IllustrationCanvasEditor from '@/components/story/IllustrationCanvasEditor';
import { CreateTemplatePartPayload } from '@/types/story';
import { getStandardCanvasSize } from '@/constants/canvasSizes';
import { FaTrash, FaFileDownload } from 'react-icons/fa';
import styles from './TemplatePartEditor.module.scss';

interface TemplatePartEditorProps {
    part: CreateTemplatePartPayload;
    index: number;
    orientation: 'PORTRAIT' | 'LANDSCAPE';
    size: '20x20' | '25x25' | '15x23';
    onUpdate: (index: number, field: keyof CreateTemplatePartPayload, value: any) => void;
    onRemove: (index: number) => void;
    templateId?: string;
    partIndex?: number;
}

/**
 * Determines the layout type based on size and orientation
 */
const getLayoutType = (size: '20x20' | '25x25' | '15x23', orientation: 'PORTRAIT' | 'LANDSCAPE') => {
    // Square layouts
    if (size === '20x20' || size === '25x25') {
        return 'square';
    }

    // Rectangle layouts based on orientation
    if (size === '15x23') {
        if (orientation === 'LANDSCAPE') {
            return 'landscapeRectangle'; // 23:15 ratio (wider)
        } else if (orientation === 'PORTRAIT') {
            return 'portraitRectangle'; // 15:23 ratio (taller)
        }
    }

    // Default fallback
    return 'default';
};

const TemplatePartEditor: React.FC<TemplatePartEditorProps> = ({
    part,
    index,
    orientation,
    size,
    onUpdate,
    onRemove,
    templateId,
    partIndex,
}) => {
    const [activeTab, setActiveTab] = useState<'text' | 'illustration'>('text');

    // Calculate layout type and canvas dimensions
    const layoutType = getLayoutType(size, orientation);
    const canvasDimensions = getStandardCanvasSize(layoutType);

    // Mock story object for canvas editors
    const mockStory = {
        id: 'template-preview',
        title: 'پیش‌نمایش قالب',
        orientation,
        size,
        parts: [],
        activity_type: 'WRITE_FOR_DRAWING',
        story_template: '',
        created_at: '',
        author: 0,
        cover_image: null,
        background_color: '#FFFFFF',
        font_color: '#2B463C',
    };

    const handleTextCanvasChange = (canvasJSON: string) => {
        try {
            const json = JSON.parse(canvasJSON);
            onUpdate(index, 'canvas_text_template', json);
        } catch (err) {
            console.error('Error parsing text canvas JSON:', err);
        }
    };

    const handleIllustrationCanvasChange = (canvasJSON: string) => {
        try {
            const json = JSON.parse(canvasJSON);
            onUpdate(index, 'canvas_illustration_template', json);
        } catch (err) {
            console.error('Error parsing illustration canvas JSON:', err);
        }
    };

    const handleExportTextCanvas = () => {
        if (part.canvas_text_template) {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(part.canvas_text_template, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `text-template-part-${index + 1}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    };

    const handleExportIllustrationCanvas = () => {
        if (part.canvas_illustration_template) {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(part.canvas_illustration_template, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `illustration-template-part-${index + 1}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    };

    return (
        <div className={styles.partEditor}>
            <div className={styles.partHeader}>
                <div className={styles.partTitle}>
                    <h3>بخش {index + 1}</h3>
                    <div className={styles.positionControl}>
                        <label>موقعیت:</label>
                        <input
                            type="number"
                            value={part.position}
                            onChange={(e) => onUpdate(index, 'position', parseInt(e.target.value))}
                            min="0"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className={styles.removeButton}
                >
                    <FaTrash /> حذف
                </button>
            </div>

            <div className={styles.tabBar}>
                <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'text' ? styles.active : ''}`}
                    onClick={() => setActiveTab('text')}
                >
                    قالب بوم متن
                </button>
                <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'illustration' ? styles.active : ''}`}
                    onClick={() => setActiveTab('illustration')}
                >
                    قالب بوم تصویرسازی
                </button>
            </div>

            <div className={styles.canvasContainer}>
                {activeTab === 'text' ? (
                    <div className={styles.textCanvasWrapper}>
                        <div className={styles.canvasHeader}>
                            <h4>ویرایشگر بوم متن</h4>
                            {part.canvas_text_template && (
                                <button
                                    type="button"
                                    onClick={handleExportTextCanvas}
                                    className={styles.exportButton}
                                >
                                    <FaFileDownload /> دانلود JSON
                                </button>
                            )}
                        </div>
                        <div className={styles.canvasEditor}>
                            <TextCanvasEditor
                                key={`text-${index}-${size}-${orientation}`}
                                story={mockStory}
                                initialState={part.canvas_text_template ? JSON.stringify(part.canvas_text_template) : undefined}
                                onChange={handleTextCanvasChange}
                                backgroundColor="#FFFFFF"
                            />
                        </div>
                        <p className={styles.canvasHint}>
                            از این بوم برای افزودن متن‌ها و راهنماهای نوشتاری استفاده کنید
                            <br />
                            <small>اندازه بوم: {canvasDimensions.width}x{canvasDimensions.height} ({layoutType})</small>
                        </p>
                    </div>
                ) : (
                    <div className={styles.illustrationCanvasWrapper}>
                        <div className={styles.canvasHeader}>
                            <h4>ویرایشگر بوم تصویرسازی</h4>
                            {part.canvas_illustration_template && (
                                <button
                                    type="button"
                                    onClick={handleExportIllustrationCanvas}
                                    className={styles.exportButton}
                                >
                                    <FaFileDownload /> دانلود JSON
                                </button>
                            )}
                        </div>
                        <div className={styles.canvasEditor}>
                            <IllustrationCanvasEditor
                                key={`illustration-${index}-${size}-${orientation}`}
                                story={mockStory}
                                initialState={part.canvas_illustration_template ? JSON.stringify(part.canvas_illustration_template) : undefined}
                                onChange={handleIllustrationCanvasChange}
                                backgroundColor="#FFFFFF"
                                templateId={templateId}
                                partIndex={partIndex}
                            />
                        </div>
                        <p className={styles.canvasHint}>
                            از این بوم برای افزودن تصاویر و عناصر بصری استفاده کنید
                            <br />
                            <small>اندازه بوم: {canvasDimensions.width}x{canvasDimensions.height} ({layoutType})</small>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatePartEditor;
