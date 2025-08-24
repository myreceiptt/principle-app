// app/components/ProductClient.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRole } from "@/components/RoleProvider";
import { useCart } from "@/components/CartProvider";
import { formatIDR } from "@/lib/format";
import type { Product, Variant } from "@/data/products";
import { selectPrice } from "@/lib/pricing";
import { colorHex, imagesForSelection } from "@/lib/images";

export default function ProductClient({ product }: { product: Product }) {
  const { isAuthenticated, baseRole, canSeeWholesale } = useRole();
  const session = isAuthenticated ? baseRole : "visitor";

  const { items, addItem } = useCart();
  const [qty, setQty] = useState<number>(1);

  const { tier, amount } = selectPrice(product, canSeeWholesale);
  const priceLabel = tier === "wholesale" ? "Wholesale (retailer)" : "Retail";

  const variants = product.variants ?? [];

  // KUMPULKAN daftar opsi tanpa auto-select (biar default gambar = product.images[])
  const colors = useMemo(
    () =>
      Array.from(
        new Set(variants.map((v) => v.attrs.color).filter(Boolean))
      ) as string[],
    [variants]
  );
  const sizes = useMemo(
    () =>
      Array.from(
        new Set(variants.map((v) => v.attrs.size).filter(Boolean))
      ) as string[],
    [variants]
  );

  // ⬅️ Perubahan penting: awalnya TIDAK ada varian terpilih
  const [selColor, setSelColor] = useState<string | undefined>(undefined);
  const [selSize, setSelSize] = useState<string | undefined>(undefined);

  const hasStockFor = (color?: string, size?: string) =>
    variants.some((v) => {
      const okColor = color ? v.attrs.color === color : true;
      const okSize = size ? v.attrs.size === size : true;
      return okColor && okSize && (v.stock ?? 0) > 0;
    });

  // Varian terpilih hanya jika kombinasi valid dipilih user
  const selectedVariant: Variant | undefined = useMemo(() => {
    if (variants.length === 0) return undefined;
    if (!selColor && !selSize) return undefined; // belum memilih apa pun → gunakan product.images
    return variants.find((v) => {
      const okColor = selColor ? v.attrs.color === selColor : true;
      const okSize = selSize ? v.attrs.size === selSize : true;
      return okColor && okSize;
    });
  }, [variants, selColor, selSize]);

  const maxStock = (selectedVariant?.stock ??
    product.stock ??
    Number.POSITIVE_INFINITY) as number;

  const currentInCart =
    items.find(
      (x) =>
        x.productId === product.id &&
        x.variantId === (selectedVariant?.id ?? undefined)
    )?.qty ?? 0;

  const remaining = Math.max(0, maxStock - currentInCart);
  const maxAttr = Number.isFinite(remaining) ? remaining : undefined;

  const isWholesale = canSeeWholesale;
  const minRequired = isWholesale
    ? product.moqWholesale ?? 0
    : product.moqRetail ?? 1;
  const minAttr = Math.max(1, minRequired);
  const meetsMin = qty >= minAttr;

  // Out of stock hanya muncul jika SUDAH ada varian dipilih dan stok = 0
  const outOfStock =
    (variants.length === 0 &&
      (product.stock ?? Number.POSITIVE_INFINITY) <= 0) ||
    (variants.length > 0 &&
      selectedVariant != null &&
      ((selectedVariant.stock ?? 0) <= 0 || remaining <= 0));

  const canAdd =
    (variants.length === 0 || !!selectedVariant) &&
    !outOfStock &&
    qty > 0 &&
    qty <= remaining &&
    meetsMin;

  const variantLabel = selectedVariant
    ? [selectedVariant.attrs.color, selectedVariant.attrs.size]
        .filter(Boolean)
        .join(" / ")
    : variants.length > 0
    ? "Please select"
    : "Standard";

  // Gambar: default ke product.images hingga user memilih varian dengan gambar
  const gallery = imagesForSelection(product, selectedVariant);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <main className="p-8 max-w-4xl">
      <Link href="/store" className="underline">
        ← Back to Store
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {/* Galeri */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border bg-white">
            <Image
              src={gallery[imgIdx]}
              alt={`${product.title}${
                selectedVariant ? " - " + variantLabel : ""
              }`}
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={[
                    "h-16 w-16 overflow-hidden rounded border",
                    imgIdx === i ? "ring-2 ring-black" : "hover:bg-gray-50",
                    "cursor-pointer",
                  ].join(" ")}
                  aria-label={`Preview ${i + 1}`}>
                  <Image
                    src={src}
                    alt={`Thumb ${i + 1}`}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & varian */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          {product.desc && <p className="mt-2 text-gray-700">{product.desc}</p>}

          <div className="mt-4 rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Viewing: <strong>{priceLabel}</strong> price • session:{" "}
              <strong>{session}</strong>
            </p>
            <p className="text-2xl font-bold mt-1">{formatIDR(amount)}</p>

            {variants.length > 0 && (
              <div className="mt-4 space-y-3">
                {/* Color swatches */}
                {colors.length > 0 && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((c) => {
                        const bg = colorHex(c) ?? "#e5e7eb";
                        const disabled = !hasStockFor(c, selSize);
                        return (
                          <button
                            key={c}
                            onClick={() => setSelColor(c)}
                            disabled={disabled}
                            title={c}
                            className={[
                              "h-8 w-8 rounded-full border shadow-sm",
                              selColor === c ? "ring-2 ring-black" : "",
                              disabled
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer hover:opacity-90",
                            ].join(" ")}
                            style={{ backgroundColor: bg }}
                            aria-label={c}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size buttons */}
                {sizes.length > 0 && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => {
                        const disabled = !hasStockFor(selColor, s);
                        return (
                          <button
                            key={s}
                            onClick={() => setSelSize(s)}
                            disabled={disabled}
                            className={[
                              "rounded border px-2 py-1 text-sm",
                              selSize === s
                                ? "bg-black text-white"
                                : "hover:bg-gray-50",
                              disabled
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer",
                            ].join(" ")}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-600">
                  Variant: <strong>{variantLabel}</strong>
                  {/* Hanya tampilkan remaining jika sudah ada varian terpilih atau produk tanpa varian */}
                  {(selectedVariant || variants.length === 0) &&
                    Number.isFinite(remaining) && (
                      <> • Remaining: {remaining}</>
                    )}
                </p>
              </div>
            )}

            {/* Stock & minimum */}
            {selectedVariant && // hanya tampil saat sudah memilih varian
              (outOfStock ? (
                <p className="mt-3 text-sm font-medium text-red-600">
                  Out of stock for the selected option.
                </p>
              ) : null)}

            {minRequired > (isWholesale ? 0 : 1) && (
              <p
                className={[
                  "mt-3 text-xs",
                  meetsMin ? "text-gray-500" : "text-red-600",
                ].join(" ")}>
                {isWholesale ? "Wholesale MOQ" : "Retail minimum"}:{" "}
                {minRequired} {meetsMin ? "" : "(below minimum)"}
              </p>
            )}

            {/* Qty + Add */}
            <div className="mt-4 flex items-center gap-2">
              <label htmlFor="qty" className="text-sm text-gray-600">
                Qty
              </label>
              <input
                id="qty"
                type="number"
                min={minAttr}
                max={maxAttr}
                value={qty}
                onChange={(e) => {
                  const raw = Number(e.target.value) || minAttr;
                  const lower = Math.max(minAttr, raw);
                  const capped = Number.isFinite(remaining)
                    ? Math.min(lower, remaining)
                    : lower;
                  setQty(capped);
                }}
                disabled={
                  variants.length > 0 &&
                  !selectedVariant /* wajib pilih varian dulu */
                }
                className="w-24 rounded border px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => addItem(product.id, qty, selectedVariant?.id)}
                disabled={!canAdd}
                className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
