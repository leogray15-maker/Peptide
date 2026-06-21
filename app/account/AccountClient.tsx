"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, MessageCircle, LogOut, Mail, Lock, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getUserOrders, ORDER_STATUS_META, type Order } from "@/lib/db/orders";
import { Button } from "@/components/ui/Button";

function friendlyAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email — try signing in instead.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before completing.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup — allow pop-ups for this site and try again.";
    case "auth/too-many-requests":
      return "Too many attempts — please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error — check your connection and try again.";
    case "auth/unauthorized-domain":
      return "This site's domain isn't authorised for sign-in yet. (Owner: add it in Firebase → Authentication → Settings → Authorized domains.)";
    case "auth/operation-not-allowed":
      return "This sign-in method isn't enabled. (Owner: enable Email/Password and Google in Firebase → Authentication → Sign-in method.)";
    case "auth/configuration-not-found":
    case "auth/invalid-api-key":
      return "Sign-in isn't configured for this site yet. (Owner: check the Firebase environment variables.)";
    default:
      return `Something went wrong. Please try again.${code ? ` (${code})` : ""}`;
  }
}

export default function AccountClient() {
  const { user, loading, isAdmin, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const { format } = useCurrency();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(friendlyAuthError(code));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(friendlyAuthError(code));
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    let active = true;
    getUserOrders(user.uid)
      .then((o) => active && setOrders(o))
      .catch(() => active && setOrders([]));
    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return <p style={{ color: "var(--muted)" }}>Loading…</p>;
  }

  if (user) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div
          className="flex items-center justify-between gap-4 p-5 rounded-lg"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <div>
            <p className="label-upper mb-1">Signed in as</p>
            <p className="font-semibold" style={{ color: "var(--text)" }}>{user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold border transition-colors hover:bg-[var(--surface-2)]"
            style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between gap-4 p-5 rounded-lg border transition-all hover:border-[var(--accent)]"
            style={{ background: "var(--accent-dim)", borderColor: "var(--accent)" }}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} style={{ color: "var(--accent)" }} />
              <div>
                <p className="font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-syne), sans-serif" }}>
                  Admin Dashboard
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Manage orders and customers.
                </p>
              </div>
            </div>
            <span style={{ color: "var(--accent)" }}>›</span>
          </Link>
        )}

        {/* Order history */}
        <div
          className="p-5 rounded-lg"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <p className="label-upper mb-4">Your Orders</p>
          {orders === null ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No orders yet.{" "}
              <Link href="/shop" className="underline" style={{ color: "var(--accent)" }}>
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: "var(--line)" }}>
              {orders.map((o) => {
                const meta = ORDER_STATUS_META[o.status];
                return (
                  <div key={o.orderId} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
                        {o.orderId}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {o.createdAt ? o.createdAt.toLocaleDateString() : "—"} ·{" "}
                        {o.items.reduce((n, i) => n + i.qty, 0)} item
                        {o.items.reduce((n, i) => n + i.qty, 0) !== 1 ? "s" : ""}
                        {o.trackingNumber ? ` · Tracking ${o.trackingNumber}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        {format(o.totalGBP)}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded"
                        style={{ background: `${meta.color}22`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/track-order"
            className="flex items-start gap-4 p-6 rounded-lg border transition-all hover:border-[var(--accent)]"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <Package size={22} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
            <div>
              <p className="font-bold mb-1" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                Track an Order
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Look up the status of an order using your tracking number.
              </p>
            </div>
          </Link>

          <Link
            href="/contact"
            className="flex items-start gap-4 p-6 rounded-lg border transition-all hover:border-[var(--accent)]"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <MessageCircle size={22} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
            <div>
              <p className="font-bold mb-1" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                Contact Us
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Questions about a past order, payment, or your account.
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm">
      <div
        className="p-6 rounded-lg"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div className="flex rounded-md overflow-hidden border mb-6" style={{ borderColor: "var(--line-med)" }}>
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className="flex-1 py-2 text-sm font-semibold transition-colors"
              style={{
                background: mode === m ? "var(--accent)" : "var(--surface-2)",
                color: mode === m ? "#fff" : "var(--muted)",
              }}
            >
              {m === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-upper block mb-1.5">Email</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ background: "var(--surface-2)", borderColor: "var(--line-med)" }}>
              <Mail size={14} style={{ color: "var(--muted)" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@research-institution.ac.uk"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text)" }}
              />
            </div>
          </div>

          <div>
            <label className="label-upper block mb-1.5">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ background: "var(--surface-2)", borderColor: "var(--line-med)" }}>
              <Lock size={14} style={{ color: "var(--muted)" }} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text)" }}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#E74C3C" }}>{error}</p>
          )}

          <Button type="submit" loading={submitting} className="mt-1">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
          <span className="text-xs" style={{ color: "var(--subtle)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
        </div>

        <button
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors hover:bg-[var(--surface-2)] disabled:opacity-50"
          style={{ borderColor: "var(--line-med)", color: "var(--text)" }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-5 text-xs leading-relaxed text-center" style={{ color: "var(--subtle)" }}>
          Prices are only visible to signed-in researchers. Creating an account is free and instant.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.8l6.6 5.6C41.7 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}
