"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, Users, RefreshCw, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  getAllOrders,
  updateOrder,
  ORDER_STATUSES,
  ORDER_STATUS_META,
  type Order,
  type OrderStatus,
} from "@/lib/db/orders";
import { getAllUsers, type UserProfile } from "@/lib/db/users";

type Tab = "orders" | "customers";

export default function AdminClient() {
  const { user, loading, isAdmin } = useAuth();
  const { format } = useCurrency();

  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [o, u] = await Promise.all([getAllOrders(), getAllUsers()]);
      setOrders(o);
      setUsers(u);
    } catch {
      setError("Could not load CRM data. Check your connection and Firestore rules.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Initial load. State updates happen after the await (not synchronously),
  // so this doesn't trigger cascading renders.
  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    (async () => {
      try {
        const [o, u] = await Promise.all([getAllOrders(), getAllUsers()]);
        if (!active) return;
        setOrders(o);
        setUsers(u);
      } catch {
        if (active) setError("Could not load CRM data. Check your connection and Firestore rules.");
      }
    })();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const stats = useMemo(() => {
    const list = orders ?? [];
    const revenue = list
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalGBP, 0);
    const pending = list.filter((o) => o.status === "pending_payment").length;
    return { count: list.length, revenue, pending, customers: users?.length ?? 0 };
  }, [orders, users]);

  function handleOrderUpdated(orderId: string, patch: Partial<Order>) {
    setOrders((prev) =>
      prev ? prev.map((o) => (o.orderId === orderId ? { ...o, ...patch } : o)) : prev
    );
  }

  // ── Gating ──
  if (loading) {
    return <Centered>Loading…</Centered>;
  }
  if (!user) {
    return (
      <Centered>
        <ShieldAlert size={28} style={{ color: "var(--amber)" }} className="mb-3" />
        <p className="mb-4" style={{ color: "var(--muted)" }}>
          You must be signed in to access the admin area.
        </p>
        <Link
          href="/account"
          className="px-6 py-3 rounded font-semibold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Sign In
        </Link>
      </Centered>
    );
  }
  if (!isAdmin) {
    return (
      <Centered>
        <ShieldAlert size={28} style={{ color: "#E74C3C" }} className="mb-3" />
        <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>
          Access denied
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          This account ({user.email}) is not authorised for the admin dashboard.
        </p>
      </Centered>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={26} style={{ color: "var(--accent)" }} />
          <div>
            <p className="label-upper">Admin</p>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              CRM Dashboard
            </h1>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold border transition-colors hover:bg-[var(--surface-2)] disabled:opacity-50"
          style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={String(stats.count)} />
        <StatCard label="Revenue (excl. cancelled)" value={format(stats.revenue)} />
        <StatCard label="Pending Payment" value={String(stats.pending)} accent="var(--amber)" />
        <StatCard label="Customers" value={String(stats.customers)} />
      </div>

      {error && (
        <p className="mb-6 text-sm" style={{ color: "#E74C3C" }}>{error}</p>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: "var(--line)" }}>
        {([
          { key: "orders" as const, label: "Orders", icon: Package },
          { key: "customers" as const, label: "Customers", icon: Users },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors"
            style={{
              borderColor: tab === key ? "var(--accent)" : "transparent",
              color: tab === key ? "var(--accent)" : "var(--muted)",
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === "orders" ? (
        orders === null ? (
          <p style={{ color: "var(--muted)" }}>Loading orders…</p>
        ) : orders.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No orders yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((o) => (
              <OrderRow key={o.orderId} order={o} format={format} onUpdated={handleOrderUpdated} />
            ))}
          </div>
        )
      ) : users === null ? (
        <p style={{ color: "var(--muted)" }}>Loading customers…</p>
      ) : users.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No customers yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((u) => {
            const orderCount = (orders ?? []).filter((o) => o.userId === u.uid).length;
            return (
              <div
                key={u.uid}
                className="flex items-center justify-between gap-4 p-4 rounded-lg"
                style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
                    {u.displayName || u.email}
                    {u.role === "admin" && (
                      <span
                        className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded align-middle"
                        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                      >
                        ADMIN
                      </span>
                    )}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
                    {u.email} · Joined {u.createdAt ? u.createdAt.toLocaleDateString() : "—"}
                  </p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                  {orderCount} order{orderCount !== 1 ? "s" : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  format,
  onUpdated,
}: {
  order: Order;
  format: (gbp: number) => string;
  onUpdated: (orderId: string, patch: Partial<Order>) => void;
}) {
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [saving, setSaving] = useState(false);
  const meta = ORDER_STATUS_META[order.status];

  async function changeStatus(status: OrderStatus) {
    setSaving(true);
    try {
      await updateOrder(order.orderId, { status });
      onUpdated(order.orderId, { status });
    } finally {
      setSaving(false);
    }
  }

  async function saveTracking() {
    const next = tracking.trim();
    if (next === (order.trackingNumber ?? "")) return;
    setSaving(true);
    try {
      await updateOrder(order.orderId, { trackingNumber: next });
      onUpdated(order.orderId, { trackingNumber: next });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="p-4 rounded-lg"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-syne), sans-serif" }}>
              {order.orderId}
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{ background: `${meta.color}22`, color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {order.createdAt ? order.createdAt.toLocaleString() : "—"} · {order.customerName} · {order.customerEmail}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {order.paymentMethod.replace("_", " ")} · {order.shippingAddress}
          </p>
        </div>
        <p className="font-bold shrink-0" style={{ color: "var(--text)", fontFamily: "var(--font-syne), sans-serif" }}>
          {format(order.totalGBP)}
        </p>
      </div>

      {/* Items */}
      <div className="mt-3 flex flex-col gap-1">
        {order.items.map((i) => (
          <div key={i.variantSku} className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>{i.name} — {i.variantLabel} × {i.qty}</span>
            <span>{format(i.priceGBP * i.qty)}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
        <label className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
          Status
          <select
            value={order.status}
            disabled={saving}
            onChange={(e) => changeStatus(e.target.value as OrderStatus)}
            className="text-sm rounded px-2 py-1.5 border"
            style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{ORDER_STATUS_META[s].label}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs flex-1 min-w-[200px]" style={{ color: "var(--muted)" }}>
          Tracking
          <input
            type="text"
            value={tracking}
            disabled={saving}
            onChange={(e) => setTracking(e.target.value)}
            onBlur={saveTracking}
            onKeyDown={(e) => e.key === "Enter" && saveTracking()}
            placeholder="Add tracking number…"
            className="flex-1 text-sm rounded px-2 py-1.5 border"
            style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
          />
        </label>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
      <p className="label-upper mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: accent ?? "var(--text)", fontFamily: "var(--font-syne), sans-serif" }}>
        {value}
      </p>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 flex flex-col items-center text-center">
      {children}
    </div>
  );
}
