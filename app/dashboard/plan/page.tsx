import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import PlanUpgradeBanner from "@/components/PlanUpgradeBanner";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PADDLE_PRICES: Record<string, string> = {
  starter: process.env.PADDLE_PRICE_STARTER || "pri_01kvxcyj7skk9we9tpbzecfhnh",
  pro: process.env.PADDLE_PRICE_PRO || "pri_01kvxd35mqf8eqkgrv8sw1cj5n",
};

const TIER_META = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    calls: "100 calls/month",
    analyze: "5 analyze/min",
    recommend: "10 recommend/min",
    ai: false,
    color: "border-white/10",
    badge: "text-white/50 bg-white/5",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "/month",
    calls: "2,000 calls/month",
    analyze: "20 analyze/min",
    recommend: "30 recommend/min · 500/mo",
    ai: true,
    color: "border-blue-500/20",
    badge: "text-blue-300 bg-blue-500/10",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    period: "/month",
    calls: "10,000 calls/month",
    analyze: "60 analyze/min",
    recommend: "100 recommend/min · 2,000/mo",
    ai: true,
    color: "border-violet-500/30",
    badge: "text-violet-300 bg-violet-500/10",
  },
] as const;

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

  const TIERS = TIER_META.map((t) => ({
    ...t,
    priceId: t.id === "starter" || t.id === "pro" ? PADDLE_PRICES[t.id] : null,
  }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Plan & Billing</h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your subscription and upgrade your plan.</p>
      </div>

      <Suspense fallback={null}>
        <PlanUpgradeBanner initialTier={currentTier} />
      </Suspense>

      {/* Current plan banner */}
      <div className="card-glass rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-xl font-bold text-white capitalize">{currentTier}</p>
          </div>
          {currentTier === "free" && (
            <p className="text-violet-400 text-sm">Upgrade below to unlock more calls & AI features</p>
          )}
          {currentTier !== "free" && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">Active</span>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          return (
            <div key={tier.id} className={`card-glass rounded-2xl p-5 border ${tier.color} ${isCurrent ? "bg-violet-500/5" : ""} flex flex-col`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tier.badge}`}>{tier.name}</span>
                {isCurrent && <span className="text-xs text-emerald-400 font-medium">Current</span>}
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">{tier.price}</span>
                <span className="text-white/40 text-sm">{tier.period}</span>
              </div>
              <ul className="space-y-1.5 mb-5 flex-1 text-xs text-white/50">
                <li>{tier.calls}</li>
                <li>{tier.analyze}</li>
                <li>{tier.recommend}</li>
                <li className={tier.ai ? "text-emerald-400" : "text-white/25 line-through"}>
                  SKINIC AI ingredient guide
                </li>
              </ul>
              {isCurrent ? (
                <div className="text-center text-xs text-white/30 py-2">Your current plan</div>
              ) : tier.priceId && (tier.id === "starter" || tier.id === "pro") ? (
                <PaddleCheckoutButton
                  priceId={tier.priceId}
                  tier={tier.id}
                  userId={user!.id}
                  userEmail={user!.email || ""}
                  label={`Upgrade to ${tier.name}`}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Enterprise */}
      <div className="card-glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-1">Enterprise</p>
            <p className="text-white/40 text-xs">Unlimited calls, custom rate limits, white-label, priority compliance support, dedicated support.</p>
          </div>
          <a
            href="mailto:skinic@thinkingstudio.ai?subject=Enterprise%20API%20Inquiry%20%E2%80%94%20Dashboard"
            className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/10 transition-all whitespace-nowrap ml-4"
          >
            Contact Sales
          </a>
        </div>
      </div>

      <p className="text-white/20 text-xs">
        After upgrading, your tier updates automatically via webhook within seconds.
        Need help? <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">Contact support</a>
      </p>
    </div>
  );
}
