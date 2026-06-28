"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type BrandState = {
  app_name: string;
  tagline: string;
  logo_url: string;
  primary_color: string;
  remove_powered_by: boolean;
  tier: string;
  can_remove_branding: boolean;
};

const DEFAULT_BRAND: BrandState = {
  app_name: "",
  tagline: "",
  logo_url: "",
  primary_color: "#7c3aed",
  remove_powered_by: false,
  tier: "free",
  can_remove_branding: false,
};

const PRESET_COLORS = [
  "#7c3aed",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#111827",
];

export default function StudioBrandSetupClient() {
  const supabase = createClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";

  const [brand, setBrand] = useState<BrandState>(DEFAULT_BRAND);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchBrand = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/dashboard/studio/brand`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBrand({
          ...DEFAULT_BRAND,
          ...data,
          logo_url: data.logo_url ?? "",
        });
      }
    } catch {
      // leave defaults
    }
    setLoading(false);
  }, [supabase, apiUrl]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError("Session expired. Please sign in again.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/dashboard/studio/brand`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          app_name: brand.app_name,
          tagline: brand.tagline,
          logo_url: brand.logo_url || null,
          primary_color: brand.primary_color,
          remove_powered_by: brand.remove_powered_by,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { detail?: string }).detail || "Failed to save branding.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="text-white/30 text-sm py-12 text-center">Loading…</div>
    );

  const initial = (brand.app_name || "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Brand Identity</h2>
        <p className="text-white/40 text-sm mt-0.5">
          Customise how your brand appears on the scan page shared with your
          customers. Changes take effect immediately.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <div className="card-glass rounded-2xl p-5 space-y-4">
          {/* Brand name */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Brand name
            </label>
            <input
              type="text"
              maxLength={40}
              value={brand.app_name}
              onChange={(e) => setBrand({ ...brand, app_name: e.target.value })}
              placeholder="e.g. Dunia Herbs"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              maxLength={80}
              value={brand.tagline}
              onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
              placeholder="e.g. Your personalised skincare journey"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Logo URL
            </label>
            <input
              type="url"
              value={brand.logo_url}
              onChange={(e) => setBrand({ ...brand, logo_url: e.target.value })}
              placeholder="https://yourdomain.com/logo.png"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <p className="text-white/25 text-xs mt-1">
              Square PNG or SVG with transparent background works best.
            </p>
          </div>

          {/* Colour picker */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Brand colour
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBrand({ ...brand, primary_color: c })}
                  style={{ background: c }}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    brand.primary_color.toLowerCase() === c.toLowerCase()
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f]"
                      : "hover:scale-110"
                  }`}
                  aria-label={c}
                />
              ))}
              <input
                type="color"
                value={brand.primary_color}
                onChange={(e) =>
                  setBrand({ ...brand, primary_color: e.target.value })
                }
                className="w-8 h-8 rounded-lg bg-transparent border border-white/10 cursor-pointer"
                title="Custom colour"
              />
            </div>
          </div>

          {/* Remove powered-by — tier gated */}
          <div className="pt-2 border-t border-white/5">
            <label
              className={`flex items-center gap-3 ${
                brand.can_remove_branding
                  ? "cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <input
                type="checkbox"
                disabled={!brand.can_remove_branding}
                checked={brand.remove_powered_by}
                onChange={(e) =>
                  setBrand({ ...brand, remove_powered_by: e.target.checked })
                }
                className="w-4 h-4 accent-violet-500"
              />
              <span className="text-sm text-white/70">
                Remove &quot;Powered by SKINIC AI&quot;
              </span>
            </label>
            {!brand.can_remove_branding && (
              <p className="text-amber-400/70 text-xs mt-1.5 ml-7">
                Requires Pro tier or higher.{" "}
                <a href="/dashboard/plan" className="underline">
                  Upgrade →
                </a>
              </p>
            )}
          </div>

          {/* Save */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all"
            >
              {saving ? "Saving…" : "Save branding"}
            </button>
            {saved && (
              <span className="text-emerald-400 text-sm">✓ Saved</span>
            )}
            {error && <span className="text-red-400 text-xs">{error}</span>}
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="card-glass rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">
            Scan page preview
          </p>
          <div
            className="rounded-3xl overflow-hidden border border-white/8"
            style={{ background: "#0a0a0f" }}
          >
            <div className="px-5 py-8 flex flex-col items-center text-center">
              {brand.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo_url}
                  alt="logo"
                  className="w-16 h-16 rounded-2xl object-contain mb-3"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl mb-3 flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: brand.primary_color }}
                >
                  {initial}
                </div>
              )}
              <p className="text-white font-bold text-xl leading-tight">
                {brand.app_name || "Your Brand"}
              </p>
              <p className="text-white/40 text-xs mt-1 leading-tight">
                {brand.tagline || "Your tagline here"}
              </p>
              <div
                className="mt-6 w-full py-3 rounded-2xl text-white text-sm font-bold"
                style={{ background: brand.primary_color }}
              >
                Start My Skin Profile →
              </div>
              {!brand.remove_powered_by && (
                <p className="text-white/20 text-[9px] mt-4 tracking-widest uppercase">
                  Powered by SKINIC AI
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
