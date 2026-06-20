// ─── Users data access ────────────────────────────────────────────────────
// Customer/account records, mirrored from Firebase Auth into Firestore so the
// CRM can list and annotate customers.

import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/config";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: "admin" | "customer";
  createdAt: Date | null;
  lastSeenAt: Date | null;
}

function tsToDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

// Create the user's profile doc on first sign-in, and refresh lastSeenAt on
// every sign-in. Uses merge so we never clobber existing fields.
export async function ensureUserProfile(user: User): Promise<void> {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      role: isAdminEmail(user.email) ? "admin" : "customer",
      // createdAt only set on first write thanks to merge + the field already
      // existing on subsequent writes is preserved by serverTimestamp idempotency
      // guard below.
      lastSeenAt: serverTimestamp(),
      ...((user.metadata?.creationTime
        ? { createdAt: new Date(user.metadata.creationTime) }
        : {})),
    },
    { merge: true }
  );
}

// All customers — admin only (enforced by rules).
export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, "users"));
  const users = snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: (data.uid as string) ?? d.id,
      email: (data.email as string) ?? "",
      displayName: (data.displayName as string | null) ?? null,
      photoURL: (data.photoURL as string | null) ?? null,
      role: (data.role as "admin" | "customer") ?? "customer",
      createdAt: tsToDate(data.createdAt),
      lastSeenAt: tsToDate(data.lastSeenAt),
    } satisfies UserProfile;
  });
  return users.sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
  );
}
