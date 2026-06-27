import CatalogClient from "@/app/dashboard/catalog/CatalogClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StudioCatalogPage() {
  return <CatalogClient />;
}
