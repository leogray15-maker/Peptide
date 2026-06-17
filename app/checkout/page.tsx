"use client";
import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Bitcoin, Building2, ShieldCheck } from "lucide-react";
import { useCart, cartTotal } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { createOrder, type PaymentMethod, type BankInstructions, type CryptoInstructions, type CheckoutResult } from "@/lib/checkout";
import { Button } from "@/components/ui/Button";

type Step = "details" | "payment" | "confirm";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { format } = useCurrency();

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<CheckoutResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const result = await createOrder(
        {
          items,
          totalGBP: total,
          currency: "GBP",
          customerEmail: email,
          customerName: name,
          shippingAddress: address,
        },
        paymentMethod
      );
      setOrder(result);
      clearCart();
      setStep("confirm");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (items.length === 0 && step !== "confirm") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p style={{ color: "var(--muted)" }}>Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block underline" style={{ color: "var(--accent)" }}>
          Continue shopping
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
        Checkout
      </h1>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-10">
        {(["details", "payment", "confirm"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: step === s ? "var(--accent)" : s === "confirm" && step === "confirm" ? "var(--green)" : "var(--surface-2)",
                color: step === s || (s === "confirm" && step === "confirm") ? "#fff" : "var(--muted)",
              }}
            >
              {i + 1}
            </div>
            <span className="text-sm capitalize" style={{ color: step === s ? "var(--text)" : "var(--muted)" }}>
              {s === "details" ? "Your Details" : s === "payment" ? "Payment" : "Confirmed"}
            </span>
            {i < 2 && <span className="ml-2" style={{ color: "var(--subtle)" }}>›</span>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* ── Step 1: Details ── */}
          {step === "details" && (
            <div
              className="p-6 rounded-lg"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <h2 className="font-bold text-lg mb-5" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                Your Details
              </h2>

              <div className="flex flex-col gap-4">
                <Field label="Full Name" value={name} onChange={setName} placeholder="Dr. Jane Smith" />
                <Field label="Email Address" value={email} onChange={setEmail} type="email" placeholder="jane@research-institution.ac.uk" />
                <Field
                  label="Shipping Address"
                  value={address}
                  onChange={setAddress}
                  placeholder="123 Research Way, London, EC1A 1BB, UK"
                  multiline
                />
              </div>

              <Button
                className="mt-6"
                onClick={() => setStep("payment")}
                disabled={!name || !email || !address}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {/* ── Step 2: Payment method ── */}
          {step === "payment" && (
            <div
              className="p-6 rounded-lg"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <h2 className="font-bold text-lg mb-5" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                Select Payment Method
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                {(
                  [
                    { key: "bank_transfer" as const,  label: "Bank Transfer (GBP)",     icon: Building2, desc: "UK bank transfer — same-day processing on weekdays." },
                    { key: "crypto_btc"  as const,    label: "Bitcoin (BTC)",            icon: Bitcoin,   desc: "Pay with BTC — rate locked at time of order." },
                    { key: "crypto_eth"  as const,    label: "Ethereum (ETH)",           icon: Bitcoin,   desc: "Pay with ETH — rate locked at time of order." },
                    { key: "crypto_usdt" as const,    label: "USDT (TRC-20 / Tron)",    icon: Bitcoin,   desc: "Stablecoin — exact GBP equivalent." },
                  ] satisfies { key: PaymentMethod; label: string; icon: typeof Bitcoin; desc: string }[]
                ).map(({ key, label, icon: Icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key)}
                    className="flex items-start gap-4 p-4 rounded-lg border text-left transition-all"
                    style={{
                      borderColor: paymentMethod === key ? "var(--accent)" : "var(--line-med)",
                      background: paymentMethod === key ? "var(--accent-dim)" : "transparent",
                    }}
                  >
                    <Icon size={20} className="shrink-0 mt-0.5" style={{ color: paymentMethod === key ? "var(--accent)" : "var(--muted)" }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep("details")}>Back</Button>
                <Button loading={loading} onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation + payment instructions ── */}
          {step === "confirm" && order && (
            <div className="flex flex-col gap-6">
              <div
                className="p-6 rounded-lg"
                style={{ background: "rgba(46,204,113,0.08)", border: "1px solid rgba(46,204,113,0.3)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck size={24} style={{ color: "var(--green)" }} />
                  <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                    Order Placed — {order.orderId}
                  </h2>
                </div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Your order has been received. Please complete payment using the details below.
                  We will dispatch within 24 hours of payment confirmation.
                </p>
              </div>

              {/* Bank transfer instructions */}
              {order.instructions.type === "bank_transfer" && (
                <PaymentInstructions title="Bank Transfer Details" reference={order.orderId} amount={format((order.instructions as BankInstructions).amount)}>
                  {[
                    { label: "Bank Name",       value: (order.instructions as BankInstructions).bankName },
                    { label: "Sort Code",        value: (order.instructions as BankInstructions).sortCode },
                    { label: "Account Number",   value: (order.instructions as BankInstructions).accountNumber },
                    { label: "Account Name",     value: (order.instructions as BankInstructions).accountName },
                    { label: "IBAN",             value: (order.instructions as BankInstructions).iban },
                    { label: "Reference",        value: order.orderId, highlight: true },
                    { label: "Amount",           value: format((order.instructions as BankInstructions).amount), highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <InstructionRow
                      key={label}
                      label={label}
                      value={value}
                      highlight={highlight}
                      onCopy={() => copyToClipboard(value, label)}
                      copied={copied === label}
                    />
                  ))}
                </PaymentInstructions>
              )}

              {/* Crypto instructions */}
              {order.instructions.type === "crypto" && (
                <PaymentInstructions title={`${(order.instructions as CryptoInstructions).coin} Payment`} reference={order.orderId} amount={format((order.instructions as CryptoInstructions).amount)}>
                  <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                    Send <strong style={{ color: "var(--text)" }}>{format((order.instructions as CryptoInstructions).amount)} GBP equivalent</strong> in {(order.instructions as CryptoInstructions).coin} to the address below. Include your order reference in the transaction memo if your wallet supports it.
                  </p>
                  {[
                    { label: "Wallet Address", value: (order.instructions as CryptoInstructions).address, highlight: true },
                    { label: "Order Reference", value: order.orderId, highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <InstructionRow
                      key={label}
                      label={label}
                      value={value}
                      highlight={highlight}
                      onCopy={() => copyToClipboard(value, label)}
                      copied={copied === label}
                    />
                  ))}
                </PaymentInstructions>
              )}

              <div className="flex gap-3">
                <Link
                  href="/shop"
                  className="px-5 py-2.5 rounded border font-semibold text-sm transition-colors hover:bg-[var(--surface-2)]"
                  style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded font-semibold text-sm transition-colors hover:brightness-110"
                  style={{ background: "var(--surface-2)", color: "var(--text)" }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        {step !== "confirm" && (
          <div>
            <div
              className="p-5 rounded-lg sticky top-24"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <p className="label-upper mb-4">Order Summary</p>
              <div className="flex flex-col gap-2 mb-4">
                {items.map((item) => (
                  <div key={item.variantSku} className="flex justify-between text-sm gap-3">
                    <span style={{ color: "var(--muted)" }}>
                      {item.name} × {item.qty}
                    </span>
                    <span>{format(item.priceGBP * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div
                className="pt-3 border-t flex justify-between font-bold"
                style={{ borderColor: "var(--line)" }}
              >
                <span>Total</span>
                <span style={{ fontFamily: "var(--font-syne), sans-serif" }}>{format(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const sharedStyle: React.CSSProperties = {
    background: "var(--surface-2)",
    border: "1px solid var(--line-med)",
    color: "var(--text)",
    borderRadius: "var(--radius-md)",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  return (
    <div>
      <label className="label-upper block mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={sharedStyle}
        />
      )}
    </div>
  );
}

function PaymentInstructions({
  title, reference, amount, children,
}: {
  title: string;
  reference: string;
  amount: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-6 rounded-lg"
      style={{ background: "var(--surface)", border: "1px solid var(--line-med)" }}
    >
      <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
        {title}
      </h3>
      <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
        Please include your order reference <strong style={{ color: "var(--text)" }}>{reference}</strong> in the payment description.
      </p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function InstructionRow({
  label, value, highlight, onCopy, copied,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 p-3 rounded"
      style={{ background: highlight ? "var(--surface-2)" : "transparent", border: "1px solid var(--line)" }}
    >
      <div>
        <p className="label-upper mb-0.5">{label}</p>
        <p
          className="text-sm font-medium break-all"
          style={{ color: highlight ? "var(--text)" : "var(--muted)" }}
        >
          {value}
        </p>
      </div>
      <button
        onClick={onCopy}
        className="shrink-0 p-2 rounded transition-colors hover:bg-[var(--surface-3)]"
        style={{ color: "var(--muted)" }}
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check size={14} style={{ color: "var(--green)" }} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
