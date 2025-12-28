/**
 * Image Compression Utility
 *
 * Provides high-quality image compression for template images while maintaining
 * visual quality on modern high-resolution displays.
 */

export interface CompressionOptions {
  /**
   * Maximum width in pixels (default: 2400 for modern displays)
   */
  maxWidth?: number;
  /**
   * Maximum height in pixels (default: 2400 for modern displays)
   */
  maxHeight?: number;
  /**
   * JPEG quality from 0-1 (default: 0.88 for high quality)
   */
  quality?: number;
  /**
   * Output format (default: image/jpeg for best compression)
   */
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
}

/**
 * Compress an image file while maintaining high quality for modern displays
 *
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<CompressionResult> - The compressed image blob with metadata
 *
 * @example
 * ```typescript
 * const result = await compressImage(file, {
 *   maxWidth: 2400,
 *   maxHeight: 2400,
 *   quality: 0.88,
 *   outputFormat: 'image/jpeg'
 * });
 * console.log(`Reduced size by ${result.reductionPercent}%`);
 * ```
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 2400,        // High resolution for modern displays
    maxHeight = 2400,       // Supports 4K and retina displays
    quality = 0.88,         // High quality - minimal visible loss
    outputFormat = 'image/jpeg'
  } = options;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create canvas and draw scaled image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image with high quality
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedSize = blob.size;
              const reductionPercent = Math.round(
                ((originalSize - compressedSize) / originalSize) * 100
              );

              resolve({
                blob,
                originalSize,
                compressedSize,
                reductionPercent
              });
            } else {
              reject(new Error('Compression failed'));
            }
          },
          outputFormat,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Create a File object from a Blob with proper naming
 *
 * @param blob - The image blob
 * @param originalFileName - Original file name
 * @param newExtension - New file extension (e.g., 'jpg')
 * @returns File object
 */
export function blobToFile(blob: Blob, originalFileName: string, newExtension: string): File {
  const nameWithoutExt = originalFileName.replace(/\.\w+$/, '');
  const newFileName = `${nameWithoutExt}.${newExtension}`;

  return new File([blob], newFileName, { type: blob.type });
}

/**
 * Format file size to human-readable string
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
