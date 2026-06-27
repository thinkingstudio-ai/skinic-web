import { createClient, createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TIER_LABELS: Record<string, string> = {
  free:         "Free Preview",
  starter_app:  "Starter Studio",
  pro_app:      "Pro Studio",
  enterprise:   "Enterprise",
};

const TIER_COLORS: Record<string, string> = {
  free:         "text-white/50 bg-white/5 border-white/10",
  starter_app:  "text-blue-300 bg-blue-500/10 border-blue-500/20",
  pro_app:      "text-violet-300 bg-violet-500/10 border-violet-500/20",
  enterprise:   "text-amber-300 bg-amber-500/10 border-amber-500/20",
};

export default async function StudioOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: keys } = await admin
    .from("api_keys")
    .select("id, tier, monthly_calls")
    .eq("supabase_user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const primaryKey = keys?.[0];
  const tier = primaryKey?.tier || "free";

  const { data: brand } = primaryKey
    ? await admin
        .from("brands")
        .select("id, slug")
        .eq("api_key_id", primaryKey.id)
        .maybeSingle()
    : { data: null };

  let totalScans = 0;
  let totalCustomers = 0;
  let totalCatalogItems = 0;

  if (brand) {
    const [scansRes, customersRes, catalogRes] = await Promise.all([
      admin.from("brand_scans").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
      admin.from("brand_customers").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
      admin.from("brand_catalog").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
    ]);
    totalScans = scansRes.count || 0;
    totalCustomers = customersRes.count || 0;
    totalCatalogItems = catalogRes.count || 0;
  }

  const name = user!.user_metadata?.name || user!.email?.split("@")[0];
  const scanPageUrl = brand?.slug ? `https://skinic.app/b/${brand.slug}` : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Welcome back, {name} 👋
        </h2>
        <p className="text-white/40 text-sm">Your SKINIC Studio at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Current Plan</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${TIER_COLORS[tier] || TIER_COLORS.free}`}>
            {TIER_LABELS[tier] || tier}
          </span>
          {(tier === "free" || tier === "starter_app") && (
            <p className="mt-3 text-xs text-white/30">
              <Link href="/studio/plan" className="text-violet-400 hover:text-violet-300">Upgrade →</Link>
            </p>
          )}
        </div>

        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Total Scans</p>
          <p className="text-2xl font-bold text-white">{totalScans.toLocaleString()}</p>
          <p className="text-white/30 text-xs mt-1">this month: {(primaryKey?.monthly_calls || 0).toLocaleString()}</p>
        </div>

        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Customers</p>
          <p className="text-2xl font-bold text-white">{totalCustomers.toLocaleString()}</p>
          <p className="text-white/30 text-xs mt-1">{totalCatalogItems} catalog item{totalCatalogItems !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Scan page URL */}
      {scanPageUrl ? (
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Your Scan Page</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-sm text-violet-300 bg-white/5 rounded-lg px-3 py-2 truncate">{scanPageUrl}</code>
            <a
              href={scanPageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-2 rounded-lg border border-white/10 hover:border-violet-500/40 text-white/60 hover:text-white transition-all"
            >
              Open ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="card-glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
          <p className="text-amber-300 text-sm font-semibold mb-1">Set up your scan page</p>
          <p className="text-white/50 text-xs mb-3">Choose a slug to create your branded scan link and start profiling customers.</p>
          <Link href="/studio/scanpage" className="text-xs px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
            Set Up Scan Page →
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/studio/catalog" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Manage Catalog</p>
          </div>
          <p className="text-white/35 text-xs">{totalCatalogItems} item{totalCatalogItems !== 1 ? "s" : ""} · Add products &amp; services for AI matching</p>
        </Link>

        <Link href="/studio/customers" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Customer Database</p>
          </div>
          <p className="text-white/35 text-xs">{totalCustomers} customer{totalCustomers !== 1 ? "s" : ""} · Filter, export CSV</p>
        </Link>

        <Link href="/studio/analytics" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">Analytics</p>
          </div>
          <p className="text-white/35 text-xs">Scan volume, skin types, top traits, CTA performance</p>
        </Link>

        <Link href="/studio/scanpage" className="card-glass rounded-2xl p-5 hover:border-violet-500/30 border border-white/5 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">Scan Page Setup</p>
          </div>
          <p className="text-white/35 text-xs">Slug, lead capture, embed code, share links</p>
        </Link>
      </div>
    </div>
  );
}
