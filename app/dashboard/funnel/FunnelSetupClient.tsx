"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type FunnelData = {
  brand: {
    id?: string;
    slug?: string;
    lead_capture_enabled?: boolean;
    reply_to_email?: string | null;
  } | null;
  tier: string;
  scan_page_url: string | null;
  embed_snippet: string | null;
};

const PRESET_COLORS = ["#7c3aed", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#111827"];

export default function FunnelSetupClient() {
  const supabase = createClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";

  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [leadCapture, setLeadCapture] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"url" | "embed" | null>(null);

  const fetchFunnel = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    try {
      const res = await fetch(`${apiUrl}/dashboard/funnel`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data: FunnelData = await res.json();
        setFunnel(data);
        setSlug(data.brand?.slug || "");
        setLeadCapture(data.brand?.lead_capture_enabled || false);
        // Prefill reply-to with the saved value, or the owner's account email
        // so replies reach them by default without any extra setup.
        setReplyToEmail(data.brand?.reply_to_email || session.user?.email || "");
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [supabase, apiUrl]);

  useEffect(() => { fetchFunnel(); }, [fetchFunnel]);

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("Session expired."); setSaving(false); return; }
    try {
      const res = await fetch(`${apiUrl}/dashboard/funnel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ slug: slug.trim().toLowerCase(), lead_capture_enabled: leadCapture, reply_to_email: replyToEmail.trim() }),
      });
      let data: FunnelData & { detail?: string } = { brand: null, tier: "free", scan_page_url: null, embed_snippet: null };
      try { data = await res.json(); } catch { /* non-JSON body */ }
      if (!res.ok) {
        setError(data.detail || `Server error (${res.status})`);
      } else {
        setFunnel((prev) => prev ? { ...prev, ...data } : data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error.");
    }
    setSaving(false);
  }

  function copy(text: string, type: "url" | "embed") {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  }

  if (loading) return <div className="text-white/30 text-sm py-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Scan Page Setup</h2>
        <p className="text-white/40 text-sm mt-0.5">
          Create a branded skin profiling page for your customers — no app download required.
          Share the link or embed it on your website.
        </p>
      </div>

      {/* Slug + lead capture */}
      <div className="card-glass rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-white">Page URL</p>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Choose your unique slug</label>
          <div className="flex items-center gap-0 rounded-xl bg-white/5 border border-white/10 overflow-hidden focus-within:border-violet-500/50 transition-colors">
            <span className="px-3 py-2.5 text-sm text-white/30 border-r border-white/10 shrink-0">
              skinic.app/b/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="your-brand"
              maxLength={40}
              className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-white/20 text-sm focus:outline-none"
            />
          </div>
          <p className="text-white/25 text-xs mt-1">3-40 characters: lowercase letters, numbers, hyphens.</p>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
          <svg className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-sm text-white/70 font-medium">Email-gated reports</p>
            <p className="text-xs text-white/35 mt-0.5">Every customer enters their email before scanning. The full skin report is delivered to their inbox — and the lead is saved to your customer list automatically.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1.5">Reply-to email</label>
          <input
            type="email"
            value={replyToEmail}
            onChange={(e) => setReplyToEmail(e.target.value)}
            placeholder="you@yourbrand.com"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <p className="text-white/25 text-xs mt-1">Reports are sent under your brand name. When a customer replies, it goes to this address.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving || !slug.trim()}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all"
          >
            {saving ? "Saving..." : "Save & Publish"}
          </button>
          {saved && <span className="text-emerald-400 text-sm">✓ Published</span>}
          {error && <span className="text-red-400 text-xs">{error}</span>}
        </div>
      </div>

      {/* Live links — only shown after slug is set */}
      {funnel?.scan_page_url && (
        <div className="card-glass rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-white">Share with customers</p>

          {/* Scan page URL */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Direct link</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-violet-300 text-xs font-mono truncate">
                {funnel.scan_page_url}
              </code>
              <button
                onClick={() => copy(funnel.scan_page_url!, "url")}
                className="shrink-0 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 transition-all"
              >
                {copied === "url" ? "✓ Copied" : "Copy"}
              </button>
              <a
                href={funnel.scan_page_url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 transition-all"
              >
                Open →
              </a>
            </div>
          </div>

          {/* Embed snippet */}
          {funnel.embed_snippet && (
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Embed on your website</label>
              <div className="relative">
                <pre className="px-3 py-3 rounded-xl bg-white/3 border border-white/8 text-white/40 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                  {funnel.embed_snippet}
                </pre>
                <button
                  onClick={() => copy(funnel.embed_snippet!, "embed")}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded-lg bg-white/10 text-white/50 text-[10px] font-medium hover:bg-white/20 transition-all"
                >
                  {copied === "embed" ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      <div className="card-glass rounded-2xl p-5 border border-white/5">
        <p className="text-sm font-semibold text-white mb-3">How it works</p>
        <ol className="text-white/40 text-sm space-y-2 list-decimal list-inside">
          <li>Set your slug above and click <span className="text-white/60">Save &amp; Publish</span>.</li>
          <li>Share the link — post it on Instagram, WhatsApp, your website, or print as a QR.</li>
          <li>Customers take a selfie and enter their email to receive their report.</li>
          <li>The AI runs only after the email is given — so every scan captures a lead.</li>
          <li>The full skin profile &amp; product recommendations are emailed to the customer, and the lead is saved to your Customer DB.</li>
        </ol>
      </div>
    </div>
  );
}
