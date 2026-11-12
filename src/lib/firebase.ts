import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { ProductItem, ShopSettings } from '../types';
import { compressDataUrlIfNeeded, compressBannerDataUrl } from '../utils/imageCompressor';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    return false;
  }
}

// Cloud Products API
export async function fetchProductsFromCloud(): Promise<ProductItem[]> {
  const colPath = 'products';
  try {
    const snap = await getDocs(collection(db, colPath));
    const list: ProductItem[] = [];
    snap.forEach((d) => {
      list.push(d.data() as ProductItem);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

export function subscribeToProducts(
  onSuccess: (products: ProductItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colPath = 'products';
  return onSnapshot(
    collection(db, colPath),
    (snap) => {
      const list: ProductItem[] = [];
      snap.forEach((d) => {
        list.push({ ...(d.data() as ProductItem), id: d.id });
      });
      onSuccess(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Recursively strips undefined fields and empty non-values so that Firestore setDoc
 * never throws "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        cleanObj[key] = sanitizeForFirestore(val);
      }
    }
    return cleanObj as T;
  }
  return data;
}

export async function saveProductToCloud(product: ProductItem): Promise<void> {
  const cleanId = (product.id || `prod-${Date.now()}`).replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 100);
  const docPath = `products/${cleanId}`;
  try {
    let cleanImages: string[] | undefined = undefined;
    if (product.images && Array.isArray(product.images)) {
      cleanImages = await Promise.all(
        product.images.slice(0, 3).map(async (img) => {
          if (img && img.startsWith('data:image')) {
            return await compressDataUrlIfNeeded(img, 900, 0.65);
          }
          return img;
        })
      );
    }

    let cleanImageUrl = (cleanImages && cleanImages.length > 0) ? cleanImages[0] : product.customImageUrl;
    if (cleanImageUrl && cleanImageUrl.startsWith('data:image')) {
      cleanImageUrl = await compressDataUrlIfNeeded(cleanImageUrl, 900, 0.65);
    }

    // Enforce Firestore security rules field types and max lengths
    const safeCategory = ['tiles', 'sanitary', 'fittings'].includes(product.category)
      ? product.category
      : 'tiles';

    const payload = sanitizeForFirestore({
      ...product,
      id: cleanId,
      name: String(product.name || 'Untitled Design').trim().slice(0, 128) || 'Untitled Design',
      brand: String(product.brand || 'Custom').trim().slice(0, 64) || 'Custom',
      category: safeCategory,
      size: String(product.size || 'Standard Size').trim().slice(0, 64) || 'Standard Size',
      finish: String(product.finish || 'Polished').trim().slice(0, 64) || 'Polished',
      customImageUrl: cleanImageUrl || '',
      images: cleanImages && cleanImages.length > 0 ? cleanImages : (cleanImageUrl ? [cleanImageUrl] : []),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'products', cleanId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  const rawId = (productId || '').trim();
  const cleanId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 100);
  const docPath = `products/${rawId || cleanId}`;
  try {
    if (rawId && /^[a-zA-Z0-9_\-]+$/.test(rawId) && rawId.length <= 128) {
      await deleteDoc(doc(db, 'products', rawId));
    }
    if (cleanId && cleanId !== rawId) {
      await deleteDoc(doc(db, 'products', cleanId));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function seedInitialProducts(products: ProductItem[]): Promise<void> {
  const colPath = 'products';
  try {
    const settingsRef = doc(db, 'settings', 'shop');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists() && settingsSnap.data()?.catalogInitialized === true) {
      return;
    }

    const snap = await getDocs(collection(db, colPath));
    if (snap.empty) {
      const batch = writeBatch(db);
      for (const p of products) {
        const cleanId = p.id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 100);
        batch.set(doc(db, 'products', cleanId), sanitizeForFirestore({
          ...p,
          id: cleanId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }
      await batch.commit();

      if (settingsSnap.exists()) {
        await setDoc(settingsRef, { catalogInitialized: true }, { merge: true });
      }
    }
  } catch (error) {
    console.warn('Could not seed initial products directly to cloud:', error);
  }
}

export async function batchSaveProductsToCloud(products: ProductItem[]): Promise<void> {
  for (const p of products) {
    try {
      await saveProductToCloud(p);
    } catch (e) {
      console.warn(`Could not save product ${p.id} to cloud:`, e);
    }
  }
}

// Cloud Settings API
export async function saveSettingsToCloud(settings: ShopSettings): Promise<void> {
  const docPath = 'settings/shop';
  try {
    const rawSettings: any = JSON.parse(JSON.stringify(settings));

    // Protect against Firestore 1MB doc size limit:
    // If a showroom video URL is a local blob:, 'local_indexeddb', or bulky data URL,
    // do NOT save that huge local binary to Firestore. Delete the field instead of setting to undefined.
    if (rawSettings.showroomVideo) {
      const vUrl = rawSettings.showroomVideo.videoUrl;
      if (
        !vUrl ||
        vUrl === 'local_indexeddb' ||
        vUrl.startsWith('blob:') ||
        (vUrl.startsWith('data:') && vUrl.length > 50000)
      ) {
        delete rawSettings.showroomVideo.videoUrl;
      }
      if (Object.keys(rawSettings.showroomVideo).length === 0) {
        delete rawSettings.showroomVideo;
      }
    }

    // Protect Firestore 1MB limit by ensuring any custom base64 hero banners are safely compressed
    if (rawSettings.heroBanners && Array.isArray(rawSettings.heroBanners)) {
      rawSettings.heroBanners = await Promise.all(
        rawSettings.heroBanners.map(async (banner: any) => {
          if (banner.imageUrl && banner.imageUrl.startsWith('data:image')) {
            const compressed = await compressBannerDataUrl(banner.imageUrl);
            return {
              ...banner,
              imageUrl: compressed,
            };
          }
          return banner;
        })
      );
    }

    // Enforce Firestore security rules lengths for settings
    const payload = sanitizeForFirestore({
      ...rawSettings,
      shopName: String(rawSettings.shopName || 'Ratnesh Enterprises').slice(0, 128),
      whatsappNumber: String(rawSettings.whatsappNumber || '918709489716').slice(0, 32),
      phoneNumber: String(rawSettings.phoneNumber || '+91 87094 89716').slice(0, 32),
      address: String(rawSettings.address || 'Bokaro Steel City, Jharkhand').slice(0, 512),
      catalogInitialized: true,
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'settings', 'shop'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export function subscribeToSettings(
  onSuccess: (settings: ShopSettings) => void,
  onError?: (error: unknown) => void
) {
  const docPath = 'settings/shop';
  return onSnapshot(
    doc(db, 'settings', 'shop'),
    (snap) => {
      if (snap.exists()) {
        onSuccess(snap.data() as ShopSettings);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, docPath);
    }
  );
}

// Google Auth Sign-In for Admin / Store Owners
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Uploads a showroom tour video file to Firebase Cloud Storage (tickmark-346bb.firebasestorage.app)
 * and returns the public download URL to be stored in Firestore settings so all devices can stream it.
 */
export function uploadVideoToCloudStorage(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileExt = file.name.split('.').pop() || 'mp4';
    const filePath = `showroom/video-${Date.now()}.${fileExt}`;
    const fileRef = storageRef(storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type || 'video/mp4',
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}
