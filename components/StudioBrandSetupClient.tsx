"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function resizeToBlob(file: File, maxPx = 400, quality = 0.88): Promise<{ blob: Blob; isSvg: boolean }> {
    if (file.type === "image/svg+xml") {
      return { blob: file, isSvg: true };
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width > height) { height = Math.round((height / width) * maxPx); width = maxPx; }
          else { width = Math.round((width / height) * maxPx); height = maxPx; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => blob ? resolve({ blob, isSvg: false }) : reject(new Error("Resize failed")),
          "image/png"
        );
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function uploadLogo(file: File) {
    setUploadError("");
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setUploadError("Only PNG, JPG, GIF, WebP, or SVG allowed.");
      return;
    }
    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setUploadError("Session expired.");
      setUploading(false);
      return;
    }
    let blob: Blob;
    let ext: string;
    try {
      const result = await resizeToBlob(file);
      blob = result.blob;
      ext = result.isSvg ? "svg" : "png";
    } catch {
      setUploadError("Could not process image. Please try another file.");
      setUploading(false);
      return;
    }
    const path = `${session.user.id}/logo.${ext}`;
    const contentType = ext === "svg" ? "image/svg+xml" : "image/png";
    const { error: upErr } = await supabase.storage
      .from("brand-assets")
      .upload(path, blob, { upsert: true, contentType });
    if (upErr) {
      setUploadError(upErr.message || "Upload failed.");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("brand-assets").getPublicUrl(path);
    setBrand((prev) => ({ ...prev, logo_url: `${urlData.publicUrl}?t=${Date.now()}` }));
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
    e.target.value = "";
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
              placeholder="e.g. Your personalised skin profile"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Logo</label>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white/70 text-sm transition-all"
              >
                {uploading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload logo
                  </>
                )}
              </button>
              <span className="text-white/20 text-xs">or</span>
              <input
                type="url"
                value={brand.logo_url}
                onChange={(e) => setBrand({ ...brand, logo_url: e.target.value })}
                placeholder="https://yourdomain.com/logo.png"
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-xs focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            {uploadError && (
              <p className="text-red-400 text-xs mt-1">{uploadError}</p>
            )}
            <p className="text-white/25 text-xs mt-1">
              PNG, JPG, SVG — max 2 MB. Square with transparent background works best.
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
