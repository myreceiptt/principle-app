// app/store/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { formatIDR } from "@/lib/format";
import { useRole } from "@/components/RoleProvider";
import { selectPrice } from "@/lib/pricing";
import { primaryImage } from "@/lib/images";

export default function StorePage() {
  const { isAuthenticated, baseRole, canSeeWholesale } = useRole();
  const session = isAuthenticated ? baseRole : "visitor";
  const priceLabel = canSeeWholesale ? "Wholesale (retailer)" : "Retail";

  const [products, setProducts] = useState<Product[] | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let on = true;
    fetch("/api/products", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data: Product[]) => on && setProducts(data))
      .catch(() => on && setErr("Failed to load products."));
    return () => {
      on = false;
    };
  }, []);

  function totalStock(p: Product) {
    if (p.variants?.length)
      return p.variants.reduce((a, v) => a + (v.stock ?? 0), 0);
    return p.stock ?? 0;
  }

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold">PRINCIPLE Store</h1>
      <p className="mt-2 text-gray-600">
        Viewing: <span className="font-semibold">{priceLabel}</span> prices •
        session: <span className="font-semibold">{session}</span>
      </p>

      {err && <p className="mt-4 text-red-600 text-sm">{err}</p>}
      {!products ? (
        <p className="mt-6 text-gray-600">Loading products…</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const { amount } = selectPrice(p, canSeeWholesale);
            const variantInfo = p.variants?.length
              ? `${p.variants.length} variants`
              : "Standard";
            const soldOut = totalStock(p) <= 0;
            const img = primaryImage(p);

            return (
              <li
                key={p.id}
                className={[
                  "rounded-lg border p-4",
                  soldOut ? "opacity-60" : "",
                ].join(" ")}>
                <div className="aspect-square overflow-hidden rounded-md border bg-white">
                  <Image
                    src={img}
                    alt={p.title}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{p.title}</h2>
                    {p.desc && (
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {p.desc}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Variant: {variantInfo}
                    </p>
                  </div>
                  {soldOut && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                      Sold out
                    </span>
                  )}
                </div>

                <p className="mt-2">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {priceLabel}
                  </span>
                  <br />
                  <span className="text-lg font-bold">{formatIDR(amount)}</span>
                </p>

                <Link
                  className="inline-block mt-3 underline"
                  href={`/store/product/${p.slug}`}>
                  Details
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
