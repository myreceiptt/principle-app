// app/store/page.tsx
type Product = { id: string; title: string; price: number; slug: string };
const DUMMY: Product[] = [
  {
    id: "1",
    title: "T-Shirt PRINCIPLE",
    price: 149000,
    slug: "tshirt-principle",
  },
  { id: "2", title: "Cap PRINCIPLE", price: 99000, slug: "cap-principle" },
];

export default function StorePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Store</h1>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DUMMY.map((p) => (
          <li key={p.id} className="rounded-lg border p-4">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-gray-600 mt-1">
              Rp {p.price.toLocaleString("id-ID")}
            </p>
            <a
              className="inline-block mt-3 underline"
              href={`/store/product/${p.slug}`}>
              Lihat
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
