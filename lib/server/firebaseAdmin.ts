// ─── Firebase Admin (server-only) ─────────────────────────────────────────
// The storefront talks to Firestore with the client SDK as a signed-in admin.
// Server routes have no user session, so they use the Admin SDK with a service
// account instead. Never import this from a client component — it holds a
// private key.

import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

export class AdminNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminNotConfiguredError";
  }
}

interface ServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

// Accepts either the whole service-account JSON in one variable (easiest to
// paste into Vercel) or the three fields separately.
function readServiceAccount(): ServiceAccount {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(json) as Record<string, unknown>;
    } catch {
      throw new AdminNotConfiguredError(
        "FIREBASE_SERVICE_ACCOUNT_JSON is set but isn't valid JSON. Paste the whole service-account file as a single value."
      );
    }
    const projectId = String(parsed.project_id ?? parsed.projectId ?? "");
    const clientEmail = String(parsed.client_email ?? parsed.clientEmail ?? "");
    const privateKey = String(parsed.private_key ?? parsed.privateKey ?? "");
    if (!projectId || !clientEmail || !privateKey) {
      throw new AdminNotConfiguredError(
        "FIREBASE_SERVICE_ACCOUNT_JSON is missing project_id, client_email or private_key."
      );
    }
    return { projectId, clientEmail, privateKey: normaliseKey(privateKey) };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new AdminNotConfiguredError(
      "Firebase admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON (or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY)."
    );
  }

  return { projectId, clientEmail, privateKey: normaliseKey(privateKey) };
}

// Vercel stores newlines as the two characters \n — turn them back into real
// newlines or the key fails to parse.
function normaliseKey(key: string): string {
  return key.replace(/\\n/g, "\n");
}

const APP_NAME = "arcane-admin";

function adminApp(): App {
  const existing = getApps().find((a) => a.name === APP_NAME);
  if (existing) return getApp(APP_NAME);

  const { projectId, clientEmail, privateKey } = readServiceAccount();
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId }, APP_NAME);
}

export function adminDb(): Firestore {
  return getFirestore(adminApp());
}
