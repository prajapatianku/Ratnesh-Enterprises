/**
 * Client-side image compression utility
 * Ensures phone camera photos (typically 4-12 MB) are compressed
 * to high-quality, lightweight Web JPEG images (~40-80 KB)
 * so they easily fit well under Firestore's 1MB hard document limit.
 */
export async function compressImageFile(file: File, maxDimension = 960, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          // Fill white background in case of transparent PNG/WebP
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG
          let compressed = canvas.toDataURL('image/jpeg', quality);

          // If still over 250KB, compress with slightly lower quality
          if (compressed.length > 250 * 1024) {
            compressed = canvas.toDataURL('image/jpeg', 0.55);
          }

          resolve(compressed);
        } catch (err) {
          console.warn('Canvas compression error, falling back to original:', err);
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Aggressively compresses a hero banner image (max 960px width, 0.65 quality JPEG)
 * to keep each slide under 50KB so that multiple custom banners can be safely stored
 * within Firestore's 1MB single-document limit and sync across mobile & laptop instantly.
 */
export async function compressBannerDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }
  // If already under 45KB, return as is
  if (dataUrl.length < 45 * 1024) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        const maxDimension = 960;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        let compressed = canvas.toDataURL('image/jpeg', 0.65);
        if (compressed.length > 80 * 1024) {
          compressed = canvas.toDataURL('image/jpeg', 0.52);
        }
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Compresses an existing base64 DataURL if it is larger than 200KB
 */
export async function compressDataUrlIfNeeded(dataUrl: string, maxDimension = 960, quality = 0.68): Promise<string> {
  // If not a data URL or already small (< 150KB), return as is
  if (!dataUrl || !dataUrl.startsWith('data:image') || dataUrl.length < 150 * 1024) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
