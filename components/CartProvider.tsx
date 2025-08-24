// app/components/CartProvider.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  variantId?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  /** total quantity across all cart lines */
  count: number;
  addItem: (productId: string, qty?: number, variantId?: string) => void;
  setQty: (
    productId: string,
    variantId: string | undefined,
    qty: number
  ) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// ===== Persistence config =====
const STORAGE_KEY = "principle.cart.v1";
const STORAGE_VERSION = 1;

type PersistShape = { version: number; items: CartItem[] };

function sanitize(raw: unknown): CartItem[] {
  if (!raw || !Array.isArray(raw)) return [];
  const cleaned = raw
    .map((x) => {
      if (!x || typeof x !== "object") return null;
      const r = x as any;
      const productId = typeof r.productId === "string" ? r.productId : null;
      const variantId =
        r.variantId === undefined || typeof r.variantId === "string"
          ? r.variantId
          : undefined;
      const qtyNum = Number(r.qty);
      const qty = Number.isFinite(qtyNum) ? Math.floor(qtyNum) : 0;
      if (!productId || qty <= 0) return null;
      return { productId, variantId, qty } as CartItem;
    })
    .filter(Boolean) as CartItem[];

  // merge duplicates (same productId + variantId)
  const key = (i: CartItem) => `${i.productId}::${i.variantId ?? "-"}`;
  const map = new Map<string, CartItem>();
  for (const it of cleaned) {
    const k = key(it);
    const prev = map.get(k);
    if (prev) {
      map.set(k, { ...it, qty: prev.qty + it.qty });
    } else {
      map.set(k, { ...it });
    }
  }
  return Array.from(map.values());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistShape;
        if (parsed && parsed.version === STORAGE_VERSION) {
          setItems(sanitize(parsed.items));
        } else if (parsed && parsed.items) {
          // versi berbeda: coba ambil items lama
          setItems(sanitize(parsed.items));
        }
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (items.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const payload: PersistShape = { version: STORAGE_VERSION, items };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch {
      // ignore quota errors, etc.
    }
  }, [items, hydrated]);

  const api = useMemo<CartContextValue>(() => {
    const addItem = (
      productId: string,
      qty: number = 1,
      variantId?: string
    ) => {
      if (!productId) return;
      if (!Number.isFinite(qty) || qty <= 0) return;
      setItems((prev) => {
        const idx = prev.findIndex(
          (x) => x.productId === productId && x.variantId === variantId
        );
        if (idx >= 0) {
          const next = prev.slice();
          next[idx] = { ...next[idx], qty: next[idx].qty + Math.floor(qty) };
          return next;
        }
        return [...prev, { productId, variantId, qty: Math.floor(qty) }];
      });
    };

    const setQty = (
      productId: string,
      variantId: string | undefined,
      qty: number
    ) => {
      setItems((prev) => {
        const nextQty = Math.floor(Number(qty));
        const idx = prev.findIndex(
          (x) => x.productId === productId && x.variantId === variantId
        );
        if (idx < 0) return prev;
        const next = prev.slice();
        if (!Number.isFinite(nextQty) || nextQty <= 0) {
          // remove if zero/invalid
          next.splice(idx, 1);
        } else {
          next[idx] = { ...next[idx], qty: nextQty };
        }
        return next;
      });
    };

    const removeItem = (productId: string, variantId?: string) => {
      setItems((prev) =>
        prev.filter(
          (x) => !(x.productId === productId && x.variantId === variantId)
        )
      );
    };

    const clear = () => setItems([]);

    const count = items.reduce((a, i) => a + i.qty, 0);

    return { items, count, addItem, setQty, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
