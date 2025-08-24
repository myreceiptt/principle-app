// data/products.ts

export type Variant = {
  id: string; // unique (SKU)
  sku?: string;
  attrs: { size?: string; color?: string };
  stock?: number;
  images?: string[]; // gambar spesifik varian (opsional)
  swatchHex?: string; // warna swatch (opsional)
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  desc?: string;
  prices: { retail: number; reseller: number };
  images?: string[]; // gambar umum produk (fallback)
  stock?: number;
  moqWholesale?: number;
  moqRetail?: number;
  variants?: Variant[];
};

export const PRODUCTS: Product[] = [
  {
    id: "P-001",
    title: "PRINCIPLE Tee — Core Logo",
    slug: "principle-tee-core-logo",
    desc: "200 gsm cotton tee with the PRINCIPLE core logotype.",
    prices: { retail: 199000, reseller: 139000 },
    images: ["/images/products/0.jpeg"], // bisa isi nanti, placeholder akan dipakai kalau kosong
    stock: 120,
    moqWholesale: 12,
    moqRetail: 1,
    variants: [
      {
        id: "P-001-BLK-S",
        sku: "TEE-CORE-BLK-S",
        attrs: { color: "Black", size: "S" },
        stock: 10,
        images: ["/images/products/1.png"],
        swatchHex: "#111827",
      },
      {
        id: "P-001-BLK-M",
        sku: "TEE-CORE-BLK-M",
        attrs: { color: "Black", size: "M" },
        stock: 20,
        images: ["/images/products/1.png"],
        swatchHex: "#111827",
      },
      {
        id: "P-001-BLK-L",
        sku: "TEE-CORE-BLK-L",
        attrs: { color: "Black", size: "L" },
        stock: 20,
        images: ["/images/products/1.png"],
        swatchHex: "#111827",
      },
      {
        id: "P-001-WHT-S",
        sku: "TEE-CORE-WHT-S",
        attrs: { color: "White", size: "S" },
        stock: 10,
        images: ["/images/products/2.png"],
        swatchHex: "#ffffff",
      },
      {
        id: "P-001-WHT-M",
        sku: "TEE-CORE-WHT-M",
        attrs: { color: "White", size: "M" },
        stock: 30,
        images: ["/images/products/2.png"],
        swatchHex: "#ffffff",
      },
      {
        id: "P-001-WHT-L",
        sku: "TEE-CORE-WHT-L",
        attrs: { color: "White", size: "L" },
        stock: 30,
        images: ["/images/products/2.png"],
        swatchHex: "#ffffff",
      },
    ],
  },
  {
    id: "P-002",
    title: "PRINCIPLE Tote — Everyday",
    slug: "principle-tote-everyday",
    desc: "Heavy canvas tote for daily carry.",
    prices: { retail: 149000, reseller: 99000 },
    images: ["/images/products/0.jpeg"],
    stock: 80,
    moqWholesale: 6,
    moqRetail: 2,
    variants: [
      {
        id: "P-002-NAT-OS",
        sku: "TOTE-NAT-OS",
        attrs: { color: "Natural", size: "OS" },
        stock: 50,
        images: ["/images/products/2.png"],
        swatchHex: "#E5E7EB",
      },
      {
        id: "P-002-BLK-OS",
        sku: "TOTE-BLK-OS",
        attrs: { color: "Black", size: "OS" },
        stock: 30,
        images: ["/images/products/1.png"],
        swatchHex: "#111827",
      },
    ],
  },
  {
    id: "P-003",
    title: "PRINCIPLE Cap — Minimal",
    slug: "principle-cap-minimal",
    desc: "Unstructured 6-panel cap with subtle embroidery.",
    prices: { retail: 229000, reseller: 159000 },
    images: ["/images/products/0.jpeg"],
    stock: 60,
    moqWholesale: 12,
    moqRetail: 1,
    variants: [
      {
        id: "P-003-OLV-OS",
        sku: "CAP-OLV-OS",
        attrs: { color: "Olive", size: "OS" },
        stock: 25,
        images: ["/images/products/2.png"],
        swatchHex: "#4B5563",
      },
      {
        id: "P-003-NVY-OS",
        sku: "CAP-NVY-OS",
        attrs: { color: "Navy", size: "OS" },
        stock: 35,
        images: ["/images/products/1.png"],
        swatchHex: "#1F2937",
      },
    ],
  },
];
