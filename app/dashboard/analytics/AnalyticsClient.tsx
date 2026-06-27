"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type AnalyticsData = {
  total_scans: number;
  skin_types: { type: string; count: number }[];
  top_traits: { trait: string; count: number }[];
  daily_scans: { date: string; count: number }[];
};

const SKIN_COLORS: Record<string, string> = {
  Oily: "#7c3aed",
  Dry: "#3b82f6",
  Normal: "#10b981",
  Combination: "#f59e0b",
};

function Sparkline({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const w = 600;
  const h = 80;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - (d.count / max) * (h - 10) - 5,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-grad)" />
      <path d={path} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnalyticsClient() {
  const supabase = createClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    const res = await fetch(`${apiUrl}/dashboard/analytics`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [supabase, apiUrl]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  if (loading) return <div className="text-white/30 text-sm py-8 text-center">Loading...</div>;

  if (!data || data.total_scans === 0) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-lg font-semibold text-white">Analytics</h2>
          <p className="text-white/40 text-sm mt-0.5">Scan volume, skin type distribution, and top traits.</p>
        </div>
        <div className="card-glass rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3">📊</p>
          <p className="text-white/60 text-sm font-medium">No data yet</p>
          <p className="text-white/30 text-xs mt-1">
            Analytics will appear here once customers start scanning via your brand page.
          </p>
        </div>
      </div>
    );
  }

  const totalSkinTypes = data.skin_types.reduce((s, t) => s + t.count, 0) || 1;
  const maxTrait = Math.max(...data.top_traits.map((t) => t.count), 1);
  const maxDay = Math.max(...data.daily_scans.map((d) => d.count), 1);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Analytics</h2>
        <p className="text-white/40 text-sm mt-0.5">Last 30 days · {data.total_scans.toLocaleString()} total scans</p>
      </div>

      {/* Total scans + sparkline */}
      <div className="card-glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Total Scans</p>
            <p className="text-3xl font-bold text-white mt-1">{data.total_scans.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs">Last 30 days</p>
            <p className="text-lg font-bold text-violet-400 mt-1">
              {data.daily_scans.reduce((s, d) => s + d.count, 0)}
            </p>
          </div>
        </div>
        <Sparkline data={data.daily_scans} />
        <div className="flex items-center justify-between text-[10px] text-white/20 mt-1">
          <span>{data.daily_scans[0]?.date}</span>
          <span>{data.daily_scans[data.daily_scans.length - 1]?.date}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Skin type distribution */}
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">Skin Type Distribution</p>
          <div className="space-y-3">
            {data.skin_types.map((st) => {
              const pct = Math.round((st.count / totalSkinTypes) * 100);
              const color = SKIN_COLORS[st.type] || "#6366f1";
              return (
                <div key={st.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70">{st.type}</span>
                    <span className="text-xs text-white/40">{st.count} · {pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top traits */}
        <div className="card-glass rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">Top Visible Traits</p>
          <div className="space-y-3">
            {data.top_traits.map((tr) => {
              const pct = Math.round((tr.count / maxTrait) * 100);
              return (
                <div key={tr.trait}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70">{tr.trait}</span>
                    <span className="text-xs text-white/40">{tr.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily breakdown table (last 7 days) */}
      <div className="card-glass rounded-2xl p-5">
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">Daily Scans (last 7 days)</p>
        <div className="flex items-end gap-1.5 h-20">
          {data.daily_scans.slice(-7).map((d) => {
            const pct = (d.count / maxDay) * 100;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-white/30">{d.count || ""}</span>
                <div className="w-full rounded-t" style={{ height: `${Math.max(pct, 2)}%`, background: "#7c3aed66" }} />
                <span className="text-[9px] text-white/20">{d.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
