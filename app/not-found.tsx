// app/not-found.tsx

import Link from "next/link";
export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-gray-600 mt-2">Wrong address, OiOi!</p>
      <Link href="/" className="underline mt-4 inline-block">
        ← Go Home
      </Link>
    </main>
  );
}
