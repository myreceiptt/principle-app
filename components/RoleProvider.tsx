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

  hasBadge: (b: Badge) => boolean;
  canSeeWholesale: boolean;

  login: () => void;
  logout: () => void;
  setBaseRole: (r: BaseRole) => void;
  setBadge: (b: Badge, v: boolean) => void;
  toggleBadge: (b: Badge) => void;

  autoUpgradeToMember: () => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

// dummy guard anti-lockout
const GENESIS_PROTECTED = true;

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [baseRole, setBaseRole] = useState<BaseRole>("guest");

  // DEFAULT: saat login, hanya 'superprinciple' yang ON (sesuai permintaan)
  const [badges, setBadges] = useState<Set<Badge>>(new Set());

  const hasBadge = (b: Badge) => badges.has(b);

  const canSeeWholesale = useMemo(() => {
    return isAuthenticated && hasBadge("retailer");
  }, [isAuthenticated, badges]);

  const login = () => {
    setIsAuthenticated(true);
    setBaseRole("guest");
    // default badges setelah login:
    setBadges(new Set<Badge>(["superprinciple"]));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setBaseRole("guest");
    setBadges(new Set());
  };

  const setBadge = (b: Badge, v: boolean) => {
    // hard guard: kalau belum login, abaikan
    if (!isAuthenticated) return;

    setBadges((prev) => {
      const next = new Set(prev);

      // anti-lockout untuk superprinciple (dummy)
      if (b === "superprinciple" && !v) {
        const isOnlySP = GENESIS_PROTECTED && next.has("superprinciple");
        if (isOnlySP) {
          return next; // tolak unassign jika akan membuat 0 SP (lokal)
        }
      }

      if (v) next.add(b);
      else next.delete(b);
      return next;
    });
  };

  const toggleBadge = (b: Badge) => {
    // guard tambahan
    if (!isAuthenticated) return;
    setBadge(b, !hasBadge(b));
  };

  const autoUpgradeToMember = () => {
    setBaseRole((cur) => (cur === "guest" ? "member" : cur));
  };

  const value: RoleContextValue = {
    isAuthenticated,
    baseRole,
    badges,
    hasBadge,
    canSeeWholesale,
    login,
    logout,
    setBaseRole,
    setBadge,
    toggleBadge,
    autoUpgradeToMember,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within <RoleProvider>");
  return ctx;
}
