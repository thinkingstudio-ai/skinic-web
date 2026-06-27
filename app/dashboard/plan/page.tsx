import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import PlanUpgradeBanner from "@/components/PlanUpgradeBanner";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PADDLE_PRICES: Record<string, string> = {
  starter:     process.env.PADDLE_PRICE_STARTER     || "pri_01kvxcyj7skk9we9tpbzecfhnh",
  pro:         process.env.PADDLE_PRICE_PRO         || "pri_01kvxd35mqf8eqkgrv8sw1cj5n",
  starter_app: process.env.PADDLE_PRICE_STARTER_APP || "",
  pro_app:     process.env.PADDLE_PRICE_PRO_APP     || "",
};

const API_TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["50 trial API calls", "5 req/min", "API docs access"],
    color: "border-white/10",
    badge: "text-white/50 bg-white/5",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "/month",
    features: ["2,000 calls/month", "20 req/min", "AI ingredient guide", "Email support"],
    color: "border-blue-500/20",
    badge: "text-blue-300 bg-blue-500/10",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    period: "/month",
    features: ["10,000 calls/month", "60 req/min", "AI ingredient guide", "Priority support"],
    color: "border-violet-500/30",
    badge: "text-violet-300 bg-violet-500/10",
  },
] as const;

const STUDIO_TIERS = [
  {
    id: "free",
    name: "Free Preview",
    price: "$0",
    period: "/month",
    features: ["50 scans/month", "5 catalog items", "Branded scan page preview"],
    color: "border-white/10",
    badge: "text-white/50 bg-white/5",
  },
  {
    id: "starter_app",
    name: "Starter Studio",
    price: "$39",
    period: "/month",
    features: ["2,000 scans/month", "Unlimited catalog", "Lead capture", "Customer DB", "CSV export"],
    color: "border-blue-500/20",
    badge: "text-blue-300 bg-blue-500/10",
  },
  {
    id: "pro_app",
    name: "Pro Studio",
    price: "$129",
    period: "/month",
    features: ["10,000 scans/month", "Analytics dashboard", "Embed code", "Remove SKINIC branding", "Priority support"],
    color: "border-violet-500/30",
    badge: "text-violet-300 bg-violet-500/10",
  },
] as const;

const TIER_DISPLAY: Record<string, string> = {
  free: "Free", starter: "Starter", pro: "Pro",
  starter_app: "Starter Studio", pro_app: "Pro Studio", enterprise: "Enterprise",
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
    .limit(1);

  const currentTier = keys?.[0]?.tier || "free";
  const intent = (user!.user_metadata?.product_intent as "studio" | "api" | null) ?? null;
  const tiers: readonly TierItem[] = intent === "api" ? API_TIERS : STUDIO_TIERS;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Plan &amp; Billing</h2>
        <p className="text-white/40 text-sm mt-0.5">
          {intent === "api" ? "API Developer plans" : intent === "studio" ? "SKINIC Studio plans" : "Choose the plan that fits your needs"}
        </p>
      </div>

      <Suspense fallback={null}>
        <PlanUpgradeBanner initialTier={currentTier} />
      </Suspense>

      <div className="card-glass rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-xl font-bold text-white">{TIER_DISPLAY[currentTier] || currentTier}</p>
          </div>
          {currentTier !== "free" && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">Active</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isCurrent={currentTier === tier.id}
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
              {intent === "api"
                ? "Unlimited calls, custom rate limits, SLA, dedicated engineer."
                : "Unlimited scans, custom domain, dedicated onboarding, custom SLA."}
            </p>
          </div>
          <a href="/enterprise" className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/10 transition-all whitespace-nowrap ml-4">
            Contact Sales
          </a>
        </div>
      </div>

      {intent === "api" && (
        <p className="text-white/25 text-xs">
          Want to add a branded scan page for your clients?{" "}
          <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">Contact us to switch to Studio plan</a>
        </p>
      )}

      <p className="text-white/20 text-xs">
        After upgrading, your plan updates automatically within seconds.
        Need help? <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">Contact support</a>
      </p>
    </div>
  );
}
