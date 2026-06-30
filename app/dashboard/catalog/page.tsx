import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import FeatureLock from "@/components/FeatureLock";
import { canAccessScanPage, catalogItemLimit } from "@/lib/tier-gating";
import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: keys } = await admin
    .from("api_keys")
    .select("tier")
    .eq("supabase_user_id", user!.id)
    .limit(1);

  const tier = keys?.[0]?.tier || "free";

  if (!canAccessScanPage(tier, user!.email)) {
    return (
      <FeatureLock
        feature="Product & Service Catalog"
        description="Add your products and services with skin type tags. SKINIC's AI matches each customer's scan result to the most relevant items in your catalog."
        requiredTier="starter"
        currentTier={tier}
      />
    );
  }

  const itemLimit = catalogItemLimit(tier, user!.email);

  return <CatalogClient itemLimit={itemLimit} />;
}
