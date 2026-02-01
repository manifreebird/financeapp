






import type { Metadata } from "next";
import { DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "My Finance",
  description: "Your money, your control",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-dm-sans)]">

        {/* NAVBAR */}
        <Nav />

        {/* MAIN CONTENT */}
        <main className="max-w-[1100px] mx-auto px-6 py-8 pb-20">
          {children}
        </main>

      </body>
    </html>
  );
}














