import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import FeatureLock from "@/components/FeatureLock";
import { canAccessStudio } from "@/lib/tier-gating";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: keys } = await admin
    .from("api_keys")
    .select("tier")
    .eq("supabase_user_id", user!.id)
    .limit(1);

  const tier = keys?.[0]?.tier || "free";

  if (!canAccessStudio(tier, user!.email)) {
    return (
      <FeatureLock
        feature="Customer Database"
        description="Every scan builds your customer list automatically. View skin profiles, filter by type, and export to CSV for follow-up campaigns."
        requiredTier="starter"
        currentTier={tier}
      />
    );
  }

  return <CustomersClient />;
}
