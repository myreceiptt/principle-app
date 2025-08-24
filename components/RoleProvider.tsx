// app/components/RoleProvider.tsx

"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
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

// Saat logout: tidak ada badge.
const DEFAULT_BADGES_LOGGED_OUT: Badge[] = [];
// Setelah login (sesuai kebiasaanmu): superprinciple dicentang default,
// tapi TIDAK memberi akses wholesale karena canSeeWholesale hanya cek 'retailer'.
const DEFAULT_BADGES_ON_LOGIN: Badge[] = ["superprinciple"];

export function RoleProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [baseRole, setBaseRole] = useState<BaseRole>("guest");
  const [badges, setBadges] = useState<Set<Badge>>(
    () => new Set<Badge>(DEFAULT_BADGES_LOGGED_OUT)
  );

  const hasBadge = (b: Badge) => badges.has(b);

  const toggleBadge = (b: Badge) => {
    if (!isAuthenticated) return; // cegah toggle saat belum login
    setBadges((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  };

  // <- KEMBALI KE ATURANMU:
  // Hanya login + badge 'retailer' yang boleh lihat wholesale.
  const canSeeWholesale = useMemo(
    () => isAuthenticated && badges.has("retailer"),
    [isAuthenticated, badges]
  );

  const login = () => {
    setAuth(true);
    setBaseRole("guest");
    setBadges(new Set<Badge>(DEFAULT_BADGES_ON_LOGIN));
  };

  const logout = () => {
    setAuth(false);
    setBaseRole("guest");
    setBadges(new Set<Badge>(DEFAULT_BADGES_LOGGED_OUT));
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
