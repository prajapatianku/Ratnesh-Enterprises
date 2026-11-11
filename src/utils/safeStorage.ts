import { ShopSettings, ProductItem } from '../types';

/**
 * Sanitizes shop settings before saving to localStorage to prevent
 * exceeding browser's strict 5MB quota (QuotaExceededError).
 */
export function sanitizeSettingsForStorage(settings: ShopSettings): ShopSettings {
  const clone = { ...settings };

  // If a video URL is a huge base64 data string or blob URL, do not store it in localStorage!
  if (clone.showroomVideo) {
    const vUrl = clone.showroomVideo.videoUrl;
    if (vUrl && !vUrl.startsWith('http://') && !vUrl.startsWith('https://')) {
      if (vUrl.startsWith('data:') || vUrl.startsWith('blob:') || vUrl.length > 300) {
        clone.showroomVideo = {
          ...clone.showroomVideo,
          videoUrl: 'local_indexeddb', // pointer indicating it's stored in IndexedDB
        };
      }
    }
  }

  return clone;
}

/**
 * Safely writes to localStorage with automatic QuotaExceededError recovery.
 * Uses console.warn instead of console.error so non-critical cache write limits
 * do not trigger dev server panic.
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: unknown) {
    console.warn(`[SafeStorage] localStorage quota reached while saving "${key}". Running cleanup...`, err);

    // Attempt emergency cleanup of temporary or non-critical keys
    try {
      // Clear non-critical caches
      const keysToClear = ['grand_royal_quote', 'cached_dist_info'];
      for (const k of keysToClear) {
        if (k !== key) {
          localStorage.removeItem(k);
        }
      }
      // Retry once after clearing
      localStorage.setItem(key, value);
      return true;
    } catch {
      console.warn(`[SafeStorage] Could not persist "${key}" to localStorage. State remains active in memory & cloud.`);
      return false;
    }
  }
}
