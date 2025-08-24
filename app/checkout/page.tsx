// app/checkout/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { PRODUCTS, type Product, type Variant } from "@/data/products";
import { useRole } from "@/components/RoleProvider";
import { selectPrice } from "@/lib/pricing";
import { formatIDR } from "@/lib/format";

/** -----------------------------
 *  API response types (Level 2)
 * ------------------------------ */
type CountryApi = { code: string; name: string; dial: string };

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string; // e.g. +62
  phoneNumber: string; // digits only
  address: string;
  country: string; // country code, e.g. ID
  province: string;
  city: string;
  postalCode: string;
  company?: string;
  taxId?: string;
};

export default function CheckoutPage() {
  const { items, clear, setQty, removeItem } = useCart();
  const { isAuthenticated, canSeeWholesale } = useRole();

  /** -----------------------------------
   *  Order rows — revalidate like in Cart
   * ----------------------------------- */
  const rows = items
    .map((it) => {
      const p = PRODUCTS.find((x) => x.id === it.productId);
      if (!p) return null;
      const variant: Variant | undefined = p.variants?.find(
        (v) => v.id === it.variantId
      );
      const { amount, tier } = selectPrice(p, canSeeWholesale);

      const maxStock = (variant?.stock ??
        p.stock ??
        Number.POSITIVE_INFINITY) as number;
      const outOfStock = maxStock <= 0;
      const overStock = it.qty > maxStock && Number.isFinite(maxStock);

      const isWholesale = tier === "wholesale";
      const minRequired = isWholesale ? p.moqWholesale ?? 0 : p.moqRetail ?? 1;
      const meetsMin = it.qty >= minRequired;

      const subtotal = amount * it.qty;
      const variantLabel = variant
        ? [variant.attrs.color, variant.attrs.size].filter(Boolean).join(" / ")
        : "Standard";

      return {
        p,
        variant,
        variantLabel,
        qty: it.qty,
        tier,
        amount,
        subtotal,
        maxStock,
        outOfStock,
        overStock,
        isWholesale,
        minRequired,
        meetsMin,
      };
    })
    .filter(Boolean) as Array<{
    p: Product;
    variant?: Variant;
    variantLabel: string;
    qty: number;
    tier: "retail" | "wholesale";
    amount: number;
    subtotal: number;
    maxStock: number;
    outOfStock: boolean;
    overStock: boolean;
    isWholesale: boolean;
    minRequired: number;
    meetsMin: boolean;
  }>;

  const subtotal = useMemo(
    () => rows.reduce((a, r) => a + r.subtotal, 0),
    [rows]
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const allStockOk = rows.every((r) => !r.outOfStock && !r.overStock);
  const allMinOk = rows.every((r) => r.meetsMin);
  const isCartEmpty = rows.length === 0;

  /** -----------------------------------
   *  Locations (Level 2 via API endpoints)
   * ----------------------------------- */
  const [countries, setCountries] = useState<CountryApi[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string>("");

  const [provinces, setProvinces] = useState<string[]>([]);
  const [provLoading, setProvLoading] = useState(false);
  const [provError, setProvError] = useState<string>("");

  const [cities, setCities] = useState<string[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState<string>("");

  const DEFAULT_COUNTRY = "ID";
  const DEFAULT_DIAL = "+62";

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: DEFAULT_DIAL,
    phoneNumber: "",
    address: "",
    country: DEFAULT_COUNTRY,
    province: "",
    city: "",
    postalCode: "",
    company: "",
    taxId: "",
  });

  // Load countries on mount
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setCountriesLoading(true);
        setCountriesError("");
        const res = await fetch("/api/locations/countries", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load countries");
        const data: CountryApi[] = await res.json();
        if (!on) return;
        setCountries(data);

        // sync dial code with current selected country (if found)
        const m = data.find((c) => c.code === form.country);
        if (m && form.phoneCountryCode !== m.dial) {
          setForm((prev) => ({ ...prev, phoneCountryCode: m.dial }));
        }
      } catch {
        if (!on) return;
        setCountriesError("Failed to load countries.");
      } finally {
        if (on) setCountriesLoading(false);
      }
    })();
    return () => {
      on = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When country changes → reset province/city and fetch provinces
  useEffect(() => {
    if (!form.country) {
      setProvinces([]);
      setCities([]);
      return;
    }
    let on = true;
    (async () => {
      try {
        setProvLoading(true);
        setProvError("");
        setProvinces([]);
        setCities([]);
        const res = await fetch(
          `/api/locations/provinces?country=${encodeURIComponent(
            form.country
          )}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Failed to load provinces");
        const data: string[] = await res.json();
        if (!on) return;
        setProvinces(data);
      } catch {
        if (!on) return;
        setProvError("Failed to load provinces.");
      } finally {
        if (on) setProvLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [form.country]);

  // When province changes → reset city and fetch cities
  useEffect(() => {
    if (!form.province) {
      setCities([]);
      return;
    }
    let on = true;
    (async () => {
      try {
        setCityLoading(true);
        setCityError("");
        setCities([]);
        const res = await fetch(
          `/api/locations/cities?province=${encodeURIComponent(form.province)}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Failed to load cities");
        const data: string[] = await res.json();
        if (!on) return;
        setCities(data);
      } catch {
        if (!on) return;
        setCityError("Failed to load cities.");
      } finally {
        if (on) setCityLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [form.province]);

  /** -----------------------------------
   *  Validation (email & phone)
   * ----------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const COUNTRY_CODE_RE = /^\+\d{1,4}$/;
  const PHONE_RE = /^\d{6,15}$/;

  const emailValid = EMAIL_RE.test(form.email.trim());
  const phoneCodeValid = COUNTRY_CODE_RE.test(form.phoneCountryCode.trim());
  const phoneNumSanitized = form.phoneNumber.replace(/\D/g, "");
  const phoneNumberValid = PHONE_RE.test(phoneNumSanitized);

  const requiredOk =
    form.firstName.trim() &&
    form.lastName.trim() &&
    emailValid &&
    phoneCodeValid &&
    phoneNumberValid &&
    form.address.trim() &&
    form.country &&
    form.province &&
    form.city &&
    form.postalCode.trim();

  /** -----------------------------------
   *  Place order (dummy)
   * ----------------------------------- */
  const [note, setNote] = useState<string>("");
  const [placed, setPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");

  const canPlaceOrder =
    isAuthenticated && !isCartEmpty && allStockOk && allMinOk && !!requiredOk;

  const placeOrder = () => {
    if (!canPlaceOrder) {
      setNote(
        "Please complete the form and fix issues before placing the order."
      );
      return;
    }
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(id);
    setPlaced(true);
    clear();
  };

  /** -----------------------------------
   *  Auth gate
   * ----------------------------------- */
  if (!isAuthenticated) {
    return (
      <section className="p-8 max-w-3xl">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-4 text-gray-600">
          Please login to continue checkout. Use the Role Switcher →{" "}
          <strong>Login</strong>.
        </p>
        <p className="mt-2">
          <Link href="/store" className="underline">
            Back to Store
          </Link>
        </p>
      </section>
    );
  }

  if (placed) {
    return (
      <section className="p-8 max-w-3xl">
        <h1 className="text-3xl font-bold">Order Placed</h1>
        <p className="mt-2 text-gray-600">
          Your order has been placed successfully (dummy).
        </p>
        <div className="mt-4 rounded border p-4">
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="text-lg font-bold">{orderId}</p>
        </div>
        <p className="mt-4">
          <Link href="/store" className="underline">
            Continue shopping →
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {isCartEmpty ? (
        <p className="mt-4 text-gray-600">
          Your cart is empty.{" "}
          <Link href="/store" className="underline">
            Go to Store →
          </Link>
        </p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Left: Shipping Form */}
          <div className="rounded border p-4">
            <h2 className="font-semibold">Shipping Details</h2>

            {/* Countries load error */}
            {countriesError && (
              <p className="mt-2 text-xs text-red-600">
                {countriesError} Try reload page.
              </p>
            )}

            <div className="mt-3 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    First Name*
                  </label>
                  <input
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Last Name*
                  </label>
                  <input
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={[
                    "w-full rounded border px-3 py-2 text-sm",
                    form.email && !emailValid ? "border-red-500" : "",
                  ].join(" ")}
                />
                {form.email && !emailValid && (
                  <p className="mt-1 text-[11px] text-red-600">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Phone*
                </label>
                <div className="flex gap-2">
                  <select
                    value={form.phoneCountryCode}
                    onChange={(e) =>
                      setForm({ ...form, phoneCountryCode: e.target.value })
                    }
                    className={[
                      "w-28 rounded border px-2 py-2 text-sm",
                      form.phoneCountryCode && !phoneCodeValid
                        ? "border-red-500"
                        : "",
                    ].join(" ")}
                    aria-label="Country code"
                    disabled={countriesLoading || !countries.length}>
                    {countriesLoading ? (
                      <option>Loading…</option>
                    ) : (
                      countries.map((c) => (
                        <option key={c.code} value={c.dial}>
                          {c.dial} ({c.code})
                        </option>
                      ))
                    )}
                  </select>
                  <input
                    placeholder="Phone number"
                    inputMode="numeric"
                    value={form.phoneNumber}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setForm({ ...form, phoneNumber: digits });
                    }}
                    className={[
                      "flex-1 rounded border px-3 py-2 text-sm",
                      form.phoneNumber && !phoneNumberValid
                        ? "border-red-500"
                        : "",
                    ].join(" ")}
                  />
                </div>
                {(form.phoneCountryCode && !phoneCodeValid) ||
                (form.phoneNumber && !phoneNumberValid) ? (
                  <p className="mt-1 text-[11px] text-red-600">
                    Enter valid phone. Country code like <code>+62</code> and
                    6–15 digit number.
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Address*
                </label>
                <textarea
                  placeholder="Street, building, etc."
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full rounded border px-3 py-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Country*
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => {
                      const country = e.target.value;
                      // sync dial code with selected country (if found)
                      const dial =
                        countries.find((c) => c.code === country)?.dial ??
                        form.phoneCountryCode;
                      setForm({
                        ...form,
                        country,
                        province: "",
                        city: "",
                        phoneCountryCode: dial,
                      });
                    }}
                    className="w-full rounded border px-3 py-2 text-sm"
                    disabled={countriesLoading || !countries.length}>
                    {countriesLoading ? (
                      <option>Loading…</option>
                    ) : (
                      <>
                        <option value="" disabled>
                          Select country
                        </option>
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Province/State*
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value, city: "" })
                    }
                    className="w-full rounded border px-3 py-2 text-sm"
                    disabled={!form.country || provLoading}>
                    {!form.country ? (
                      <option value="">Select country first</option>
                    ) : provLoading ? (
                      <option value="">Loading…</option>
                    ) : provinces.length ? (
                      <>
                        <option value="" disabled>
                          Select province/state
                        </option>
                        {provinces.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="">No provinces</option>
                    )}
                  </select>
                  {provError && (
                    <p className="mt-1 text-[11px] text-red-600">{provError}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    City*
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-sm"
                    disabled={!form.province || cityLoading}>
                    {!form.province ? (
                      <option value="">Select province first</option>
                    ) : cityLoading ? (
                      <option value="">Loading…</option>
                    ) : cities.length ? (
                      <>
                        <option value="" disabled>
                          Select city
                        </option>
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="">No cities</option>
                    )}
                  </select>
                  {cityError && (
                    <p className="mt-1 text-[11px] text-red-600">{cityError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Postal Code*
                  </label>
                  <input
                    placeholder="Postal code"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
                <div />
              </div>

              <hr className="my-2" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Company (optional)
                  </label>
                  <input
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Tax ID (optional)
                  </label>
                  <input
                    placeholder="Tax ID"
                    value={form.taxId}
                    onChange={(e) =>
                      setForm({ ...form, taxId: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="rounded border p-4">
            <h2 className="font-semibold">Order Summary</h2>

            <ul className="mt-3 divide-y rounded border">
              {rows.map((r) => {
                const minWarn =
                  r.minRequired > (r.isWholesale ? 0 : 1) && !r.meetsMin
                    ? r.isWholesale
                      ? `Below Wholesale MOQ (${r.minRequired})`
                      : `Below Retail minimum (${r.minRequired})`
                    : null;
                const stockWarn = r.outOfStock
                  ? "Out of stock"
                  : r.overStock
                  ? `Exceeds stock (max ${r.maxStock})`
                  : null;

                return (
                  <li
                    key={r.p.id + "::" + (r.variant?.id ?? "-")}
                    className="p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{r.p.title}</div>
                        <div className="text-xs text-gray-500">
                          Variant: {r.variantLabel}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r.tier === "wholesale"
                            ? "Wholesale (retailer)"
                            : "Retail"}{" "}
                          • {formatIDR(r.amount)} / unit
                        </div>
                        {stockWarn && (
                          <div className="mt-1 text-xs font-medium text-red-600">
                            {stockWarn}
                          </div>
                        )}
                        {minWarn && (
                          <div className="mt-1 text-xs font-medium text-red-600">
                            {minWarn}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Qty: {r.qty}</div>
                        <div className="mt-1 font-semibold">
                          {formatIDR(r.subtotal)}
                        </div>
                        {Number.isFinite(r.maxStock) && (
                          <div className="text-[11px] text-gray-500">
                            Stock: {r.maxStock}
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              setQty(
                                r.p.id,
                                r.variant?.id,
                                Math.max(1, r.qty - 1)
                              )
                            }
                            disabled={r.outOfStock}
                            className="rounded border px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            −
                          </button>
                          <button
                            onClick={() =>
                              setQty(r.p.id, r.variant?.id, r.qty + 1)
                            }
                            disabled={
                              r.outOfStock ||
                              (Number.isFinite(r.maxStock) &&
                                r.qty >= r.maxStock)
                            }
                            className="rounded border px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            +
                          </button>
                          <button
                            onClick={() => removeItem(r.p.id, r.variant?.id)}
                            className="rounded border px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping ? formatIDR(shipping) : "TBD"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatIDR(total)}</span>
              </div>
            </div>

            {(!emailValid || !phoneCodeValid || !phoneNumberValid) && (
              <p className="mt-2 text-xs text-amber-700">
                Please fix contact details before placing the order.
              </p>
            )}
            {!allStockOk && (
              <p className="mt-1 text-xs text-red-600">
                Some items are out of stock or exceed stock. Please adjust.
              </p>
            )}
            {!allMinOk && (
              <p className="mt-1 text-xs text-red-600">
                Please meet the minimum quantity requirements.
              </p>
            )}
            {note && <p className="mt-2 text-xs text-amber-700">{note}</p>}

            <button
              onClick={placeOrder}
              disabled={!canPlaceOrder}
              className="mt-4 w-full rounded border px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              Place Order (dummy)
            </button>

            <p className="mt-3 text-xs text-gray-500">
              This is a placeholder checkout (no payment). Data will be wired
              later.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
