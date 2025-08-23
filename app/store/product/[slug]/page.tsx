// app/store/product/[slug]/page.tsx

type Product = { title: string; price: number; desc: string };
const DB: Record<string, Product> = {
  "tshirt-principle": {
    title: "T-Shirt PRINCIPLE",
    price: 149000,
    desc: "Cotton 24s fabric.",
  },
  "cap-principle": {
    title: "Cap PRINCIPLE",
    price: 99000,
    desc: "Snapback Cap.",
  },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ tunggu params
  const p = DB[slug];

  if (!p) return <main className="p-8">Product not found.</main>;

  return (
    <main className="p-8 max-w-2xl">
      <a href="/store" className="underline">
        ← Back
      </a>
      <h1 className="text-3xl font-bold mt-4">{p.title}</h1>
      <p className="text-gray-700 mt-2">{p.desc}</p>
      <p className="mt-4 text-xl">Rp {p.price.toLocaleString("id-ID")}</p>
      <button className="mt-6 rounded-lg border px-4 py-2">
        Add to Cart (dummy)
      </button>
    </main>
  );
}
