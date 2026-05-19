import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
// 1. Core performance optimized typography pipelines
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Bento Market | Multi-Vendor SaaS",
  description:
    "Next-Generation Production Grade E-Commerce Platform Built for Elite Performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} dark`}
      style={{ colorScheme: "dark" }}
    >
      <body
        className="bg-[#030014] text-zinc-100 antialiased selection:bg-purple-500/30 selection:text-purple-200 min-h-screen font-sans"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <AppProviders>
          <div className="relative min-h-screen flex flex-col overflow-x-hidden">
            {/* Ambient Background Glow Effect Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-purple-900/10 via-blue-900/5 to-transparent pointer-events-none blur-[120px] z-0" />

            <main className="relative z-10 flex-grow flex flex-col">
              <Navbar />
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
