import { notFound } from "next/navigation";
import BrandScanClient from "./BrandScanClient";

type BrandConfig = {
  brand_id: string;
  slug: string;
  lead_capture_enabled: boolean;
  app_name: string;
  tagline: string;
  logo_url: string | null;
  primary_color: string;
  remove_powered_by: boolean;
  catalog: CatalogItem[];
};

export type CatalogItem = {
  id: string;
  type: "product" | "service";
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
  cta_url: string | null;
  cta_label: string;
  skin_type_tags: string[];
  trait_tags: string[];
};

async function getBrandConfig(slug: string): Promise<BrandConfig | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";
  try {
    const res = await fetch(`${apiUrl}/brand/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrandConfig(slug);
  if (!brand) return { title: "Not Found" };

  const title = `${brand.app_name} — Free AI Skin Analysis`;
  const description = brand.tagline || "Discover your skin type and get personalised recommendations in 30 seconds.";
  const url = `https://skinic.app/b/${slug}`;
  // White-label: preview shows the brand's own logo, never SKINIC branding.
  const images = brand.logo_url ? [{ url: brand.logo_url }] : [];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: brand.app_name,
      type: "website",
      images,
    },
    twitter: {
      card: brand.logo_url ? "summary" : "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function BrandScanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrandConfig(slug);
  if (!brand) notFound();
  return <BrandScanClient brand={brand} />;
}
