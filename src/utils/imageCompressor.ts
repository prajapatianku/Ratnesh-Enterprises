/**
 * Client-side image compression utility
 * Ensures phone camera photos (typically 4-12 MB) are compressed
 * to high-quality, lightweight Web JPEG images (~60-150 KB)
 * so they easily fit well under Firestore's 1MB hard document limit.
 */
export async function compressImageFile(file: File, maxDimension = 1024, quality = 0.75): Promise<string> {
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

          // If still over 500KB (rare), compress slightly more
          if (compressed.length > 500 * 1024) {
            compressed = canvas.toDataURL('image/jpeg', 0.6);
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
 * Compresses an existing base64 DataURL if it is larger than 400KB
 */
export async function compressDataUrlIfNeeded(dataUrl: string, maxDimension = 1024, quality = 0.75): Promise<string> {
  // If not a data URL or already small (< 300KB), return as is
  if (!dataUrl || !dataUrl.startsWith('data:image') || dataUrl.length < 350 * 1024) {
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
