// app/components/RoleProvider.tsx

"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode, // <- biarkan ini jika dipakai di props (lihat di bawah)
} from "react";

export type BaseRole = "guest" | "member";
export type Badge =
  | "retailer"
  | "tenant"
  | "client"
  | "creator"
  | "principle"
  | "theprinciple"
  | "superprinciple";

type RoleContextValue = {
  isAuthenticated: boolean;
  baseRole: BaseRole;
  badges: Set<Badge>;
  login: () => void;
  logout: () => void;
  setBaseRole: (r: BaseRole) => void;
  toggleBadge: (b: Badge) => void;
  hasBadge: (b: Badge) => boolean;
  canSeeWholesale: boolean;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  // <- pastikan ReactNode dipakai
  const [isAuthenticated, setAuth] = useState(false);
  const [baseRole, setBaseRole] = useState<BaseRole>("guest");
  const [badges, setBadges] = useState<Set<Badge>>(
    () => new Set<Badge>(["superprinciple"])
  );

  const hasBadge = (b: Badge) => badges.has(b);

  const toggleBadge = (b: Badge) => {
    setBadges((prev) => {
      const next = new Set(prev);
      if (next.has(b)) {
        if (b === "superprinciple" && next.size === 1) {
          // guard: jangan hapus superprinciple terakhir
          return next;
        }
        next.delete(b);
      } else {
        next.add(b);
      }
      return next;
    });
  };

  // ✅ Hindari depend ke fungsi; cukup ke 'badges'
  const canSeeWholesale = useMemo(
    () => badges.has("superprinciple") || badges.has("retailer"),
    [badges]
  );

  const login = () => {
    setAuth(true);
    setBaseRole("guest");
    // default badge saat login: hanya superprinciple tercentang
    setBadges(new Set<Badge>(["superprinciple"]));
  };

  const logout = () => {
    setAuth(false);
    setBaseRole("guest");
    // nilai badges tidak dipakai (UI disabled saat logout), tapi boleh reset
    setBadges(new Set<Badge>(["superprinciple"]));
  };

  const value: RoleContextValue = {
    isAuthenticated,
    baseRole,
    badges,
    login,
    logout,
    setBaseRole,
    toggleBadge,
    hasBadge,
    canSeeWholesale,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within <RoleProvider>");
  return ctx;
}
