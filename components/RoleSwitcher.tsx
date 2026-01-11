// app/components/RoleSwitcher.tsx

"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRole, type BaseRole, type Badge } from "@/components/RoleProvider";

const ALL_BADGES: Badge[] = [
  "retailer",
  "tenant",
  "client",
  "creator",
  "principle",
  "theprinciple",
  "superprinciple",
];

export default function RoleSwitcher() {
  const {
    isAuthenticated,
    baseRole,
    badges,
    canSeeWholesale,
    login,
    logout,
    setBaseRole,
    toggleBadge,
  } = useRole();

  const [guardNote, setGuardNote] = useState<string>("");
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);

  // Tutup dropdown Badges saat klik di luar & saat tekan Escape
  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      const el = detailsRef.current;
      if (!el || !el.open) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        el.open = false;
        setIsBadgeOpen(false);
      }
    }
    function onDocKeyDown(e: KeyboardEvent) {
      const el = detailsRef.current;
      if (e.key === "Escape" && el?.open) {
        el.open = false;
        setIsBadgeOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, []);

  const sessionLabel = useMemo(
    () => (isAuthenticated ? baseRole : "visitor"),
    [isAuthenticated, baseRole]
  );

  const onToggleBadge = (b: Badge) => {
    if (!isAuthenticated) return; // hard guard UI
    if (b === "superprinciple" && badges.has("superprinciple")) {
      setGuardNote("At least one superprinciple must remain (guard).");
    } else {
      setGuardNote("");
    }
    toggleBadge(b);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Session */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">Session:</span>
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="rounded border px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer"
            aria-label="Log out">
            Logout ({sessionLabel})
          </button>
        ) : (
          <button
            onClick={login}
            className="rounded border px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer"
            aria-label="Log in">
            Login (visitor → guest)
          </button>
        )}
      </div>

      {/* Base role */}
      <div className="flex items-center gap-1">
        <label className="text-xs text-gray-600" htmlFor="base-role">
          Role:
        </label>
        <select
          id="base-role"
          value={baseRole}
          onChange={(e) => setBaseRole(e.target.value as BaseRole)}
          disabled={!isAuthenticated}
          className="rounded border px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          <option value="guest">guest</option>
          <option value="member">member</option>
        </select>
      </div>

      {/* Badges */}
      <details
        ref={detailsRef}
        onToggle={(event) => {
          setIsBadgeOpen(event.currentTarget.open);
        }}
        className={[
          "group relative",
          !isAuthenticated ? "opacity-50 pointer-events-none select-none" : "",
        ].join(" ")}>
        <summary
          className="cursor-pointer rounded border px-2 py-1 text-xs hover:bg-gray-50"
          aria-haspopup="listbox"
          aria-expanded={isBadgeOpen}>
          Badges
        </summary>
        <div className="absolute right-0 z-10 mt-2 w-64 rounded border bg-white p-3 shadow">
          <ul className="space-y-1">
            {ALL_BADGES.map((b) => (
              <li key={b} className="flex items-center justify-between">
                <label className="text-xs">{b}</label>
                <input
                  type="checkbox"
                  checked={badges.has(b)}
                  onChange={() => onToggleBadge(b)}
                  disabled={!isAuthenticated}
                />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-gray-500">
            Wholesale visible: <strong>{canSeeWholesale ? "YES" : "NO"}</strong>
          </p>
          {guardNote && (
            <p className="mt-1 text-[11px] text-amber-600">{guardNote}</p>
          )}
        </div>
      </details>
    </div>
  );
}
