// app/api/locations/provinces/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PROVINCES_BY_COUNTRY } from "@/data/locations";

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country");
  if (!country) {
    return NextResponse.json({ error: "country is required" }, { status: 400 });
  }
  return NextResponse.json(PROVINCES_BY_COUNTRY[country] ?? []);
}
