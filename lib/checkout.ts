// ─── Checkout abstraction ─────────────────────────────────────────────────────
// All payment-provider logic is isolated here. To add Stripe/Crypto/Bank
// wire-up, edit only this file — the UI never calls payment APIs directly.

import type { CartItem } from "@/contexts/CartContext";
import type { CurrencyCode } from "@/lib/config";

export type PaymentMethod = "bank_transfer" | "crypto_btc" | "crypto_eth" | "crypto_usdt";

export interface OrderDetails {
  items: CartItem[];
  totalGBP: number;
  currency: CurrencyCode;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: string;
}

export interface CheckoutResult {
  orderId: string;
  paymentMethod: PaymentMethod;
  instructions: BankInstructions | CryptoInstructions;
}

export interface BankInstructions {
  type: "bank_transfer";
  bankName: string;
  sortCode: string;
  accountNumber: string;
  accountName: string;
  iban: string;
  reference: string;
  amount: number;
  currency: CurrencyCode;
}

export interface CryptoInstructions {
  type: "crypto";
  coin: "BTC" | "ETH" | "USDT-TRC20";
  address: string;
  amount: number;
  amountCurrency: string;
  reference: string;
}

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AP-${ts}-${rand}`;
}

export async function createOrder(
  details: OrderDetails,
  method: PaymentMethod
): Promise<CheckoutResult> {
  const orderId = generateOrderId();

  if (method === "bank_transfer") {
    const instructions: BankInstructions = {
      type: "bank_transfer",
      bankName: process.env.NEXT_PUBLIC_BANK_NAME ?? "TODO: Bank Name",
      sortCode: process.env.NEXT_PUBLIC_BANK_SORT_CODE ?? "00-00-00",
      accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "00000000",
      accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "TODO: Account Name",
      iban: process.env.NEXT_PUBLIC_BANK_IBAN ?? "TODO: IBAN",
      reference: orderId,
      amount: details.totalGBP,
      currency: "GBP",
    };
    return { orderId, paymentMethod: method, instructions };
  }

  const cryptoMap: Record<
    "crypto_btc" | "crypto_eth" | "crypto_usdt",
    { coin: "BTC" | "ETH" | "USDT-TRC20"; envKey: string }
  > = {
    crypto_btc:  { coin: "BTC",         envKey: "NEXT_PUBLIC_CRYPTO_BTC_ADDRESS" },
    crypto_eth:  { coin: "ETH",         envKey: "NEXT_PUBLIC_CRYPTO_ETH_ADDRESS" },
    crypto_usdt: { coin: "USDT-TRC20",  envKey: "NEXT_PUBLIC_CRYPTO_USDT_TRC20" },
  };

  const crypto = cryptoMap[method as "crypto_btc" | "crypto_eth" | "crypto_usdt"];
  const instructions: CryptoInstructions = {
    type: "crypto",
    coin: crypto.coin,
    address: process.env[crypto.envKey] ?? "TODO: wallet address",
    amount: details.totalGBP,
    amountCurrency: "GBP",
    reference: orderId,
  };

  return { orderId, paymentMethod: method, instructions };
}
