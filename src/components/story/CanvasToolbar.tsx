'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaLock, FaUnlock, FaUndo } from 'react-icons/fa';
import styles from './CanvasToolbar.module.scss';
import { CanvasTextObject } from './TextCanvasEditor';

interface CanvasToolbarProps {
  /** Currently active object on the canvas */
  activeObject: CanvasTextObject | null;
  /** Callback to add new text to canvas */
  onAddText: () => void;
  /** Callback to delete selected object */
  onDeleteSelected: () => void;
  /** Callback when font family changes */
  onFontFamilyChange: (fontFamily: string) => void;
  /** Callback when font size changes */
  onFontSizeChange: (fontSize: number) => void;
  /** Callback when text color changes */
  onTextColorChange: (color: string) => void;
  /** Callback when dimensions change */
  onDimensionsChange: (width?: number, height?: number) => void;
  /** Callback when skew values change */
  onSkewChange: (skewX?: number, skewY?: number) => void;
  /** Callback when aspect ratio lock changes */
  onAspectRatioLockChange: (locked: boolean) => void;
  /** Whether the canvas is ready */
  isCanvasReady: boolean;
  /** Callback to reset text canvas to template default */
  onResetText?: () => Promise<void>;
}

// Available fonts
const FONTS = [
  { value: 'Yekan, Vazir, sans-serif', label: 'یکان' },
  { value: 'shoor-Medium, sans-serif', label: 'شور' },
  { value: 'Vazir, sans-serif', label: 'وزیر' },
  { value: 'Shabnam, sans-serif', label: 'شبنم' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
];

// Font size options (16-72px)
const FONT_SIZES = [16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72];

// Text color options
const TEXT_COLORS = [
  { value: '#2B463C', label: 'سبز تیره' },
  { value: '#000000', label: 'مشکی' },
  { value: '#FFFFFF', label: 'سفید' },
  { value: '#345BC0', label: 'آبی' },
  { value: '#FF6F61', label: 'مرجانی' },
  { value: '#80D46D', label: 'سبز روشن' },
];

/**
 * CanvasToolbar - Toolbar component for canvas text editing controls
 * Provides controls for adding text, changing fonts, sizing, and transformations
 */
const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeObject,
  onAddText,
  onDeleteSelected,
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
  onDimensionsChange,
  onSkewChange,
  onAspectRatioLockChange,
  isCanvasReady,
  onResetText,
}) => {
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedColor, setSelectedColor] = useState('#2B463C');
  const [objectWidth, setObjectWidth] = useState<number>(0);
  const [objectHeight, setObjectHeight] = useState<number>(0);
  const [skewX, setSkewX] = useState<number>(0);
  const [skewY, setSkewY] = useState<number>(0);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const isObjectSelected = !!activeObject;

  // Debug logging
  useEffect(() => {
    console.log('CanvasToolbar state:', {
      isCanvasReady,
      isObjectSelected,
      activeObjectType: activeObject?.type,
    });
  }, [isCanvasReady, isObjectSelected, activeObject]);

  /**
   * Update toolbar state when active object changes
   */
  useEffect(() => {
    if (activeObject) {
      // Update font settings for text objects
      if (activeObject.type === 'i-text') {
        setSelectedFont(activeObject.fontFamily || FONTS[0].value);
        setSelectedFontSize(activeObject.fontSize || 24);
        setSelectedColor(activeObject.fill as string || '#2B463C');
      }

      // Update dimensions
      const width = (activeObject.width || 0) * (activeObject.scaleX || 1);
      const height = (activeObject.height || 0) * (activeObject.scaleY || 1);
      setObjectWidth(Math.round(width));
      setObjectHeight(Math.round(height));

      // Update skew values
      setSkewX(activeObject.skewX || 0);
      setSkewY(activeObject.skewY || 0);

      // Update aspect ratio lock
      setIsAspectRatioLocked(activeObject.lockUniScaling || false);
    } else {
      // Reset to defaults when no object is selected
      setSelectedFont(FONTS[0].value);
      setSelectedFontSize(24);
      setSelectedColor('#2B463C');
      setObjectWidth(0);
      setObjectHeight(0);
      setSkewX(0);
      setSkewY(0);
      setIsAspectRatioLocked(false);
    }
  }, [activeObject]);

  /**
   * Handle font family change
   */
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setSelectedFont(font);
    onFontFamilyChange(font);
  };

  /**
   * Handle font size change
   */
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value, 10);
    setSelectedFontSize(size);
    onFontSizeChange(size);
  };

  /**
   * Handle text color change
   */
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    onTextColorChange(color);
  };

  /**
   * Handle width change
   */
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    if (!isNaN(width) && width > 0) {
      setObjectWidth(width);
      onDimensionsChange(width, undefined);
    }
  };

  /**
   * Handle height change
   */
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value, 10);
    if (!isNaN(height) && height > 0) {
      setObjectHeight(height);
      onDimensionsChange(undefined, height);
    }
  };

  /**
   * Handle skew X change
   */
  const handleSkewXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSkewX(value);
    onSkewChange(value, undefined);
  };

  /**
   * Handle skew Y change
   */
  const handleSkewYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSkewY(value);
    onSkewChange(undefined, value);
  };

  /**
   * Toggle aspect ratio lock
   */
  const handleAspectRatioToggle = () => {
    const newLocked = !isAspectRatioLocked;
    setIsAspectRatioLocked(newLocked);
    onAspectRatioLockChange(newLocked);
  };

  /**
   * Handle reset text canvas to template default
   */
  const handleResetClick = async () => {
    if (!onResetText) return;
    setIsResetting(true);
    try {
      await onResetText();
    } finally {
      setIsResetting(false);
    }
  };

  const isTextObject = activeObject?.type === 'i-text';

  return (
    <div className={styles.toolbar}>
      {/* Add Text Button */}
      <div className={styles.toolbarSection}>
        <button
          type="button"
          className={styles.addTextButton}
          onClick={onAddText}
          disabled={!isCanvasReady}
          aria-label="افزودن متن"
          title="افزودن متن (T)"
        >
          <FaPlus />
        </button>
      </div>

      {/* Reset Button */}
      {onResetText && (
        <div className={styles.toolbarSection}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleResetClick}
            disabled={!isCanvasReady || isResetting}
            aria-label="بازگردانی متن به حالت اولیه"
            title="بازگردانی به حالت اولیه"
          >
            <FaUndo />
            <span>{isResetting ? 'در حال بازگردانی...' : 'بازگردانی'}</span>
          </button>
        </div>
      )}

      {/* Font Controls - Only for text objects */}
      {isTextObject && (
        <>
          <div className={styles.toolbarSection}>
            <select
              id="font-family"
              className={styles.select}
              value={selectedFont}
              onChange={handleFontFamilyChange}
              disabled={!isObjectSelected}
              aria-label="انتخاب فونت"
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.toolbarSection}>
            <select
              id="font-size"
              className={styles.select}
              value={selectedFontSize}
              onChange={handleFontSizeChange}
              disabled={!isObjectSelected}
              aria-label="اندازه فونت"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>

          <div className={styles.toolbarSection}>
            <select
              id="text-color"
              className={styles.select}
              value={selectedColor}
              onChange={handleColorChange}
              disabled={!isObjectSelected}
              aria-label="رنگ متن"
            >
              {TEXT_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.toolbarSection}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={onDeleteSelected}
              disabled={!isObjectSelected}
              aria-label="حذف شی"
              title="حذف شی (Delete)"
            >
              <FaTrash />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CanvasToolbar;
