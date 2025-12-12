'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTrash, FaTimes, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import styles from './AssetsPanel.module.scss';
import { toast } from 'react-hot-toast';
import { Asset } from '@/types/story';
import { storyService } from '@/services/storyService';

interface AssetsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (url: string) => void;
}

/**
 * AssetsPanel - Panel for managing reusable images
 * Users can upload images and click to add them to the canvas
 */
const AssetsPanel: React.FC<AssetsPanelProps> = ({ isOpen, onClose, onAssetSelect }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch assets when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await storyService.getUserAssets();
      setAssets(response.assets);
    } catch (error: any) {
      console.error('Error fetching assets:', error);
      // Only show error if it's not a 404 (no assets yet)
      if (error?.response?.status !== 404) {
        toast.error('خطا در بارگذاری تصاویر');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} یک تصویر معتبر نیست`);
          return null;
        }

        try {
          const uploadedAsset = await storyService.uploadAsset(file, file.name);
          return uploadedAsset;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(`خطا در آپلود ${file.name}`);
          return null;
        }
      });

      const uploadedAssets = await Promise.all(uploadPromises);
      const successfulUploads = uploadedAssets.filter((asset): asset is Asset => asset !== null);

      if (successfulUploads.length > 0) {
        setAssets((prev) => [...successfulUploads, ...prev]);
        toast.success(`${successfulUploads.length} تصویر آپلود شد`);
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storyService.deleteAsset(id);
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
      toast.success('تصویر حذف شد');
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('خطا در حذف تصویر');
    }
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
            disabled={isUploading}
          />
          <button
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <FaSpinner className={styles.spinner} /> در حال آپلود...
              </>
            ) : (
              <>
                <FaPlus /> آپلود تصویر جدید
              </>
            )}
          </button>
          <p className={styles.hint}>
            تصاویر آپلود شده را می‌توانید با کلیک روی آنها به کنواس اضافه کنید
          </p>
        </div>

        <div className={styles.assetsGrid}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <FaSpinner className={styles.spinner} />
              <p>در حال بارگذاری...</p>
            </div>
          ) : assets.length === 0 ? (
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
