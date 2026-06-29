import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import FeatureLock from "@/components/FeatureLock";
import AnalyticsClient from "./AnalyticsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ANALYTICS_TIERS = ["pro", "pro_app", "enterprise", "internal"];

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: keys } = await admin
    .from("api_keys")
    .select("tier")
    .eq("supabase_user_id", user!.id)
    .limit(1);

  const tier = keys?.[0]?.tier || "free";

  if (!ANALYTICS_TIERS.includes(tier)) {
    return (
      <FeatureLock
        feature="Analytics"
        description="Track scan volume, skin type distribution, top traits, and CTA click-through rates. Understand your customers better and optimise your catalog."
        requiredTier="pro"
        currentTier={tier}
      />
    );
  }

  return <AnalyticsClient />;
}
