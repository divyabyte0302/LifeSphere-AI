import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { HydrationLogEntry } from '../types/hydration';

const env = (typeof import.meta !== 'undefined' && import.meta && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyFakeKeyForPreviewDevelopment_LifeSphere',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'lifesphere-ai-production.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'lifesphere-ai-production',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'lifesphere-ai-production.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '999251586362',
  appId: env.VITE_FIREBASE_APP_ID || '1:999251586362:web:c45be9fc-a8f0-499e-8f6d-2365f44fe267',
};

let app: FirebaseApp | undefined;
let firestoreDb: Firestore | null = null;

const isNodeCli = typeof window === 'undefined' && typeof process !== 'undefined';
const isTestMode = isNodeCli || (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.LIFESPHERE_TEST_MODE === 'true'));

if (!isTestMode) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firestoreDb = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization note (offline/sandbox fallback enabled):', err);
  }
}

export { app, firestoreDb, firestoreDb as db };

/**
 * Persists a daily water intake record to Firestore collection: users/{uid}/hydration/{recordId}
 */
export async function persistHydrationRecordToFirestore(
  uid: string,
  entry: HydrationLogEntry
): Promise<{ success: boolean; path: string; error?: string }> {
  const collectionPath = `users/${uid}/hydration`;
  const documentPath = `${collectionPath}/${entry.id}`;

  if (!firestoreDb) {
    return {
      success: true,
      path: documentPath,
      error: 'In-memory/offline mode active',
    };
  }

  try {
    const docRef = doc(firestoreDb, 'users', uid, 'hydration', entry.id);
    const payload = {
      id: entry.id,
      userId: uid,
      volumeMl: entry.volumeMl,
      effectiveMl: entry.effectiveMl,
      beverageType: entry.beverageType,
      source: entry.source,
      notes: entry.notes || '',
      timestamp: entry.timestamp,
      timeFormatted: entry.timeFormatted,
      createdAt: entry.createdAt || entry.timestamp,
    };

    // Use timeout race to avoid freezing UI if network drops or blocked in preview
    await Promise.race([
      setDoc(docRef, payload, { merge: true }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore operation timed out')), 4000)
      ),
    ]);

    return { success: true, path: documentPath };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Firestore persistence notice for ${documentPath}:`, message);
    return {
      success: false,
      path: documentPath,
      error: message,
    };
  }
}

/**
 * Loads recent hydration records from Firestore: users/{uid}/hydration
 */
export async function loadHydrationRecordsFromFirestore(
  uid: string,
  maxEntries = 50
): Promise<{ success: boolean; records: HydrationLogEntry[]; path: string }> {
  const collectionPath = `users/${uid}/hydration`;

  if (!firestoreDb) {
    return { success: false, records: [], path: collectionPath };
  }

  try {
    const colRef = collection(firestoreDb, 'users', uid, 'hydration');
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(maxEntries));

    const querySnapshot = await Promise.race([
      getDocs(q),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore query timed out')), 4000)
      ),
    ]);

    const records: HydrationLogEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      records.push({
        id: docSnap.id,
        userId: data.userId || uid,
        timestamp: data.timestamp || new Date().toISOString(),
        timeFormatted: data.timeFormatted || '',
        volumeMl: Number(data.volumeMl) || 0,
        effectiveMl: Number(data.effectiveMl) || 0,
        beverageType: data.beverageType || 'water',
        source: data.source || 'quick_preset',
        notes: data.notes || '',
        createdAt: data.createdAt,
      });
    });

    return { success: true, records, path: collectionPath };
  } catch (error) {
    console.warn(`Firestore read notice for ${collectionPath}:`, error);
    return { success: false, records: [], path: collectionPath };
  }
}

/**
 * Deletes a hydration record from Firestore: users/{uid}/hydration/{recordId}
 */
export async function deleteHydrationRecordFromFirestore(
  uid: string,
  recordId: string
): Promise<{ success: boolean; path: string }> {
  const documentPath = `users/${uid}/hydration/${recordId}`;

  if (!firestoreDb) {
    return { success: true, path: documentPath };
  }

  try {
    const docRef = doc(firestoreDb, 'users', uid, 'hydration', recordId);
    await Promise.race([
      deleteDoc(docRef),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore deletion timed out')), 3000)
      ),
    ]);
    return { success: true, path: documentPath };
  } catch (error) {
    console.warn(`Firestore deletion notice for ${documentPath}:`, error);
    return { success: false, path: documentPath };
  }
}
