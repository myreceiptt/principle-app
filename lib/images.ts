// lib/images.ts

import type { Product, Variant } from "@/data/products";

export function colorHex(name?: string): string | undefined {
  if (!name) return undefined;
  const map: Record<string, string> = {
    black: "#111827",
    white: "#ffffff",
    natural: "#e5e7eb",
    olive: "#4b5563",
    navy: "#1f2937",
    grey: "#9ca3af",
    gray: "#9ca3af",
  };
  return map[name.toLowerCase()];
}

export function placeholderImage(
  label: string,
  bg = "#f3f4f6",
  fg = "#111827"
): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="28" font-family="sans-serif" fill="${fg}">
    ${label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}
  </text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Default: kembalikan product.images[] kalau varian belum dipilih.
 * Jika varian dipilih & punya images → pakai itu.
 * Jika varian dipilih tapi tidak ada images → fallback ke product.images[].
 * Jika product.images[] kosong → placeholder SVG.
 */
export function imagesForSelection(
  product: Product,
  variant?: Variant
): string[] {
  if (variant) {
    if (variant.images && variant.images.length) return variant.images;
    if (product.images && product.images.length) return product.images;
  } else {
    if (product.images && product.images.length) return product.images;
  }
  const label =
    product.title +
    (variant?.attrs
      ? ` • ${variant.attrs.color ?? ""} ${variant.attrs.size ?? ""}`.trim()
      : "");
  const bg = variant?.swatchHex ?? colorHex(variant?.attrs.color) ?? "#f3f4f6";
  const fg = bg.toLowerCase() === "#111827" ? "#ffffff" : "#111827";
  return [placeholderImage(label, bg, fg)];
}

/**
 * Gambar utama untuk kartu di Store.
 * Prioritas: product.images[0] → varian (yg punya images) → placeholder.
 */
export function primaryImage(product: Product): string {
  if (product.images?.[0]) return product.images[0];
  const vAnyWithImg = product.variants?.find(
    (v) => (v.images?.length ?? 0) > 0
  );
  if (vAnyWithImg?.images?.[0]) return vAnyWithImg.images[0];
  return placeholderImage(product.title);
}
