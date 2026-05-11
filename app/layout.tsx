import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKINIC — AI Skin Intelligence API",
  description:
    "Enterprise-grade skin analysis API. 3-layer AI stack: cosmetic classifier, medical screening, and Google Derm Foundation embeddings. Built for clinics, beauty platforms, and health apps.",
  keywords: ["skin AI", "dermatology API", "skin analysis", "B2B skincare API", "SKINIC"],
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
