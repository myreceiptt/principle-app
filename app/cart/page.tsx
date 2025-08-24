// app/cart/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useRole } from "@/components/RoleProvider";
import { selectPrice } from "@/lib/pricing";
import { formatIDR } from "@/lib/format";
import type { Product, Variant } from "@/data/products";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, setQty, removeItem, clear } = useCart();
  const { canSeeWholesale, isAuthenticated } = useRole();
  const [note, setNote] = useState<string>("");
  const router = useRouter();

  const [catalog, setCatalog] = useState<Product[] | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let on = true;
    fetch("/api/products", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data: Product[]) => on && setCatalog(data))
      .catch(() => on && setErr("Failed to load products."));
    return () => {
      on = false;
    };
  }, []);

  const rows = useMemo(() => {
    if (!catalog || catalog.length === 0) return [];

    return items
      .map((it) => {
        const p = catalog.find((x) => x.id === it.productId);
        if (!p) return null;

        const variant: Variant | undefined = p.variants?.find(
          (v) => v.id === it.variantId
        );
        const { amount, tier } = selectPrice(p, canSeeWholesale);

        const maxStock = (variant?.stock ??
          p.stock ??
          Number.POSITIVE_INFINITY) as number;
        const subtotal = amount * it.qty;
        const isWholesale = tier === "wholesale";
        const minRequired = isWholesale
          ? p.moqWholesale ?? 0
          : p.moqRetail ?? 1;
        const moqOk = it.qty >= minRequired;
        const outOfStock = maxStock <= 0;
        const overStock = it.qty > maxStock && Number.isFinite(maxStock);
        const variantLabel = variant
          ? [variant.attrs.color, variant.attrs.size]
              .filter(Boolean)
              .join(" / ")
          : "Standard";

        return {
          p,
          variant,
          variantLabel,
          qty: it.qty,
          tier,
          amount,
          subtotal,
          minRequired,
          moqOk,
          maxStock,
          outOfStock,
          overStock,
        };
      })
      .filter(Boolean) as Array<{
      p: Product;
      variant?: Variant;
      variantLabel: string;
      qty: number;
      tier: "retail" | "wholesale";
      amount: number;
      subtotal: number;
      minRequired: number;
      moqOk: boolean;
      maxStock: number;
      outOfStock: boolean;
      overStock: boolean;
    }>;
  }, [catalog, items, canSeeWholesale]);

  const total = useMemo(() => rows.reduce((a, r) => a + r.subtotal, 0), [rows]);
  const allMOQOk = rows.every((r) => r.moqOk);
  const allInStock = rows.every((r) => !r.outOfStock && !r.overStock);
  const isCartEmpty = rows.length === 0;

  const goCheckout = () => {
    if (!isAuthenticated) {
      setNote("Please login to continue checkout.");
      return;
    }
    if (!allInStock) {
      setNote("Some items are out of stock or exceed stock. Please adjust.");
      return;
    }
    if (!allMOQOk) {
      setNote("Please meet the minimum quantity requirements.");
      return;
    }
    router.push("/checkout");
  };

  return (
    <section className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {err && <p className="mt-2 text-red-600 text-sm">{err}</p>}
      {!catalog && items.length > 0 ? (
        <p className="mt-4 text-gray-600">Loading products…</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-gray-600">
          Cart is empty.{" "}
          <Link href="/store" className="underline">
            Go to Store →
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-6 divide-y rounded border">
            {rows.map((r) => {
              const maxAttr = Number.isFinite(r.maxStock)
                ? r.maxStock
                : undefined;
              const qtyDisabled = r.outOfStock;
              const rowWarn = r.outOfStock
                ? "Out of stock"
                : r.overStock
                ? `Exceeds stock (max ${r.maxStock})`
                : null;

              const minWarn =
                r.minRequired > (r.tier === "wholesale" ? 0 : 1) && !r.moqOk
                  ? r.tier === "wholesale"
                    ? `Below Wholesale MOQ (${r.minRequired})`
                    : `Below Retail minimum (${r.minRequired})`
                  : null;

              return (
                <li
                  key={r.p.id + "::" + (r.variant?.id ?? "-")}
                  className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold">{r.p.title}</h2>
                      <p className="text-xs text-gray-500">
                        Variant: {r.variantLabel}
                      </p>
                      <p className="text-sm text-gray-500">
                        {r.tier === "wholesale"
                          ? "Wholesale (retailer)"
                          : "Retail"}{" "}
                        • {formatIDR(r.amount)} / unit
                      </p>
                      {Number.isFinite(r.maxStock) && (
                        <p className="mt-1 text-xs text-gray-500">
                          Stock: {r.maxStock}
                        </p>
                      )}
                      {rowWarn && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {rowWarn}
                        </p>
                      )}
                      {minWarn && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {minWarn}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <label
                          className="text-xs text-gray-600"
                          htmlFor={`qty-${r.p.id}-${r.variant?.id ?? "-"}`}>
                          Qty
                        </label>
                        <input
                          id={`qty-${r.p.id}-${r.variant?.id ?? "-"}`}
                          type="number"
                          min={Math.max(1, r.minRequired)}
                          max={maxAttr}
                          value={r.qty}
                          onChange={(e) => {
                            const raw =
                              Number(e.target.value) ||
                              Math.max(1, r.minRequired);
                            const lowerClamped = Math.max(
                              Math.max(1, r.minRequired),
                              raw
                            );
                            const capped = Number.isFinite(r.maxStock)
                              ? Math.min(lowerClamped, r.maxStock)
                              : lowerClamped;
                            setQty(r.p.id, r.variant?.id, capped);
                          }}
                          disabled={qtyDisabled}
                          className="w-20 rounded border px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                          onClick={() => removeItem(r.p.id, r.variant?.id)}
                          className="rounded border px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer">
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 text-lg font-bold">
                        {formatIDR(r.subtotal)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={clear}
              className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer">
              Clear Cart
            </button>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold">{formatIDR(total)}</div>
              {!allInStock && (
                <p className="mt-1 text-xs text-red-600">
                  Some items are out of stock or exceed stock. Please adjust.
                </p>
              )}
              {!allMOQOk && (
                <p className="mt-1 text-xs text-red-600">
                  Please meet the minimum quantity requirements.
                </p>
              )}
              {note && <p className="mt-1 text-xs text-amber-700">{note}</p>}
              <button
                onClick={goCheckout}
                disabled={isCartEmpty || !allInStock || !allMOQOk}
                className="mt-2 rounded border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
