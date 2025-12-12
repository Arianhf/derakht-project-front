'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ColorPicker.module.scss';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#2B463C', '#000000', '#FF6F61', '#345BC0',
  '#F4A261', '#E76F51', '#2A9D8F', '#E9C46A',
  '#FFFFFF', '#808080', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update hex input when color prop changes
  useEffect(() => {
    setHexInput(color);
  }, [color]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow only valid hex characters
    if (!/^#?[0-9A-Fa-f]{0,6}$/.test(value)) {
      return;
    }

    // Add # prefix if not present
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }

    setHexInput(value);

    // Only update color if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value.toUpperCase());
    }
  };

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor);
    setHexInput(presetColor);
  };

  return (
    <div className={styles.colorPickerWrapper} ref={pickerRef}>
      <button
        className={styles.colorButton}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{ backgroundColor: color }}
        aria-label="انتخاب رنگ"
        title="انتخاب رنگ"
      >
        <div className={styles.colorPreview} style={{ backgroundColor: color }} />
      </button>

      {isOpen && (
        <div className={styles.colorPickerDropdown}>
          <div className={styles.pickerHeader}>
            <span>انتخاب رنگ</span>
          </div>

          {/* Hex Input */}
          <div className={styles.hexInput}>
            <label htmlFor="hex-color-input">کد رنگ:</label>
            <input
              id="hex-color-input"
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#000000"
              maxLength={7}
              className={styles.hexField}
            />
          </div>

          {/* Preset Colors */}
          <div className={styles.presetColors}>
            <span className={styles.presetLabel}>رنگ‌های پیش‌فرض:</span>
            <div className={styles.colorGrid}>
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`${styles.presetSwatch} ${
                    color === presetColor ? styles.active : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetClick(presetColor)}
                  aria-label={`انتخاب رنگ ${presetColor}`}
                  title={presetColor}
                >
                  {color === presetColor && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Native Color Picker */}
          <div className={styles.nativePickerWrapper}>
            <label htmlFor="native-color-picker">انتخاب رنگ دلخواه:</label>
            <input
              id="native-color-picker"
              type="color"
              value={color}
              onChange={(e) => {
                const newColor = e.target.value.toUpperCase();
                onChange(newColor);
                setHexInput(newColor);
              }}
              className={styles.nativePicker}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
