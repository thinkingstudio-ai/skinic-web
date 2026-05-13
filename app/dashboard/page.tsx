import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TIER_LIMITS: Record<string, { monthly: number | null; analyze_rpm: number; recommend_rpm: number; ai: boolean }> = {
  free:       { monthly: 100,   analyze_rpm: 5,   recommend_rpm: 10,  ai: false },
  starter:    { monthly: 2000,  analyze_rpm: 20,  recommend_rpm: 30,  ai: true  },
  pro:        { monthly: 10000, analyze_rpm: 60,  recommend_rpm: 100, ai: true  },
  enterprise: { monthly: null,  analyze_rpm: 200, recommend_rpm: 500, ai: true  },
};

const TIER_COLORS: Record<string, string> = {
  free:       "text-white/50 bg-white/5 border-white/10",
  starter:    "text-blue-300 bg-blue-500/10 border-blue-500/20",
  pro:        "text-violet-300 bg-violet-500/10 border-violet-500/20",
  enterprise: "text-amber-300 bg-amber-500/10 border-amber-500/20",
};

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's API keys from backend table
  const { data: keys } = await supabase
    .from("api_keys")
    .select("tier, total_calls, monthly_calls, is_active, created_at")
    .eq("supabase_user_id", user!.id)
    .order("created_at", { ascending: false });

  const primaryKey = keys?.[0];
  const tier = primaryKey?.tier || "free";
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
  const monthlyCalls = primaryKey?.monthly_calls || 0;
  const totalCalls = primaryKey?.total_calls || 0;
  const usagePct = limits.monthly ? Math.min(100, Math.round((monthlyCalls / limits.monthly) * 100)) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Welcome back, {user!.user_metadata?.name || user!.email?.split("@")[0]} 👋
        </h2>
        <p className="text-white/40 text-sm">Here's your SKINIC API usage at a glance.</p>
      </div>

      {/* Tier + quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Current Plan</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border capitalize ${TIER_COLORS[tier]}`}>
            {tier}
          </span>
          {tier === "free" && (
            <p className="mt-3 text-xs text-white/30">
              <Link href="/dashboard/plan" className="text-violet-400 hover:text-violet-300">Upgrade →</Link>
            </p>
          )}
        </div>

        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">This Month</p>
          <p className="text-2xl font-bold text-white">{monthlyCalls.toLocaleString()}</p>
          <p className="text-white/30 text-xs mt-1">
            of {limits.monthly?.toLocaleString() ?? "∞"} calls
          </p>
          {limits.monthly && (
            <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePct > 80 ? "bg-red-500" : "bg-violet-500"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
        </div>

        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Total Calls</p>
          <p className="text-2xl font-bold text-white">{totalCalls.toLocaleString()}</p>
          <p className="text-white/30 text-xs mt-1">all time</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/keys" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">Manage API Keys</p>
          </div>
          <p className="text-white/35 text-xs">{keys?.length || 0} key{keys?.length !== 1 ? "s" : ""} active · Create, copy, delete</p>
        </Link>

        <Link href="/dashboard/usage" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Usage & Stats</p>
          </div>
          <p className="text-white/35 text-xs">View detailed breakdown by endpoint</p>
        </Link>
      </div>

      {/* Rate limits */}
      <div className="card-glass rounded-2xl p-5">
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">Your Rate Limits</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-white">{limits.analyze_rpm}</p>
            <p className="text-white/35 text-xs mt-0.5">analyze / min</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{limits.recommend_rpm}</p>
            <p className="text-white/35 text-xs mt-0.5">recommend / min</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{limits.ai ? "✓" : "✗"}</p>
            <p className="text-white/35 text-xs mt-0.5">SKINIC AI</p>
          </div>
        </div>
      </div>

      {/* Docs link */}
      <div className="flex items-center gap-4 text-sm text-white/30">
        <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="hover:text-violet-400 transition-colors">API Docs →</a>
        <span>·</span>
        <a href="https://api.skinic.app/terms" target="_blank" rel="noreferrer" className="hover:text-white/50 transition-colors">Terms of Service</a>
        <span>·</span>
        <Link href="/dashboard/terms" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
      </div>
    </div>
  );
}
