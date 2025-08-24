// lib/pricing.ts

import type { Product } from "@/data/products";

export type PriceTier = "retail" | "wholesale";

export function selectPrice(
  product: Product,
  wholesaleVisible: boolean
): { tier: PriceTier; amount: number } {
  const tier: PriceTier = wholesaleVisible ? "wholesale" : "retail";
  const amount = wholesaleVisible
    ? product.prices.reseller
    : product.prices.retail;
  return { tier, amount };
}
