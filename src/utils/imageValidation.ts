/**
 * Image Validation Utility
 *
 * Validates image files before upload to ensure they meet requirements
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an image file for upload
 *
 * Checks:
 * - File type (JPEG, PNG, GIF, WebP)
 * - File size (max 10MB before compression)
 *
 * @param file - The image file to validate
 * @returns ValidationResult with valid flag and error message if invalid
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'فایلی انتخاب نشده است.'
    };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'فرمت تصویر مجاز نیست. فقط JPG، PNG، GIF و WebP پذیرفته می‌شود.'
    };
  }

  // Check file size (10MB limit before compression - matches backend)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `حجم تصویر (${sizeMB} مگابایت) بیش از حد مجاز است. حداکثر حجم: 10 مگابایت`
    };
  }

  // Check file name (basic sanitization)
  if (file.name.length === 0) {
    return {
      valid: false,
      error: 'نام فایل نامعتبر است.'
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions
 *
 * @param file - The image file
 * @param maxWidth - Maximum width (optional)
 * @param maxHeight - Maximum height (optional)
 * @returns Promise<ImageValidationResult>
 */
export async function validateImageDimensions(
  file: File,
  maxWidth?: number,
  maxHeight?: number
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        if (maxWidth && img.width > maxWidth) {
          resolve({
            valid: false,
            error: `عرض تصویر (${img.width}px) بیش از حد مجاز (${maxWidth}px) است.`
          });
          return;
        }

        if (maxHeight && img.height > maxHeight) {
          resolve({
            valid: false,
            error: `ارتفاع تصویر (${img.height}px) بیش از حد مجاز (${maxHeight}px) است.`
          });
          return;
        }

        resolve({ valid: true });
      };

      img.onerror = () => {
        resolve({
          valid: false,
          error: 'فایل تصویر معتبر نیست.'
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        valid: false,
        error: 'خطا در خواندن فایل.'
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions from file
 *
 * @param file - The image file
 * @returns Promise<{width: number, height: number}>
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}
