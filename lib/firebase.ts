import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
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

// App Check (client-only). If App Check is enforced on Firestore/Auth, every
// request must carry a token or it is blocked. The reCAPTCHA v3 *site* key is
// public and safe to ship; the matching secret lives in the Firebase console.
if (typeof window !== "undefined") {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (siteKey) {
    try {
      initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch {
      // already initialized (e.g. hot-reload) — ignore
    }
  }
}

export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// Some networks, proxies and browser extensions block Firestore's streaming
// WebChannel transport, which makes every read/write hang indefinitely (auth
// still works because it uses plain HTTPS). Force long-polling, which uses
// ordinary XHR requests and gets through these restrictive environments.
let firestore: Firestore;
try {
  firestore = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
  });
} catch {
  // Already initialized (e.g. during hot-reload) — reuse the existing instance.
  firestore = getFirestore(firebaseApp);
}
export const db = firestore;
