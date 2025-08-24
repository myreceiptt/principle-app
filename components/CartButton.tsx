// app/components/CartButton.tsx

"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
      aria-label="Open cart">
      Cart
      <span className="ml-2 inline-flex items-center justify-center rounded-full border px-1.5 text-[10px]">
        {count}
      </span>
    </Link>
  );
}
