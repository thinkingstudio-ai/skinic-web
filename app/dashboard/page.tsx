import { createClient, createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TIER_LIMITS: Record<string, { monthly: number | null; analyze_rpm: number; recommend_rpm: number; ai: boolean }> = {
  free:        { monthly: 50,    analyze_rpm: 5,   recommend_rpm: 10,  ai: false },
  starter:     { monthly: 2000,  analyze_rpm: 20,  recommend_rpm: 30,  ai: true  },
  pro:         { monthly: 10000, analyze_rpm: 60,  recommend_rpm: 100, ai: true  },
  starter_app: { monthly: 2000,  analyze_rpm: 20,  recommend_rpm: 30,  ai: true  },
  pro_app:     { monthly: 10000, analyze_rpm: 60,  recommend_rpm: 100, ai: true  },
  enterprise:  { monthly: null,  analyze_rpm: 200, recommend_rpm: 500, ai: true  },
};

const TIER_DISPLAY: Record<string, string> = {
  free: "Free", starter: "Starter", pro: "Pro",
  starter_app: "Starter", pro_app: "Pro", enterprise: "Enterprise",
};

const TIER_COLORS: Record<string, string> = {
  free:        "text-white/50 bg-white/5 border-white/10",
  starter:     "text-blue-300 bg-blue-500/10 border-blue-500/20",
  pro:         "text-violet-300 bg-violet-500/10 border-violet-500/20",
  starter_app: "text-blue-300 bg-blue-500/10 border-blue-500/20",
  pro_app:     "text-violet-300 bg-violet-500/10 border-violet-500/20",
  enterprise:  "text-amber-300 bg-amber-500/10 border-amber-500/20",
};

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const intent = (user!.user_metadata?.product_intent as "studio" | "api" | null) ?? null;
  const name = user!.user_metadata?.name || user!.email?.split("@")[0];

  const { data: keys } = await admin
    .from("api_keys")
    .select("id, tier, total_calls, monthly_calls")
    .eq("supabase_user_id", user!.id)
    .order("created_at", { ascending: false });

  const primaryKey = keys?.[0];
  const tier = primaryKey?.tier || "free";
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
  let monthlyCalls = primaryKey?.monthly_calls || 0;
  const usagePct = limits.monthly ? Math.min(100, Math.round((monthlyCalls / limits.monthly) * 100)) : 0;

  // Fetch Studio data if needed
  let totalScans = 0;
  let totalCustomers = 0;
  let totalCatalogItems = 0;
  let brandSlug: string | null = null;

  const isStudioUser = intent === "studio" || intent === null;

  if (isStudioUser && keys && keys.length > 0) {
    const keyIds = keys.map((k) => k.id);
    const { data: brand } = await admin
      .from("brands")
      .select("id, slug")
      .in("api_key_id", keyIds)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (brand) {
      brandSlug = brand.slug;
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const [scansRes, scansThisMonthRes, customersRes, catalogRes] = await Promise.all([
        admin.from("brand_scans").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
        admin.from("brand_scans").select("id", { count: "exact", head: true }).eq("brand_id", brand.id).gte("created_at", monthStart.toISOString()),
        admin.from("brand_customers").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
        admin.from("brand_catalog").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
      ]);
      totalScans = scansRes.count || 0;
      totalCustomers = customersRes.count || 0;
      totalCatalogItems = catalogRes.count || 0;
      // Override monthlyCalls for Studio users to reflect actual funnel scans
      if (intent === "studio") monthlyCalls = scansThisMonthRes.count || 0;
    }
  }

  const isApiUser = intent === "api" || intent === null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Welcome back, {name} 👋</h2>
        <p className="text-white/60 text-sm">
          {intent === "studio" ? "Here's what's happening in your Studio." :
           intent === "api"    ? "Here's your API usage at a glance." :
                                 "Your Studio and API in one place."}
        </p>
      </div>

      {/* Plan + monthly usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/55 text-xs font-medium uppercase tracking-wider mb-3">Current Plan</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border capitalize ${TIER_COLORS[tier] || TIER_COLORS.free}`}>
            {TIER_DISPLAY[tier] || tier}
          </span>
          {tier === "free" && (
            <p className="mt-3 text-xs text-white/30">
              <Link href="/dashboard/plan" className="text-violet-400 hover:text-violet-300">Upgrade →</Link>
            </p>
          )}
        </div>

        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/55 text-xs font-medium uppercase tracking-wider mb-3">This Month</p>
          <p className="text-2xl font-bold text-white">{monthlyCalls.toLocaleString()}</p>
          <p className="text-white/50 text-xs mt-1">of {limits.monthly?.toLocaleString() ?? "∞"} {intent === "studio" ? "scans" : "calls"}</p>
          {limits.monthly && (
            <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${usagePct > 80 ? "bg-red-500" : "bg-violet-500"}`} style={{ width: `${usagePct}%` }} />
            </div>
          )}
        </div>

        {intent === "studio" ? (
          <div className="card-glass rounded-2xl p-5">
            <p className="text-white/55 text-xs font-medium uppercase tracking-wider mb-3">Customers</p>
            <p className="text-2xl font-bold text-white">{totalCustomers.toLocaleString()}</p>
            <p className="text-white/50 text-xs mt-1">{totalScans} total scans</p>
          </div>
        ) : (
          <div className="card-glass rounded-2xl p-5">
            <p className="text-white/55 text-xs font-medium uppercase tracking-wider mb-3">Total Calls</p>
            <p className="text-2xl font-bold text-white">{(primaryKey?.total_calls || 0).toLocaleString()}</p>
            <p className="text-white/50 text-xs mt-1">all time</p>
          </div>
        )}
      </div>

      {/* Studio section */}
      {isStudioUser && (
        <>
          {brandSlug ? (
            <div className="card-glass rounded-2xl p-5">
              <p className="text-white/55 text-xs font-medium uppercase tracking-wider mb-3">Your Scan Page</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-sm text-violet-300 bg-white/5 rounded-lg px-3 py-2 truncate">
                  skinic.app/b/{brandSlug}
                </code>
                <a href={`https://skinic.app/b/${brandSlug}`} target="_blank" rel="noreferrer"
                  className="text-xs px-3 py-2 rounded-lg border border-white/10 hover:border-violet-500/40 text-white/60 hover:text-white transition-all">
                  Open ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="card-glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
              <p className="text-amber-300 text-sm font-semibold mb-1">Set up your scan page</p>
              <p className="text-white/65 text-xs mb-3">Create your branded link and start profiling customers.</p>
              <Link href="/dashboard/funnel" className="text-xs px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
                Set Up Scan Page →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/catalog" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Catalog</p>
              </div>
              <p className="text-white/55 text-xs">{totalCatalogItems} item{totalCatalogItems !== 1 ? "s" : ""} · Products &amp; services</p>
            </Link>

            <Link href="/dashboard/customers" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Customers</p>
              </div>
              <p className="text-white/55 text-xs">{totalCustomers} customer{totalCustomers !== 1 ? "s" : ""} · Filter, export CSV</p>
            </Link>
          </div>
        </>
      )}

      {/* Developer section */}
      {isApiUser && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/keys" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">API Keys</p>
              </div>
              <p className="text-white/55 text-xs">{keys?.length || 0} key{keys?.length !== 1 ? "s" : ""} active · Create, copy, delete</p>
            </Link>

            <Link href="/dashboard/usage" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">Usage &amp; Stats</p>
              </div>
              <p className="text-white/55 text-xs">View detailed breakdown by endpoint</p>
            </Link>
          </div>

          <div className="card-glass rounded-2xl p-5">
            <p className="text-white/55 text-xs font-medium uppercase tracking-wider mb-4">Your Rate Limits</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-white">{limits.analyze_rpm}</p>
                <p className="text-white/55 text-xs mt-0.5">analyze / min</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{limits.recommend_rpm}</p>
                <p className="text-white/55 text-xs mt-0.5">recommend / min</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{limits.ai ? "✓" : "✗"}</p>
                <p className="text-white/55 text-xs mt-0.5">SKINIC AI</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/50">
            <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="hover:text-violet-400 transition-colors">API Docs →</a>
            <span>·</span>
            <Link href="/dashboard/terms" className="hover:text-white/50 transition-colors">Terms &amp; Policy</Link>
          </div>
        </>
      )}
    </div>
  );
}
