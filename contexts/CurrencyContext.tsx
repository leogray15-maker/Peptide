"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { CURRENCIES, type CurrencyCode, formatPrice } from "@/lib/config";

interface CurrencyCtx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (gbp: number) => string;
  currencies: typeof CURRENCIES;
}

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("GBP");

  return (
    <Ctx.Provider
      value={{
        currency,
        setCurrency,
        format: (gbp) => formatPrice(gbp, currency),
        currencies: CURRENCIES,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCurrency(): CurrencyCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
