// app/api/products/[slug]/route.ts

import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const prod = PRODUCTS.find((p) => p.slug === slug);
  if (!prod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(prod);
}
