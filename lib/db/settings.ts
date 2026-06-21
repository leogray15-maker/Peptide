// ─── Site settings (admin-editable) ──────────────────────────────────────
// Payment details shown at checkout. Stored in a single Firestore document so
// the admin can update bank / crypto details without a redeploy. Falls back to
// environment variables when a field hasn't been set in the CRM.

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface PaymentSettings {
  bankName: string;
  sortCode: string;
  accountNumber: string;
  accountName: string;
  iban: string;
  btcAddress: string;
  ethAddress: string;
  usdtTrc20: string;
}

export const EMPTY_PAYMENT_SETTINGS: PaymentSettings = {
  bankName: "",
  sortCode: "",
  accountNumber: "",
  accountName: "",
  iban: "",
  btcAddress: "",
  ethAddress: "",
  usdtTrc20: "",
};

export const PAYMENT_FIELDS: {
  key: keyof PaymentSettings;
  label: string;
  group: "Bank Transfer" | "Crypto Wallets";
  placeholder?: string;
}[] = [
  { key: "bankName", label: "Bank Name", group: "Bank Transfer", placeholder: "Monzo Bank" },
  { key: "accountName", label: "Account Name", group: "Bank Transfer", placeholder: "Arcane Peptides Ltd" },
  { key: "sortCode", label: "Sort Code", group: "Bank Transfer", placeholder: "00-00-00" },
  { key: "accountNumber", label: "Account Number", group: "Bank Transfer", placeholder: "00000000" },
  { key: "iban", label: "IBAN", group: "Bank Transfer", placeholder: "GB00XXXX…" },
  { key: "btcAddress", label: "Bitcoin (BTC) Address", group: "Crypto Wallets", placeholder: "bc1q…" },
  { key: "ethAddress", label: "Ethereum (ETH) Address", group: "Crypto Wallets", placeholder: "0x…" },
  { key: "usdtTrc20", label: "USDT (TRC-20) Address", group: "Crypto Wallets", placeholder: "T…" },
];

const settingsRef = () => doc(db, "settings", "payment");

// Never let a Firestore call hang the UI indefinitely. If the network or rules
// leave a request pending, reject after `ms` so callers can fall back / show
// an error instead of an endless spinner. We also log the request's *eventual*
// real outcome (even after the timeout fires) so the true Firestore error code
// is visible in the console for diagnosis.
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  promise.then(
    () => console.info(`[Firestore] ${label} actually succeeded`),
    (e: { code?: string; message?: string }) =>
      console.warn(`[Firestore] ${label} truly failed →`, e?.code ?? "(no code)", e?.message ?? e)
  );
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        const err = new Error(`${label} timed out`) as Error & { code?: string };
        err.code = "deadline-exceeded";
        reject(err);
      }, ms)
    ),
  ]);
}

export async function getPaymentSettings(): Promise<Partial<PaymentSettings> | null> {
  const snap = await withTimeout(getDoc(settingsRef()), 8000, "Payment settings read");
  return snap.exists() ? (snap.data() as Partial<PaymentSettings>) : null;
}

export async function savePaymentSettings(data: PaymentSettings): Promise<void> {
  await withTimeout(
    setDoc(settingsRef(), { ...data, updatedAt: serverTimestamp() }, { merge: true }),
    8000,
    "Payment settings save"
  );
}
