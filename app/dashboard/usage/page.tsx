import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UsagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: keys } = await supabase
    .from("api_keys")
    .select("name, tier, total_calls, monthly_calls, month_start, created_at, last_used")
    .eq("supabase_user_id", user!.id)
    .order("created_at", { ascending: false });

  const totalMonthly = keys?.reduce((s, k) => s + (k.monthly_calls || 0), 0) || 0;
  const totalAll = keys?.reduce((s, k) => s + (k.total_calls || 0), 0) || 0;

  const TIER_LIMITS: Record<string, number | null> = {
    free: 100, starter: 2000, pro: 10000, enterprise: null,
  };
  const tier = keys?.[0]?.tier || "free";
  const limit = TIER_LIMITS[tier];
  const pct = limit ? Math.min(100, Math.round((totalMonthly / limit) * 100)) : 0;
  const resetDate = keys?.[0]?.month_start
    ? new Date(new Date(keys[0].month_start).setMonth(new Date(keys[0].month_start).getMonth() + 1)).toLocaleDateString()
    : "N/A";

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Usage & Stats</h2>
        <p className="text-white/40 text-sm mt-0.5">Monitor your API consumption across all keys.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">This Month</p>
          <p className="text-3xl font-bold text-white">{totalMonthly.toLocaleString()}</p>
          <p className="text-white/30 text-xs mt-1">of {limit?.toLocaleString() ?? "∞"} calls</p>
        </div>
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">All Time</p>
          <p className="text-3xl font-bold text-white">{totalAll.toLocaleString()}</p>
          <p className="text-white/30 text-xs mt-1">total API calls</p>
        </div>
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Resets On</p>
          <p className="text-xl font-bold text-white">{resetDate}</p>
          <p className="text-white/30 text-xs mt-1">monthly reset</p>
        </div>
      </div>

      {/* Usage bar */}
      {limit && (
        <div className="card-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white">Monthly Usage</p>
            <p className="text-sm text-white/50">{pct}%</p>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-violet-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/30">
            <span>{totalMonthly.toLocaleString()} used</span>
            <span>{(limit - totalMonthly).toLocaleString()} remaining</span>
          </div>
        </div>
      )}

      {/* Per-key breakdown */}
      <div>
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Per Key Breakdown</p>
        <div className="space-y-3">
          {keys && keys.length > 0 ? keys.map((key, i) => (
            <div key={i} className="card-glass rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{key.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    Last used: {key.last_used ? new Date(key.last_used).toLocaleDateString() : "Never"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{(key.monthly_calls || 0).toLocaleString()}</p>
                  <p className="text-xs text-white/30">this month</p>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-white/30 text-sm text-center py-6">No API keys yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
