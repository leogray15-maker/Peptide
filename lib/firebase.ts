import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// Some networks, proxies and browser extensions block Firestore's streaming
// WebChannel transport, which makes every read/write hang indefinitely (auth
// still works because it uses plain HTTPS). Auto-detect that situation and fall
// back to long-polling so Firestore works in restrictive environments.
let firestore: Firestore;
try {
  firestore = initializeFirestore(firebaseApp, {
    experimentalAutoDetectLongPolling: true,
  });
} catch {
  // Already initialized (e.g. during hot-reload) — reuse the existing instance.
  firestore = getFirestore(firebaseApp);
}
export const db = firestore;
