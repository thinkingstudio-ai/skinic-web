"use client";
import { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

type ApiKey = {
  id: string;
  name: string;
  tier: string;
};

type Brand = {
  app_name: string;
  tagline: string;
  logo_url: string | null;
  primary_color: string;
  remove_powered_by: boolean;
  tier: string;
  can_remove_branding: boolean;
};

const DEFAULT_BRAND: Brand = {
  app_name: "SKINIC",
  tagline: "Your skin intelligence companion",
  logo_url: null,
  primary_color: "#7c3aed",
  remove_powered_by: false,
  tier: "free",
  can_remove_branding: false,
};

const PRESET_COLORS = ["#7c3aed", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#111827"];

export default function MobileSetupClient() {
  const supabase = createClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState("");
  const [brand, setBrand] = useState<Brand>(DEFAULT_BRAND);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // The raw API key — pasted by the user (saved at creation; server never re-exposes it)
  const [rawKey, setRawKey] = useState("");

  const fetchKeys = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    try {
      const res = await fetch(`${apiUrl}/dashboard/keys`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list: ApiKey[] = data.keys || [];
        setKeys(list);
        if (list.length > 0) setSelectedKeyId((prev) => prev || list[0].id);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [supabase, apiUrl]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const fetchBrand = useCallback(async (keyId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !keyId) return;
    try {
      const res = await fetch(`${apiUrl}/dashboard/keys/${keyId}/brand`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBrand({ ...DEFAULT_BRAND, ...data });
      }
    } catch {
      // ignore
    }
  }, [supabase, apiUrl]);

  useEffect(() => {
    if (selectedKeyId) fetchBrand(selectedKeyId);
  }, [selectedKeyId, fetchBrand]);

  async function save() {
    if (!selectedKeyId) return;
    setSaving(true);
    setError("");
    setSaved(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("Session expired. Please sign in again."); setSaving(false); return; }
    try {
      const res = await fetch(`${apiUrl}/dashboard/keys/${selectedKeyId}/brand`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          app_name: brand.app_name,
          tagline: brand.tagline,
          logo_url: brand.logo_url,
          primary_color: brand.primary_color,
          remove_powered_by: brand.remove_powered_by,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Failed to save branding.");
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

  const deepLink = rawKey.trim() ? `skinic://setup?key=${encodeURIComponent(rawKey.trim())}` : "";

  function downloadQR() {
    const canvas = document.querySelector<HTMLCanvasElement>("#skinic-qr canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brand.app_name.replace(/\s+/g, "-").toLowerCase()}-skinic-qr.png`;
    a.click();
  }

  if (loading) {
    return <div className="text-white/30 text-sm py-8 text-center">Loading...</div>;
  }

  if (keys.length === 0) {
    return (
      <div className="card-glass rounded-2xl p-8 text-center max-w-3xl">
        <p className="text-white/30 text-sm mb-3">You need an API key before setting up the mobile app.</p>
        <a href="/dashboard/keys" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
          Create your first key →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Mobile App</h2>
        <p className="text-white/40 text-sm mt-0.5">
          Brand the SKINIC app for your organisation, then share a QR code with your customers. No app store submission needed.
        </p>
      </div>

      {/* Key selector */}
      <div className="card-glass rounded-2xl p-5">
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Branding applies to</label>
        <select
          value={selectedKeyId}
          onChange={(e) => setSelectedKeyId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
        >
          {keys.map((k) => (
            <option key={k.id} value={k.id} className="bg-[#0a0a0f]">
              {k.name} — {k.tier}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ─── Left: branding form ─── */}
        <div className="space-y-4">
          <div className="card-glass rounded-2xl p-5 space-y-4">
            <p className="text-sm font-semibold text-white">Branding</p>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">App name</label>
              <input
                type="text"
                maxLength={40}
                value={brand.app_name}
                onChange={(e) => setBrand({ ...brand, app_name: e.target.value })}
                placeholder="e.g. GlowScan"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Tagline</label>
              <input
                type="text"
                maxLength={80}
                value={brand.tagline}
                onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
                placeholder="e.g. Skin analysis by GlowClinic"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Logo URL</label>
              <input
                type="url"
                value={brand.logo_url || ""}
                onChange={(e) => setBrand({ ...brand, logo_url: e.target.value })}
                placeholder="https://yourdomain.com/logo.png"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <p className="text-white/25 text-xs mt-1">Square PNG, transparent background recommended.</p>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Primary colour</label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBrand({ ...brand, primary_color: c })}
                    style={{ background: c }}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      brand.primary_color.toLowerCase() === c.toLowerCase()
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f]"
                        : "hover:scale-110"
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={brand.primary_color}
                  onChange={(e) => setBrand({ ...brand, primary_color: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border border-white/10 cursor-pointer"
                />
              </div>
            </div>

            {/* Remove SKINIC branding — tier gated */}
            <div className="pt-2 border-t border-white/5">
              <label className={`flex items-center gap-3 ${brand.can_remove_branding ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
                <input
                  type="checkbox"
                  disabled={!brand.can_remove_branding}
                  checked={brand.remove_powered_by}
                  onChange={(e) => setBrand({ ...brand, remove_powered_by: e.target.checked })}
                  className="w-4 h-4 accent-violet-500"
                />
                <span className="text-sm text-white/70">Remove &quot;Powered by SKINIC AI&quot;</span>
              </label>
              {!brand.can_remove_branding && (
                <p className="text-amber-400/70 text-xs mt-1.5 ml-7">
                  Requires Pro tier or higher. <a href="/dashboard/plan" className="underline">Upgrade →</a>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all"
              >
                {saving ? "Saving..." : "Save branding"}
              </button>
              {saved && <span className="text-emerald-400 text-sm">✓ Saved</span>}
              {error && <span className="text-red-400 text-xs">{error}</span>}
            </div>
          </div>
        </div>

        {/* ─── Right: live preview + QR ─── */}
        <div className="space-y-4">
          {/* Phone preview */}
          <div className="card-glass rounded-2xl p-5">
            <p className="text-sm font-semibold text-white mb-4">Preview</p>
            <div className="mx-auto w-[200px] rounded-[2rem] border-4 border-white/10 bg-black overflow-hidden">
              <div className="px-5 py-8 flex flex-col items-center text-center" style={{ background: `linear-gradient(160deg, ${brand.primary_color}22, #050505 60%)` }}>
                {brand.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.logo_url} alt="logo" className="w-14 h-14 rounded-2xl object-contain mb-3" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl mb-3 flex items-center justify-center text-2xl font-black text-white" style={{ background: brand.primary_color }}>
                    {(brand.app_name || "S").charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="text-white font-bold text-lg leading-tight">{brand.app_name || "SKINIC"}</p>
                <p className="text-white/40 text-[10px] mt-1 leading-tight">{brand.tagline}</p>
                <div className="mt-6 w-full py-2.5 rounded-xl text-white text-xs font-semibold" style={{ background: brand.primary_color }}>
                  Scan my skin
                </div>
                {!brand.remove_powered_by && (
                  <p className="text-white/20 text-[8px] mt-6 tracking-wider">POWERED BY SKINIC AI</p>
                )}
              </div>
            </div>
          </div>

          {/* QR generator */}
          <div className="card-glass rounded-2xl p-5">
            <p className="text-sm font-semibold text-white mb-1">Customer QR code</p>
            <p className="text-white/40 text-xs mb-4">
              Paste this key&apos;s secret (saved when you created it) to generate a QR. Your customers scan it in the SKINIC app to instantly load your brand.
            </p>
            <input
              type="text"
              value={rawKey}
              onChange={(e) => setRawKey(e.target.value)}
              placeholder="Paste API key — sk-..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm font-mono focus:outline-none focus:border-violet-500/50 transition-colors mb-4"
            />
            {deepLink ? (
              <div className="flex flex-col items-center gap-3">
                <div id="skinic-qr" className="p-3 bg-white rounded-2xl">
                  <QRCodeCanvas value={deepLink} size={180} level="M" includeMargin={false} />
                </div>
                <button
                  onClick={downloadQR}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-medium hover:bg-white/10 transition-all"
                >
                  Download QR (PNG)
                </button>
                <code className="text-[10px] text-white/30 break-all text-center">{deepLink}</code>
              </div>
            ) : (
              <div className="py-10 text-center text-white/25 text-xs border border-dashed border-white/10 rounded-2xl">
                QR appears here once you paste a key
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-glass rounded-2xl p-5 border border-white/5">
        <p className="text-sm font-semibold text-white mb-2">How it works</p>
        <ol className="text-white/50 text-sm space-y-1.5 list-decimal list-inside">
          <li>Set your app name, logo and colour above, then <span className="text-white/70">Save branding</span>.</li>
          <li>Paste this key&apos;s secret to generate a QR code (or copy the deep link).</li>
          <li>Share the QR with your customers — print it, email it, or put it on your website.</li>
          <li>Customers download the SKINIC app, scan the QR, and the app instantly becomes <span className="text-white/70">{brand.app_name || "your brand"}</span>.</li>
          <li>Every scan they run counts against this key&apos;s quota — you are billed, not them.</li>
        </ol>
      </div>
    </div>
  );
}
