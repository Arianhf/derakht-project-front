'use client';

import React, { useState, useRef } from 'react';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import styles from './AssetsPanel.module.scss';
import { toast } from 'react-hot-toast';

interface AssetsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (url: string) => void;
}

interface Asset {
  id: string;
  url: string;
  name: string;
}

/**
 * AssetsPanel - Panel for managing reusable images
 * Users can upload images and click to add them to the canvas
 */
const AssetsPanel: React.FC<AssetsPanelProps> = ({ isOpen, onClose, onAssetSelect }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} یک تصویر معتبر نیست`);
        return;
      }

      const url = URL.createObjectURL(file);
      const newAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        name: file.name,
      };

      setAssets((prev) => [...prev, newAsset]);
    });

    toast.success('تصاویر اضافه شدند');
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
    toast.success('تصویر حذف شد');
  };

  const handleAssetClick = (asset: Asset) => {
    onAssetSelect(asset.url);
    toast.success('تصویر به کنواس اضافه شد');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.assetsPanelOverlay} onClick={onClose}>
      <div className={styles.assetsPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>مدیریت تصاویر</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="بستن پنل"
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.uploadSection}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <button
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaPlus /> آپلود تصویر جدید
          </button>
          <p className={styles.hint}>
            تصاویر آپلود شده را می‌توانید با کلیک روی آنها به کنواس اضافه کنید
          </p>
        </div>

        <div className={styles.assetsGrid}>
          {assets.length === 0 ? (
            <div className={styles.emptyState}>
              <p>هنوز تصویری آپلود نشده است</p>
              <p>برای شروع روی دکمه بالا کلیک کنید</p>
            </div>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className={styles.assetCard}>
                <div
                  className={styles.assetImage}
                  onClick={() => handleAssetClick(asset)}
                >
                  <Image
                    src={asset.url}
                    alt={asset.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.assetInfo}>
                  <span className={styles.assetName} title={asset.name}>
                    {asset.name}
                  </span>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(asset.id)}
                    aria-label="حذف تصویر"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetsPanel;
