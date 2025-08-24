// app/api/locations/countries/route.ts

import { NextResponse } from "next/server";
import { COUNTRIES } from "@/data/locations";

export async function GET() {
  return NextResponse.json(COUNTRIES);
}
