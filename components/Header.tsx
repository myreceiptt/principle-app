// app/components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import RoleSwitcher from "@/components/RoleSwitcher";
import CartButton from "@/components/CartButton";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/spaces", label: "Spaces" },
  { href: "/labs", label: "Labs" },
  { href: "/media", label: "Media" },
];

export default function Header() {
  const pathname = usePathname();
  const active = useMemo(() => pathname?.split("?")[0] ?? "/", [pathname]);

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-black">
          PRINCIPLE
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 sm:gap-2">
            {NAV.map((item) => {
              const isActive =
                item.href === "/"
                  ? active === "/"
                  : active.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm transition",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <RoleSwitcher />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
