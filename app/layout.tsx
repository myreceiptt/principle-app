// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
              <div className="max-w-5xl mx-auto p-4 text-sm text-gray-500">
                © {new Date().getFullYear()} PRINCIPLE
              </div>
            </footer>
          </CartProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
