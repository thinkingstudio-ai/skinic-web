import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import PlanUpgradeBanner from "@/components/PlanUpgradeBanner";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Unified pricing — Studio rates, covers both API and Studio features.
// Paddle price IDs use the Studio products (STARTER_APP / PRO_APP) since those
// are already approved and priced correctly.
const PADDLE_PRICES: Record<string, string> = {
  starter: process.env.PADDLE_PRICE_STARTER_APP || process.env.PADDLE_PRICE_STARTER || "",
  pro:     process.env.PADDLE_PRICE_PRO_APP     || process.env.PADDLE_PRICE_PRO     || "",
};

const UNIFIED_TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "50 scans / API calls per month",
      "Branded scan page (preview)",
      "5 catalog items",
      "API docs access",
    ],
    color: "border-white/10",
    badge: "text-white/50 bg-white/5",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$39",
    period: "/month",
    features: [
      "2,000 scans / API calls per month",
      "Studio funnel — full access",
      "API access (20 req/min)",
      "Lead capture & Customer DB",
      "Unlimited catalog items",
      "CSV export",
    ],
    color: "border-blue-500/20",
    badge: "text-blue-300 bg-blue-500/10",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$129",
    period: "/month",
    features: [
      "10,000 scans / API calls per month",
      "Everything in Starter",
      "Analytics dashboard",
      "Website embed code",
      "Remove 'Powered by SKINIC'",
      "Priority support",
    ],
    color: "border-violet-500/30",
    badge: "text-violet-300 bg-violet-500/10",
  },
] as const;

const TIER_DISPLAY: Record<string, string> = {
  free: "Free", starter: "Starter", pro: "Pro",
  starter_app: "Starter", pro_app: "Pro", enterprise: "Enterprise",
};

type TierItem = { id: string; name: string; price: string; period: string; features: readonly string[]; color: string; badge: string };

function TierCard({ tier, isCurrent, priceId, userId, userEmail }: {
  tier: TierItem;
  isCurrent: boolean;
  priceId: string | null;
  userId: string;
  userEmail: string;
}) {
  return (
    <div className={`card-glass rounded-2xl p-5 border ${tier.color} ${isCurrent ? "bg-violet-500/5" : ""} flex flex-col`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tier.badge}`}>{tier.name}</span>
        {isCurrent && <span className="text-xs text-emerald-400 font-medium">Current</span>}
      </div>
      <div className="mb-4">
        <span className="text-2xl font-bold text-white">{tier.price}</span>
        <span className="text-white/40 text-sm">{tier.period}</span>
      </div>
      <ul className="space-y-1.5 mb-5 flex-1 text-xs text-white/50">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      {isCurrent ? (
        <div className="text-center text-xs text-white/30 py-2">Your current plan</div>
      ) : priceId ? (
        <PaddleCheckoutButton
          priceId={priceId}
          tier={tier.id}
          userId={userId}
          userEmail={userEmail}
          label={`Upgrade to ${tier.name}`}
        />
      ) : tier.id === "free" ? (
        <div className="text-center text-xs text-white/20 py-2">Your starting plan</div>
      ) : (
        <div className="text-center text-xs text-white/25 py-2">Coming soon</div>
      )}
    </div>
  );
}

export default async function PlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();
  const { data: keys } = await admin
    .from("api_keys")
    .select("tier")
    .eq("supabase_user_id", user!.id)
    .order("created_at", { ascending: true })
    .limit(1);

  const rawTier = keys?.[0]?.tier || "free";
  // Normalise legacy _app tiers to unified names for display
  const normalisedTier = rawTier === "starter_app" ? "starter" : rawTier === "pro_app" ? "pro" : rawTier;
  const displayName = TIER_DISPLAY[rawTier] || rawTier;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Plan &amp; Billing</h2>
        <p className="text-white/40 text-sm mt-0.5">
          One plan covers both Studio and API — choose the scale that fits your business.
        </p>
      </div>

      <Suspense fallback={null}>
        <PlanUpgradeBanner initialTier={rawTier} />
      </Suspense>

      <div className="card-glass rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-xl font-bold text-white">{displayName}</p>
          </div>
          {rawTier !== "free" && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">Active</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {UNIFIED_TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isCurrent={normalisedTier === tier.id}
            priceId={tier.id !== "free" ? (PADDLE_PRICES[tier.id] || null) : null}
            userId={user!.id}
            userEmail={user!.email || ""}
          />
        ))}
      </div>

      <div className="card-glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-1">Enterprise</p>
            <p className="text-white/40 text-xs">
              Unlimited scans &amp; API calls, custom domain, dedicated onboarding, custom SLA.
            </p>
          </div>
          <a href="/enterprise" className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/10 transition-all whitespace-nowrap ml-4">
            Contact Sales
          </a>
        </div>
      </div>

      <p className="text-white/20 text-xs">
        After upgrading, your plan updates automatically within seconds.
        Need help? <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">Contact support</a>
      </p>
    </div>
  );
}
