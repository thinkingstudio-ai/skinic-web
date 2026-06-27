import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import PlanUpgradeBanner from "@/components/PlanUpgradeBanner";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PADDLE_PRICES: Record<string, string> = {
  starter_app: process.env.PADDLE_PRICE_STARTER_APP || "",
  pro_app:     process.env.PADDLE_PRICE_PRO_APP     || "",
};

const STUDIO_TIERS = [
  {
    id: "free",
    name: "Free Preview",
    price: "$0",
    period: "/month",
    features: ["50 scans/month", "5 catalog items", "Branded scan page", "Customer DB (read-only)"],
    color: "border-white/10",
    badge: "text-white/50 bg-white/5",
  },
  {
    id: "starter_app",
    name: "Starter Studio",
    price: "$39",
    period: "/month",
    features: ["2,000 scans/month", "Unlimited catalog items", "Lead capture form", "CSV export", "AI ingredient guide"],
    color: "border-blue-500/20",
    badge: "text-blue-300 bg-blue-500/10",
  },
  {
    id: "pro_app",
    name: "Pro Studio",
    price: "$129",
    period: "/month",
    features: ["10,000 scans/month", "Analytics dashboard", "Website embed code", "Remove 'Powered by SKINIC'", "Priority support"],
    color: "border-violet-500/30",
    badge: "text-violet-300 bg-violet-500/10",
  },
] as const;

const TIER_DISPLAY_NAME: Record<string, string> = {
  free:        "Free Preview",
  starter_app: "Starter Studio",
  pro_app:     "Pro Studio",
  enterprise:  "Enterprise",
};

export default async function StudioPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();
  const { data: keys } = await admin
    .from("api_keys")
    .select("tier")
    .eq("supabase_user_id", user!.id)
    .limit(1);

  const currentTier = keys?.[0]?.tier || "free";
  const currentDisplayName = TIER_DISPLAY_NAME[currentTier] || currentTier;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Plan &amp; Billing</h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your Studio subscription.</p>
      </div>

      <Suspense fallback={null}>
        <PlanUpgradeBanner initialTier={currentTier} />
      </Suspense>

      <div className="card-glass rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-xl font-bold text-white">{currentDisplayName}</p>
          </div>
          {currentTier !== "free" && currentTier !== "starter" && currentTier !== "pro" && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">Active</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STUDIO_TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          const priceId = tier.id !== "free" ? (PADDLE_PRICES[tier.id] || null) : null;
          return (
            <div
              key={tier.id}
              className={`card-glass rounded-2xl p-5 border ${tier.color} ${isCurrent ? "bg-violet-500/5" : ""} flex flex-col`}
            >
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
                  userId={user!.id}
                  userEmail={user!.email || ""}
                  label={`Upgrade to ${tier.name}`}
                />
              ) : tier.id === "free" ? (
                <div className="text-center text-xs text-white/20 py-2">Your starting plan</div>
              ) : (
                <div className="text-center text-xs text-white/25 py-2">Coming soon</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card-glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-1">Enterprise Studio</p>
            <p className="text-white/40 text-xs">Unlimited scans, custom domain, dedicated onboarding, custom contract &amp; SLA.</p>
          </div>
          <a
            href="/enterprise"
            className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/10 transition-all whitespace-nowrap ml-4"
          >
            Contact Sales
          </a>
        </div>
      </div>

      <p className="text-white/20 text-xs">
        After upgrading, your plan updates automatically within seconds.
        Need help? <a href="mailto:admin.thinkingstudio@gmail.com" className="text-violet-400">Contact support</a>
      </p>
    </div>
  );
}
