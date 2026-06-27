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
  return {
    title: `${brand.app_name} — Skin Profile`,
    description: brand.tagline,
  };
}

export default async function BrandScanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrandConfig(slug);
  if (!brand) notFound();
  return <BrandScanClient brand={brand} />;
}
