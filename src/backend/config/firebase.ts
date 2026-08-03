import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

// Read config dynamically relative to project root
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
let firebaseConfig: any = {};

try {
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  console.warn('[Firebase Config] Could not parse firebase-applet-config.json:', e);
}

// Initialize Firebase Admin SDK if not already initialized
let app: any;
if (getApps().length === 0) {
  try {
    const adminOptions: any = {
      projectId: firebaseConfig.projectId || 'regal-station-420318',
      storageBucket: firebaseConfig.storageBucket || 'regal-station-420318.firebasestorage.app',
    };

    // If local serviceAccountKey.json exists, load service account cert for local VS Code testing
    if (fs.existsSync(serviceAccountPath)) {
      try {
        const sa = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
        adminOptions.credential = cert(sa);
        console.log('[Firebase Admin] Loaded serviceAccountKey.json credentials.');
      } catch (saErr) {
        console.warn('[Firebase Admin] Failed parsing serviceAccountKey.json:', saErr);
      }
    }

    app = initializeApp(adminOptions);
    console.log('[Firebase Admin] Successfully initialized Firebase Admin SDK.');
  } catch (error) {
    console.error('[Firebase Admin] Initialization error:', error);
  }
} else {
  app = getApp();
}

// Get custom target Firestore Database Instance
let dbInstance: any;
try {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
  dbInstance.settings({
    ignoreUndefinedProperties: true,
  });
} catch (err: any) {
  console.warn('[Firebase Admin] Firestore settings initialization warning:', err?.message || err);
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
}

export const db = dbInstance;
export const auth = getAuth(app);
export const storage = getStorage(app);
export const config = firebaseConfig;
