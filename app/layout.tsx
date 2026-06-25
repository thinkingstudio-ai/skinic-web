import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKINIC — AI Skin Intelligence API",
  description:
    "Enterprise-grade skin analysis API. Multi-layer AI: skin-type analysis, aesthetic concern detection, and deep skin embeddings. Built for beauty platforms, skincare brands, and consumer apps.",
  keywords: ["skin AI", "skin type API", "cosmetic skin analysis", "skincare API", "B2B beauty API", "SKINIC"],
  openGraph: {
    title: "SKINIC — AI Skin Intelligence API",
    description: "Production-ready skin analysis API for B2B integration.",
    url: "https://skinic.app",
    siteName: "SKINIC",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
