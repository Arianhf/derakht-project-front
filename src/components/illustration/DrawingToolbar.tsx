'use client';

import React, { useRef } from 'react';
import { FaPaintBrush, FaEraser, FaTrash, FaUndo, FaImage, FaMousePointer, FaEyeSlash } from 'react-icons/fa';
import styles from './DrawingToolbar.module.scss';
import ColorPicker from './ColorPicker';

interface DrawingToolbarProps {
  currentTool: 'brush' | 'eraser' | 'select';
  brushSize: number;
  brushColor: string;
  onToolChange: (tool: 'brush' | 'eraser' | 'select') => void;
  onBrushSizeChange: (size: number) => void;
  onBrushColorChange: (color: string) => void;
  onClear: () => void;
  onUndo: () => void;
  onImageUpload: (file: File) => void;
  isCanvasReady: boolean;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  onResetIllustration?: () => Promise<void>;
}

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  currentTool,
  brushSize,
  brushColor,
  onToolChange,
  onBrushSizeChange,
  onBrushColorChange,
  onClear,
  onUndo,
  onImageUpload,
  isCanvasReady,
  onToggleVisibility,
  isVisible = true,
  onResetIllustration,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetting, setIsResetting] = React.useState(false);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleResetClick = async () => {
    if (!onResetIllustration) return;
    setIsResetting(true);
    try {
      await onResetIllustration();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className={styles.toolbar}>
      {/* Tool Selection */}
      <div className={styles.toolSection}>
        <button
          type="button"
          className={`${styles.toolButton} ${currentTool === 'select' ? styles.active : ''}`}
          onClick={() => onToolChange('select')}
          disabled={!isCanvasReady}
          aria-label="ابزار انتخاب و جابجایی"
          title="انتخاب/جابجایی"
        >
          <FaMousePointer />
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${currentTool === 'brush' ? styles.active : ''}`}
          onClick={() => onToolChange('brush')}
          disabled={!isCanvasReady}
          aria-label="ابزار قلم"
          title="قلم"
        >
          <FaPaintBrush />
        </button>
        <button
          type="button"
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
          <ColorPicker
            color={brushColor}
            onChange={onBrushColorChange}
            disabled={!isCanvasReady}
          />
        </div>
      )}

      {/* Image Upload */}
      <div className={styles.toolSection}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className={styles.actionButton}
          onClick={handleImageButtonClick}
          disabled={!isCanvasReady}
          aria-label="آپلود تصویر"
          title="آپلود تصویر"
        >
          <FaImage />
        </button>
      </div>

      {/* Action Buttons */}
      <div className={styles.toolSection}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={onUndo}
          disabled={!isCanvasReady}
          aria-label="لغو آخرین عملیات"
          title="لغو"
        >
          <FaUndo />
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.danger}`}
          onClick={onClear}
          disabled={!isCanvasReady}
          aria-label="پاک کردن کنواس"
          title="پاک کردن همه"
        >
          <FaTrash />
        </button>
        {onResetIllustration && (
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleResetClick}
            disabled={!isCanvasReady || isResetting}
            aria-label="بازگردانی تصویر به حالت اولیه"
            title="بازگردانی به حالت اولیه"
          >
            <FaUndo />
            <span>{isResetting ? 'در حال بازگردانی...' : 'بازگردانی'}</span>
          </button>
        )}
      </div>

      {/* Hide Toolbar Button */}
      {onToggleVisibility && (
        <div className={styles.toolSection}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={onToggleVisibility}
            disabled={!isCanvasReady}
            aria-label="مخفی کردن نوار ابزار"
            title="مخفی کردن نوار ابزار"
          >
            <FaEyeSlash />
          </button>
        </div>
      )}
    </div>
  );
};

export default DrawingToolbar;
