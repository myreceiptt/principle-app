// app/store/product/[slug]/page.tsx
type Product = { title: string; price: number; desc: string };
const DB: Record<string, Product> = {
  "tshirt-principle": {
    title: "T-Shirt PRINCIPLE",
    price: 149000,
    desc: "Kaos katun 24s.",
  },
  "cap-principle": {
    title: "Cap PRINCIPLE",
    price: 99000,
    desc: "Topi snapback.",
  },
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = DB[params.slug];
  if (!p) return <main className="p-8">Produk tidak ditemukan.</main>;
  return (
    <main className="p-8 max-w-2xl">
      <a href="/store" className="underline">
        ← Kembali
      </a>
      <h1 className="text-3xl font-bold mt-4">{p.title}</h1>
      <p className="text-gray-700 mt-2">{p.desc}</p>
      <p className="mt-4 text-xl">Rp {p.price.toLocaleString("id-ID")}</p>
      <button className="mt-6 rounded-lg border px-4 py-2">
        Tambah ke Cart (dummy)
      </button>
    </main>
  );
}
