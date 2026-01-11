// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import Header from "@/components/Header";
import { RoleProvider } from "@/components/RoleProvider";
import { CartProvider } from "@/components/CartProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRINCIPLE",
  description: "Company & Brand Profile • Store • Spaces • Labs • Media",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <RoleProvider>
          <CartProvider>
            <Header />
            {children}
            <footer className="border-t mt-12">
              <div className="max-w-5xl mx-auto p-4 text-sm text-gray-500 flex items-center gap-2">
                <span>© {new Date().getFullYear()} PRINCIPLE</span>
                <span aria-hidden="true">|</span>
                <a
                  href="https://www.instagram.com/thisisprinciple/"
                  aria-label="PRINCIPLE on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-gray-700">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4">
                    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </footer>
            <Analytics />
          </CartProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
