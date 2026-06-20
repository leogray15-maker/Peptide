"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/config";
import { ensureUserProfile } from "@/lib/db/users";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      // Mirror the auth user into Firestore (best-effort — never blocks sign-in).
      if (u) {
        ensureUserProfile(u).catch(() => {
          /* profile sync is non-critical */
        });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        isAdmin: isAdminEmail(user?.email),
        signIn: async (email, password) => {
          await signInWithEmailAndPassword(auth, email, password);
        },
        signUp: async (email, password) => {
          await createUserWithEmailAndPassword(auth, email, password);
        },
        signInWithGoogle: async () => {
          await signInWithPopup(auth, googleProvider);
        },
        signOut: async () => {
          await firebaseSignOut(auth);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
