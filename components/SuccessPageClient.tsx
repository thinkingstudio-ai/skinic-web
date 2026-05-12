"use client";
import { useState, useEffect } from "react";

export default function SuccessPageClient() {
  const [key, setKey]   = useState("");
  const [tier, setTier] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setKey(p.get("key") || "");
    setTier(p.get("tier") || "free");
    setName(p.get("name") || "");
  }, []);

  function copyKey() {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!key) {
    return (
      <div className="text-center text-white/40 text-sm">
        Invalid or missing API key. <a href="/signup" className="text-violet-400">Sign up again</a>.
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="card-glass rounded-2xl p-8 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-sm">Email verified!</p>
            <p className="text-white/40 text-xs">Welcome{name ? `, ${name}` : ""} — here's your API key</p>
          </div>
        </div>

        <p className="text-amber-400/80 text-xs font-medium mb-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          ⚠ Save this key immediately — it will never be shown again.
        </p>

        <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-4 font-mono text-sm text-emerald-300 break-all mb-3">
          {key}
        </div>

        <button
          onClick={copyKey}
          className="w-full py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-colors mb-6"
        >
          {copied ? "✓ Copied!" : "Copy API Key"}
        </button>

        <div className="space-y-1.5 text-sm text-white/40 mb-6">
          <div className="flex justify-between">
            <span>Tier</span>
            <span className="text-white/70 capitalize">{tier}</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-emerald-400">Active</span>
          </div>
        </div>

        <div className="p-4 bg-white/3 rounded-xl border border-white/5 text-xs text-white/35 space-y-1.5">
          <p className="font-semibold text-white/50 mb-2">Next steps:</p>
          <p>1. Include <code className="text-violet-300">X-API-Key: your_key</code> in every request</p>
          <p>2. POST to <code className="text-violet-300">https://api.skinic.app/analyze</code></p>
          <p>3. Check usage: GET <code className="text-violet-300">https://api.skinic.app/usage</code></p>
          <p>4. <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="text-violet-400">Read the API docs →</a></p>
        </div>
      </div>

      <p className="text-center text-white/20 text-xs mt-4">
        Need to upgrade?{" "}
        <a href="/pricing" className="text-violet-400 hover:text-violet-300">View pricing</a>
      </p>
    </div>
  );
}
