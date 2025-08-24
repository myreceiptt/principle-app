// app/store/product/[slug]/page.tsx

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProductClient from "@/components/ProductClient";
import type { Product } from "@/data/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // headers() sekarang Promise → wajib await
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/api/products/${encodeURIComponent(slug)}`, {
    // boleh pilih salah satu: revalidate (SSG+ISR) atau no-store (selalu dinamis)
    next: { revalidate: 60 },
    // cache: "no-store",
  });

  if (!res.ok) return notFound();

  const product = (await res.json()) as Product;

  return <ProductClient product={product} />;
}
