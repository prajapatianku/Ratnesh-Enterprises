/**
 * IndexedDB helper for storing local showroom videos and large binary media
 * without exceeding the browser's 5MB localStorage quota.
 * Guarantees video persistence across page reloads and browser sessions.
 */

const DB_NAME = 'RatneshEnterprisesMedia';
const DB_VERSION = 1;
const STORE_NAME = 'showroom_videos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a video Blob, File, or video URL string to IndexedDB.
 */
export async function saveLocalVideoBlob(key: string, data: Blob | string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, key);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        try {
          // Keep a persistent flag in localStorage
          localStorage.setItem(`has_video_${key}`, 'true');
        } catch {}
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Could not save video locally:', err);
  }
}

/**
 * Retrieves the video from IndexedDB.
 * If the item is a Blob or File, it creates a fresh, valid URL.createObjectURL()
 * for the current session. If it's a string (e.g. YouTube URL), it returns the string.
 */
export async function getLocalVideoBlob(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(key);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const val = request.result;
        if (!val) {
          resolve(null);
        } else if (val instanceof Blob) {
          try {
            const freshUrl = URL.createObjectURL(val);
            resolve(freshUrl);
          } catch (e) {
            console.warn('[IndexedDB] Failed to create object URL from stored Blob:', e);
            resolve(null);
          }
        } else if (typeof val === 'string' && val.trim().length > 0) {
          resolve(val.trim());
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('[IndexedDB] Could not read video locally:', err);
    return null;
  }
}

/**
 * Deletes a video from IndexedDB.
 */
export async function deleteLocalVideoBlob(key: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        try {
          localStorage.removeItem(`has_video_${key}`);
        } catch {}
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Could not delete video:', err);
  }
}
