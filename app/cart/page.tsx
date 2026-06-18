"use client";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart, lineTotal } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { PriceGate } from "@/components/ui/PriceGate";
import { getBulkDiscount } from "@/lib/config";
import { FREE_SHIPPING_THRESHOLD_GBP } from "@/lib/config";

export default function CartPage() {
  const { items, removeItem, setQty, total, count } = useCart();
  const { format } = useCurrency();
  const { user } = useAuth();

  const freeShipping = total >= FREE_SHIPPING_THRESHOLD_GBP;
  const shippingRemaining = FREE_SHIPPING_THRESHOLD_GBP - total;

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          Your cart is empty
        </h1>
        <p className="mb-6" style={{ color: "var(--muted)" }}>
          Add research compounds from the catalogue.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-syne), sans-serif" }}
      >
        Cart ({count} item{count !== 1 ? "s" : ""})
      </h1>

      {/* Free shipping progress */}
      {!freeShipping && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
            Add {format(shippingRemaining)} more for free UK delivery
          </p>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--surface-3)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD_GBP) * 100)}%`,
                background: "var(--accent)",
              }}
            />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => {
            const discount = getBulkDiscount(item.qty);
            const lt = lineTotal(item);

            return (
              <div
                key={item.variantSku}
                className="flex gap-4 p-4 rounded-lg"
                style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
              >
                {/* Image */}
                <div
                  className="relative w-20 h-20 shrink-0 rounded overflow-hidden"
                  style={{ background: "var(--surface-2)" }}
                >
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="30" height="30" viewBox="0 0 28 28" fill="none" className="opacity-20">
                        <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
                        <circle cx="14" cy="14" r="2.5" fill="var(--accent)" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="font-semibold text-sm hover:text-[var(--accent)] transition-colors"
                    style={{ color: "var(--text)" }}
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {item.variantLabel} · SKU: {item.variantSku}
                  </p>
                  {discount > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--green)" }}>
                      {discount}% bulk discount applied
                    </p>
                  )}
                </div>

                {/* Qty + price */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div
                    className="flex items-center border rounded text-sm"
                    style={{ borderColor: "var(--line-med)" }}
                  >
                    <button
                      onClick={() => setQty(item.variantSku, item.qty - 1)}
                      className="px-2.5 py-1 transition-colors hover:bg-[var(--surface-2)]"
                      style={{ color: "var(--muted)" }}
                      aria-label="Decrease"
                    >
                      –
                    </button>
                    <span className="px-2.5 py-1 min-w-[2rem] text-center">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.variantSku, item.qty + 1)}
                      className="px-2.5 py-1 transition-colors hover:bg-[var(--surface-2)]"
                      style={{ color: "var(--muted)" }}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  <PriceGate size="sm">
                    <span
                      className="text-sm font-bold"
                      style={{ fontFamily: "var(--font-syne), sans-serif" }}
                    >
                      {format(lt)}
                    </span>
                  </PriceGate>

                  <button
                    onClick={() => removeItem(item.variantSku)}
                    aria-label="Remove item"
                    className="transition-colors hover:text-[var(--red)]"
                    style={{ color: "var(--subtle)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div>
          <div
            className="p-6 rounded-lg sticky top-24"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <p
              className="font-bold text-lg mb-4"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              Order Summary
            </p>

            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <PriceGate size="sm"><span>{format(total)}</span></PriceGate>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Shipping (UK)</span>
                <span style={{ color: freeShipping ? "var(--green)" : "var(--text)" }}>
                  {freeShipping ? "FREE" : "Calculated at checkout"}
                </span>
              </div>
              <div
                className="pt-3 border-t flex justify-between font-bold"
                style={{ borderColor: "var(--line)" }}
              >
                <span>Total</span>
                <PriceGate size="md">
                  <span
                    style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.125rem" }}
                  >
                    {format(total)}
                  </span>
                </PriceGate>
              </div>
            </div>

            {user ? (
              <Link
                href="/checkout"
                className="block text-center py-3.5 rounded font-semibold tracking-wide transition-all hover:brightness-110"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                PROCEED TO CHECKOUT
              </Link>
            ) : (
              <Link
                href="/account"
                className="block text-center py-3.5 rounded font-semibold tracking-wide transition-all hover:brightness-110"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                SIGN IN TO CHECKOUT
              </Link>
            )}

            <p className="mt-3 text-xs text-center" style={{ color: "var(--subtle)" }}>
              Secure checkout — bank transfer or crypto
            </p>

            <div
              className="mt-4 p-3 rounded text-xs leading-relaxed"
              style={{ background: "var(--surface-2)", color: "var(--muted)" }}
            >
              ⚗ All products for laboratory research use only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
