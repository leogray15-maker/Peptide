"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { getBulkDiscount } from "@/lib/config";

export interface CartItem {
  productSlug: string;
  variantSku: string;
  name: string;
  variantLabel: string;
  priceGBP: number;
  qty: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; sku: string }
  | { type: "SET_QTY"; sku: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };

    case "ADD": {
      const existing = state.items.find((i) => i.variantSku === action.item.variantSku);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantSku === action.item.variantSku
              ? { ...i, qty: i.qty + action.item.qty }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.variantSku !== action.sku) };

    case "SET_QTY":
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.variantSku !== action.sku) };
      }
      return {
        items: state.items.map((i) =>
          i.variantSku === action.sku ? { ...i, qty: action.qty } : i
        ),
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

export function lineTotal(item: CartItem): number {
  const discount = getBulkDiscount(item.qty) / 100;
  return item.priceGBP * item.qty * (1 - discount);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + lineTotal(i), 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

interface CartCtx {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "arcane_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        dispatch({ type: "HYDRATE", items });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors
    }
  }, [state.items]);

  return (
    <Ctx.Provider
      value={{
        items: state.items,
        addItem: (item) => dispatch({ type: "ADD", item }),
        removeItem: (sku) => dispatch({ type: "REMOVE", sku }),
        setQty: (sku, qty) => dispatch({ type: "SET_QTY", sku, qty }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        total: cartTotal(state.items),
        count: cartItemCount(state.items),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
