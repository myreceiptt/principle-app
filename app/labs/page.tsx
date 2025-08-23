// app/labs/page.tsx

import Link from "next/link";

export default function Page() {
  return (
    <main className="p-8">
      <Link href="/" className="underline">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mt-4">Labs</h1>
      <p className="text-gray-600 mt-2">PRINCIPLE Labs</p>
    </main>
  );
}
