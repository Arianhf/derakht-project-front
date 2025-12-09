'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';
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
  /** Callback when dimensions change */
  onDimensionsChange: (width?: number, height?: number) => void;
  /** Callback when skew values change */
  onSkewChange: (skewX?: number, skewY?: number) => void;
  /** Callback when aspect ratio lock changes */
  onAspectRatioLockChange: (locked: boolean) => void;
  /** Whether the canvas is ready */
  isCanvasReady: boolean;
}

// Available fonts
const FONTS = [
  { value: 'Vazir, sans-serif', label: 'وزیر' },
  { value: 'Yekan, sans-serif', label: 'یکان' },
  { value: 'Shabnam, sans-serif', label: 'شبنم' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
];

// Font size options (16-72px)
const FONT_SIZES = [16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72];

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
  onDimensionsChange,
  onSkewChange,
  onAspectRatioLockChange,
  isCanvasReady,
}) => {
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [objectWidth, setObjectWidth] = useState<number>(0);
  const [objectHeight, setObjectHeight] = useState<number>(0);
  const [skewX, setSkewX] = useState<number>(0);
  const [skewY, setSkewY] = useState<number>(0);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(false);

  const isObjectSelected = !!activeObject;

  /**
   * Update toolbar state when active object changes
   */
  useEffect(() => {
    if (activeObject) {
      // Update font settings for text objects
      if (activeObject.type === 'i-text') {
        setSelectedFont(activeObject.fontFamily || FONTS[0].value);
        setSelectedFontSize(activeObject.fontSize || 24);
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

  const isTextObject = activeObject?.type === 'i-text';

  return (
    <div className={styles.toolbar}>
      {/* Add Text Button */}
      <div className={styles.toolbarSection}>
        <button
          className={styles.addTextButton}
          onClick={onAddText}
          disabled={!isCanvasReady}
          aria-label="افزودن متن"
          title="افزودن متن (T)"
        >
          <FaPlus />
          <span>افزودن متن</span>
        </button>
      </div>

      {/* Font Controls - Only for text objects */}
      {isTextObject && (
        <>
          <div className={styles.toolbarSection}>
            <label htmlFor="font-family" className={styles.label}>
              فونت:
            </label>
            <select
              id="font-family"
              className={styles.select}
              value={selectedFont}
              onChange={handleFontFamilyChange}
              disabled={!isObjectSelected}
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.toolbarSection}>
            <label htmlFor="font-size" className={styles.label}>
              اندازه:
            </label>
            <select
              id="font-size"
              className={styles.select}
              value={selectedFontSize}
              onChange={handleFontSizeChange}
              disabled={!isObjectSelected}
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Transform Controls - For all objects */}
      {isObjectSelected && (
        <>
          <div className={styles.toolbarSection}>
            <label htmlFor="object-width" className={styles.label}>
              عرض:
            </label>
            <input
              id="object-width"
              type="number"
              className={styles.numberInput}
              value={objectWidth}
              onChange={handleWidthChange}
              min="1"
              disabled={!isObjectSelected}
            />
          </div>

          <div className={styles.toolbarSection}>
            <label htmlFor="object-height" className={styles.label}>
              ارتفاع:
            </label>
            <input
              id="object-height"
              type="number"
              className={styles.numberInput}
              value={objectHeight}
              onChange={handleHeightChange}
              min="1"
              disabled={!isObjectSelected}
            />
          </div>

          <div className={styles.toolbarSection}>
            <button
              className={`${styles.lockButton} ${isAspectRatioLocked ? styles.locked : ''}`}
              onClick={handleAspectRatioToggle}
              disabled={!isObjectSelected}
              aria-label={isAspectRatioLocked ? 'باز کردن قفل نسبت تصویر' : 'قفل کردن نسبت تصویر'}
              title={isAspectRatioLocked ? 'باز کردن قفل نسبت تصویر' : 'قفل کردن نسبت تصویر'}
            >
              {isAspectRatioLocked ? <FaLock /> : <FaUnlock />}
            </button>
          </div>

          <div className={styles.toolbarSection}>
            <label htmlFor="skew-x" className={styles.label}>
              انحراف X:
            </label>
            <input
              id="skew-x"
              type="range"
              className={styles.slider}
              value={skewX}
              onChange={handleSkewXChange}
              min="-45"
              max="45"
              step="1"
              disabled={!isObjectSelected}
            />
            <span className={styles.sliderValue}>{Math.round(skewX)}°</span>
          </div>

          <div className={styles.toolbarSection}>
            <label htmlFor="skew-y" className={styles.label}>
              انحراف Y:
            </label>
            <input
              id="skew-y"
              type="range"
              className={styles.slider}
              value={skewY}
              onChange={handleSkewYChange}
              min="-45"
              max="45"
              step="1"
              disabled={!isObjectSelected}
            />
            <span className={styles.sliderValue}>{Math.round(skewY)}°</span>
          </div>

          <div className={styles.toolbarSection}>
            <button
              className={styles.deleteButton}
              onClick={onDeleteSelected}
              disabled={!isObjectSelected}
              aria-label="حذف شی"
              title="حذف شی (Delete)"
            >
              <FaTrash />
              <span>حذف</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CanvasToolbar;
