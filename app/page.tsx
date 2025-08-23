// app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold">PRINCIPLE</h1>
        <p className="mt-2 text-gray-600">
          Company & Brand Profile • Store (Retail) • Spaces • Labs • Medias
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link className="rounded-lg border p-4" href="/store">
            Store
          </Link>
          <Link className="rounded-lg border p-4" href="/spaces">
            Spaces
          </Link>
          <Link className="rounded-lg border p-4" href="/labs">
            Labs
          </Link>
          <Link className="rounded-lg border p-4" href="/media">
            Media
          </Link>
        </div>
      </div>
    </main>
  );
}
