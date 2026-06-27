import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CatalogPage() {
  return <CatalogClient />;
}
