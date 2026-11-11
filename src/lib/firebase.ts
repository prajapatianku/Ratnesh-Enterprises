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
import firebaseConfig from '../../firebase-applet-config.json';
import { ProductItem, ShopSettings } from '../types';
import { compressDataUrlIfNeeded } from '../utils/imageCompressor';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
        list.push(d.data() as ProductItem);
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
            return await compressDataUrlIfNeeded(img);
          }
          return img;
        })
      );
    }

    let cleanImageUrl = (cleanImages && cleanImages.length > 0) ? cleanImages[0] : product.customImageUrl;
    if (cleanImageUrl && cleanImageUrl.startsWith('data:image')) {
      cleanImageUrl = await compressDataUrlIfNeeded(cleanImageUrl);
    }

    const payload = sanitizeForFirestore({
      ...product,
      id: cleanId,
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
  const docPath = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function seedInitialProducts(products: ProductItem[]): Promise<void> {
  const colPath = 'products';
  try {
    const snap = await getDocs(collection(db, colPath));
    if (snap.empty) {
      const batch = writeBatch(db);
      for (const p of products) {
        batch.set(doc(db, 'products', p.id), sanitizeForFirestore({
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }
      await batch.commit();
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

    const payload = sanitizeForFirestore({
      ...rawSettings,
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
