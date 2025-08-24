// data/locations.ts

export type CountryOpt = { code: string; name: string; dial: string };

export const COUNTRIES: CountryOpt[] = [
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MY", name: "Malaysia", dial: "+60" },
];

export const PROVINCES_BY_COUNTRY: Record<string, string[]> = {
  ID: [
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "Jawa Timur",
    "DI Yogyakarta",
    "Banten",
    "Bali",
  ],
  SG: ["Central", "East", "North", "North-East", "West"],
  MY: ["Kuala Lumpur", "Selangor", "Johor", "Penang", "Perak"],
};

export const CITIES_BY_PROVINCE: Record<string, string[]> = {
  "DKI Jakarta": [
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Jakarta Timur",
    "Jakarta Barat",
    "Jakarta Utara",
  ],
  "Jawa Barat": ["Bandung", "Bekasi", "Depok", "Bogor"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang"],
  "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo"],
  "DI Yogyakarta": ["Yogyakarta", "Sleman", "Bantul"],
  Banten: ["Tangerang", "Serang", "Cilegon"],
  Bali: ["Denpasar", "Badung"],
  Central: ["Novena", "Orchard"],
  East: ["Tampines", "Bedok"],
  North: ["Woodlands", "Yishun"],
  "North-East": ["Serangoon", "Hougang"],
  West: ["Jurong East", "Clementi"],
  "Kuala Lumpur": ["Bukit Bintang", "Cheras"],
  Selangor: ["Shah Alam", "Petaling Jaya"],
  Johor: ["Johor Bahru", "Batu Pahat"],
  Penang: ["George Town", "Bayan Lepas"],
  Perak: ["Ipoh", "Taiping"],
};
