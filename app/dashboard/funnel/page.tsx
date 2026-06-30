import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import FeatureLock from "@/components/FeatureLock";
import { canAccessScanPage } from "@/lib/tier-gating";
import FunnelSetupClient from "./FunnelSetupClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FunnelSetupPage() {
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
        feature="Scan Page"
        description="Create a branded AI skin profiling page for your customers. Share the link on Instagram, WhatsApp, or embed it on your website."
        requiredTier="starter"
        currentTier={tier}
      />
    );
  }

  return <FunnelSetupClient />;
}
