// app/api/locations/cities/route.ts

import { NextRequest, NextResponse } from "next/server";
import { CITIES_BY_PROVINCE } from "@/data/locations";

export async function GET(req: NextRequest) {
  const province = req.nextUrl.searchParams.get("province");
  if (!province) {
    return NextResponse.json(
      { error: "province is required" },
      { status: 400 }
    );
  }
  return NextResponse.json(CITIES_BY_PROVINCE[province] ?? []);
}
