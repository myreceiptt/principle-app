// app/api/products/route.ts

import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET() {
  // Bisa ditambah select/map untuk hanya kirim field tertentu.
  return NextResponse.json(PRODUCTS);
}
