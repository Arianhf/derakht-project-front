'use client';

import React from 'react';
import { FaPaintBrush, FaEraser, FaTrash, FaUndo } from 'react-icons/fa';
import styles from './DrawingToolbar.module.scss';

interface DrawingToolbarProps {
  currentTool: 'brush' | 'eraser';
  brushSize: number;
  brushColor: string;
  onToolChange: (tool: 'brush' | 'eraser') => void;
  onBrushSizeChange: (size: number) => void;
  onBrushColorChange: (color: string) => void;
  onClear: () => void;
  onUndo: () => void;
  isCanvasReady: boolean;
}

// Preset colors for drawing
const DRAWING_PRESET_COLORS = [
  { color: '#2B463C', label: 'سبز تیره' },
  { color: '#000000', label: 'مشکی' },
  { color: '#FF6F61', label: 'مرجانی' },
  { color: '#345BC0', label: 'آبی' },
  { color: '#F4A261', label: 'نارنجی' },
  { color: '#E76F51', label: 'قرمز' },
  { color: '#2A9D8F', label: 'فیروزه‌ای' },
  { color: '#E9C46A', label: 'زرد' },
];

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  currentTool,
  brushSize,
  brushColor,
  onToolChange,
  onBrushSizeChange,
  onBrushColorChange,
  onClear,
  onUndo,
  isCanvasReady,
}) => {
  return (
    <div className={styles.toolbar}>
      {/* Tool Selection */}
      <div className={styles.toolSection}>
        <button
          className={`${styles.toolButton} ${currentTool === 'brush' ? styles.active : ''}`}
          onClick={() => onToolChange('brush')}
          disabled={!isCanvasReady}
          aria-label="ابزار قلم"
          title="قلم"
        >
          <FaPaintBrush />
        </button>
        <button
          className={`${styles.toolButton} ${currentTool === 'eraser' ? styles.active : ''}`}
          onClick={() => onToolChange('eraser')}
          disabled={!isCanvasReady}
          aria-label="ابزار پاک‌کن"
          title="پاک‌کن"
        >
          <FaEraser />
        </button>
      </div>

      {/* Brush Size */}
      <div className={styles.toolSection}>
        <label className={styles.toolLabel}>اندازه:</label>
        <select
          className={styles.sizeSelect}
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          disabled={!isCanvasReady}
        >
          <option value={2}>کوچک</option>
          <option value={5}>متوسط</option>
          <option value={10}>بزرگ</option>
          <option value={15}>خیلی بزرگ</option>
        </select>
      </div>

      {/* Color Picker - Only show for brush tool */}
      {currentTool === 'brush' && (
        <div className={styles.toolSection}>
          <label className={styles.toolLabel}>رنگ:</label>
          <div className={styles.colorGrid}>
            {DRAWING_PRESET_COLORS.map((preset) => (
              <button
                key={preset.color}
                className={`${styles.colorSwatch} ${
                  brushColor === preset.color ? styles.active : ''
                }`}
                style={{ backgroundColor: preset.color }}
                onClick={() => onBrushColorChange(preset.color)}
                disabled={!isCanvasReady}
                aria-label={`انتخاب رنگ ${preset.label}`}
                title={preset.label}
              >
                {brushColor === preset.color && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.toolSection}>
        <button
          className={styles.actionButton}
          onClick={onUndo}
          disabled={!isCanvasReady}
          aria-label="لغو آخرین عملیات"
          title="لغو"
        >
          <FaUndo />
        </button>
        <button
          className={`${styles.actionButton} ${styles.danger}`}
          onClick={onClear}
          disabled={!isCanvasReady}
          aria-label="پاک کردن کنواس"
          title="پاک کردن همه"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default DrawingToolbar;
