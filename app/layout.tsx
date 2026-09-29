import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Weddings by Beso — Luxury Wedding Photography", template: "%s · Weddings by Beso" },
  description: "Timeless, editorial wedding photography. Book your date across Egypt and beyond.",
  openGraph: { type: "website", title: "Weddings by Beso", description: "Timeless, editorial wedding photography." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}