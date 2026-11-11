/**
 * IndexedDB helper for storing local showroom videos and large binary media
 * without exceeding the browser's 5MB localStorage quota.
 */

const DB_NAME = 'RatneshEnterprisesMedia';
const DB_VERSION = 1;
const STORE_NAME = 'showroom_videos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
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

export async function saveLocalVideoBlob(key: string, data: Blob | string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, key);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Could not save video locally:', err);
  }
}

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
          resolve(URL.createObjectURL(val));
        } else if (typeof val === 'string') {
          resolve(val);
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
